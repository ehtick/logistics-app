﻿namespace Logistics.Application.Handlers.Queries;

internal sealed class GetUsersQueryHandler : RequestHandlerBase<GetUsersQuery, PagedDataResult<UserDto>>
{
    private readonly ITenantRepository<User> _userRepository;

    public GetUsersQueryHandler(ITenantRepository<User> userRepository)
    {
        _userRepository = userRepository;
    }

    protected override Task<PagedDataResult<UserDto>> HandleValidated(
        GetUsersQuery request, 
        CancellationToken cancellationToken)
    {
        var totalItems = _userRepository.GetQuery().Count();
        var itemsQuery = _userRepository.GetQuery();

        if (!string.IsNullOrEmpty(request.Search))
        {
            itemsQuery = _userRepository.GetQuery(new UsersSpecification(request.Search));
        }

        var items = itemsQuery
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(i => new UserDto
            {
                Id = i.Id,
                Email = i.Email,
                ExternalId = i.ExternalId,
                FirstName = i.FirstName,
                LastName = i.LastName,
                PhoneNumber = i.PhoneNumber,
                UserName = i.UserName,
            })
            .ToArray();

        var totalPages = (int)Math.Ceiling(totalItems / (double)request.PageSize);
        return Task.FromResult(new PagedDataResult<UserDto>(items, totalItems, totalPages));
    }

    protected override bool Validate(GetUsersQuery request, out string errorDescription)
    {
        errorDescription = string.Empty;

        if (request.Page <= 0)
        {
            errorDescription = "Page number should be non-negative";
        }
        else if (request.PageSize <= 1)
        {
            errorDescription = "Page size should be greater than one";
        }

        return string.IsNullOrEmpty(errorDescription);
    }
}