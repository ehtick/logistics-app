﻿namespace Logistics.Sdk;

public interface IApiClient : ILoadApi, ITruckApi, IEmployeeApi, ITenantApi
{
    string? AccessToken { get; set; }
}