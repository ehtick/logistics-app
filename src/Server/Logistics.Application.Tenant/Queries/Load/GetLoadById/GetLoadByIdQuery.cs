﻿using Logistics.Shared.Models;
using MediatR;

namespace Logistics.Application.Tenant.Queries;

public class GetLoadByIdQuery : IRequest<Result<LoadDto>>
{
    public string Id { get; set; } = default!;
}
