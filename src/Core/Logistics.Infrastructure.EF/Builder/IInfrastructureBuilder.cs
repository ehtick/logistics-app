﻿using Logistics.Infrastructure.EF.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Logistics.Infrastructure.EF.Builder;

public interface IInfrastructureBuilder
{
    IInfrastructureBuilder AddIdentity(Action<IdentityBuilder>? configure = null);
    IInfrastructureBuilder AddMasterDatabase(Action<MasterDbContextOptions>? configure = null);
    IInfrastructureBuilder AddTenantDatabase(Action<TenantDbContextOptions>? configure = null);
    IInfrastructureBuilder UseLogger(ILogger<IInfrastructureBuilder> logger);
}