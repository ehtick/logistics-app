﻿using MediatR;

namespace Logistics.Application.Tenant.Commands;

public class UpdateLoadProximityCommand : IRequest<Result>
{
    public string LoadId { get; set; } = default!;
    public bool? CanConfirmPickUp { get; set; }
    public bool? CanConfirmDelivery { get; set; }
}
