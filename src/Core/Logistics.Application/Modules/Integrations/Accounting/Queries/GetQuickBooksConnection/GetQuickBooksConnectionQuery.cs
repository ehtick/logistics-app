using Logistics.Application.Abstractions.Common;
using Logistics.Application.Attributes;
using Logistics.Domain.Primitives.Enums;
using Logistics.Shared.Models;

namespace Logistics.Application.Modules.Integrations.Accounting.Queries;

/// <summary>
///     Get the current tenant's QuickBooks Online connection status for the settings page.
/// </summary>
[RequiresFeature(TenantFeature.Accounting)]
public class GetQuickBooksConnectionQuery : IQuery<Result<AccountingConnectionDto>>;
