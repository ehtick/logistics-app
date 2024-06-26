﻿using Logistics.Shared.Consts;
using MediatR;

namespace Logistics.Application.Tenant.Commands;

public class UpdateEmployeeCommand : IRequest<Result>
{
    public string UserId { get; set; } = default!;
    public string? Role { get; set; }
    public decimal? Salary { get; set; }
    public SalaryType? SalaryType { get; set; }
}
