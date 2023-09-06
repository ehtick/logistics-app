﻿using Logistics.Models;

namespace Logistics.Client.Abstractions;

public interface IDriverApi
{
    Task<ResponseResult<DriverDashboardDto>> GetDriverDashboardDataAsync(string userId);
    Task<ResponseResult> SetDriverDeviceTokenAsync(string userId, string token);
}