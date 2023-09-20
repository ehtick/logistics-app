﻿using Logistics.Models;

namespace Logistics.Application.Tenant.Queries;

public class GetTruckByDriverQuery : Request<ResponseResult<TruckDto>>
{
    public required string UserId { get; set; }
    public bool IncludeLoads { get; set; }
    public bool IncludeOnlyActiveLoads { get; set; }
}
