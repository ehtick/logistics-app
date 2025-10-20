using Logistics.Application.Abstractions;
using Logistics.Application.Services;
using Logistics.Domain.Entities;
using Logistics.Domain.Persistence;
using Logistics.Domain.Primitives.Enums;
using Logistics.Shared.Models;
using Microsoft.Extensions.Logging;

namespace Logistics.Application.Commands;

internal sealed class UpdateTripHandler : IAppRequestHandler<UpdateTripCommand, Result>
{
    private readonly ILoadService _loadService;
    private readonly ILogger<UpdateTripHandler> _logger;
    private readonly ITenantUnitOfWork _uow;

    public UpdateTripHandler(ITenantUnitOfWork uow, ILoadService loadService, ILogger<UpdateTripHandler> logger)
    {
        _uow = uow;
        _loadService = loadService;
        _logger = logger;
    }

    public async Task<Result> Handle(UpdateTripCommand req, CancellationToken ct)
    {
        var trip = await _uow.Repository<Trip>().GetByIdAsync(req.TripId, ct);
        if (trip is null)
        {
            return Result.Fail($"Trip '{req.TripId}' not found.");
        }

        if (trip.Status != TripStatus.Draft)
        {
            return Result.Fail("Only trips in 'Draft' status can be updated.");
        }

        // Name field
        if (!string.IsNullOrEmpty(req.Name) && trip.Name != req.Name)
        {
            trip.Name = req.Name!;
        }

        // Truck swap
        if (req.TruckId is { } newTruckId && newTruckId != trip.TruckId)
        {
            var newTruck = await _uow.Repository<Truck>().GetByIdAsync(newTruckId, ct);
            if (newTruck is null)
            {
                return Result.Fail($"Truck '{newTruckId}' not found.");
            }

            trip.TruckId = newTruck.Id;
            trip.Truck = newTruck;
        }

        // A map of current loads on the trip for easy access, key is the load ID and value is the load entity
        var loadsMap = trip.GetLoads().ToDictionary(l => l.Id);

        var removedCount = RemoveLoads(trip, loadsMap, req.DetachedLoadIds);

        var attachResult = await AttachExistingLoadsAsync(trip, loadsMap, req.AttachedLoadIds, ct);
        if (!attachResult.Success)
        {
            return Result.Fail(attachResult.Error!);
        }

        var attachedCount = attachResult.Data;
        var createdCount = await CreateNewLoadsAsync(trip, loadsMap, req.NewLoads);

        // Convert optimized stops DTOs to domain entities if provided
        if (req.OptimizedStops != null && req.OptimizedStops.Any())
        {
            var optimizedStops = ConvertOptimizedStopsToDomain(trip, loadsMap, req.OptimizedStops);
            trip.UpdateTripStops(optimizedStops);
        }

        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation(
            "Updated trip '{TripId}'. Name='{Name}', Truck='{TruckId}'. Loads={LoadCount} (attached {Attached}, created {Created}, removed {Removed})",
            trip.Id, trip.Name, trip.TruckId, loadsMap.Count, attachedCount, createdCount,
            removedCount);

        return Result.Ok();
    }

    private int RemoveLoads(Trip trip, Dictionary<Guid, Load> loadsMap, IEnumerable<Guid>? loadIdsToRemove)
    {
        if (loadIdsToRemove is null)
        {
            return 0;
        }

        var before = loadsMap.Count;
        foreach (var loadId in loadIdsToRemove.Distinct())
        {
            if (loadsMap.Remove(loadId, out var load))
            {
                trip.RemoveLoad(loadId);
                _uow.Repository<Load>().Delete(load);
            }
        }

        return before - loadsMap.Count;
    }

    private async Task<Result<int>> AttachExistingLoadsAsync(
        Trip trip,
        Dictionary<Guid, Load> loadsMap,
        IEnumerable<Guid>? attachIds,
        CancellationToken ct)
    {
        var count = 0;
        if (attachIds is null)
        {
            return Result<int>.Ok(count);
        }

        var ids = attachIds.Distinct().Where(id => !loadsMap.ContainsKey(id)).ToArray();
        if (ids.Length == 0)
        {
            return Result<int>.Ok(count);
        }

        var toAttach = await _uow.Repository<Load>().GetListAsync(l => ids.Contains(l.Id), ct);

        foreach (var load in toAttach)
        {
            if (load.Status != LoadStatus.Draft)
            {
                return Result<int>.Fail(
                    $"Only loads in 'Draft' status can be attached. Load '{load.Id}' is in '{load.Status}' status.");
            }

            load.AssignedTruckId = trip.TruckId;
            load.AssignedTruck = trip.Truck;

            // If the load already has trip stops, we need to remove them first from the previous trip
            // to avoid duplicates. This can happen if the load was previously attached to another trip.
            if (load.TripStops.Count > 0)
            {
                var previousTrip = await _uow.Repository<Trip>().GetByIdAsync(load.TripStops.First().TripId, ct);
                previousTrip?.RemoveLoad(load.Id);
            }

            // Add the existing load to the new trip
            trip.AddLoads([load]);

            loadsMap[load.Id] = load;
            count++;
        }

        return Result<int>.Ok(count);
    }

    private async Task<int> CreateNewLoadsAsync(
        Trip trip,
        Dictionary<Guid, Load> loadsMap,
        IEnumerable<CreateTripLoadCommand>? newLoadCommands)
    {
        if (newLoadCommands is null)
        {
            return 0;
        }

        var createdCount = 0;
        var loadParametersList = new List<CreateLoadParameters>();

        foreach (var c in newLoadCommands)
        {
            var createLoadParameters = new CreateLoadParameters(
                c.Name,
                c.Type,
                (c.OriginAddress, c.OriginLocation),
                (c.DestinationAddress, c.DestinationLocation),
                c.DeliveryCost,
                c.Distance,
                c.CustomerId,
                trip.TruckId,
                c.AssignedDispatcherId,
                trip.Id);

            loadParametersList.Add(createLoadParameters);
            createdCount++;
        }

        var newLoads = await _loadService.CreateLoadsAsync(loadParametersList);
        foreach (var load in newLoads)
        {
            loadsMap[load.Id] = load;
        }

        return createdCount;
    }

    /// <summary>
    ///     Converts optimized stop DTOs to domain TripStop entities.
    /// </summary>
    private List<TripStop> ConvertOptimizedStopsToDomain(
        Trip trip,
        Dictionary<Guid, Load> loadMap,
        IEnumerable<TripStopDto> optimizedStops)
    {
        var tripStops = new List<TripStop>();

        foreach (var stopDto in optimizedStops)
        {
            if (!loadMap.TryGetValue(stopDto.LoadId, out var load))
            {
                _logger.LogWarning("Load with ID '{LoadId}' not found for optimized stop", stopDto.LoadId);
                continue;
            }

            // Find the existing TripStop ID
            var tripStopId = loadMap[stopDto.LoadId]
                .TripStops
                .First(s => s.LoadId == stopDto.LoadId && s.Type == stopDto.Type)
                .Id;

            var tripStop = new TripStop
            {
                Id = tripStopId,
                Order = stopDto.Order,
                Type = stopDto.Type,
                Address = stopDto.Address,
                Location = stopDto.Location,
                Load = load,
                LoadId = load.Id,
                Trip = trip,
                TripId = trip.Id
            };

            tripStops.Add(tripStop);
        }

        return tripStops;
    }
}
