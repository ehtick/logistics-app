using Logistics.Application.Abstractions.Common;
using Logistics.Application.Attributes;
using Logistics.Domain.Primitives.Enums;

namespace Logistics.Application.Modules.Integrations.Accounting.Commands;

/// <summary>
///     Disconnect the current tenant's QuickBooks Online integration: revoke the token at the
///     provider and deactivate the stored configuration.
/// </summary>
[RequiresFeature(TenantFeature.Accounting)]
public class DisconnectQuickBooksCommand : ICommand;
