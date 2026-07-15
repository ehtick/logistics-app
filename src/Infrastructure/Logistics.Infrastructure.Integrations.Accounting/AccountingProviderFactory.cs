using Logistics.Application.Abstractions.Accounting;
using Logistics.Domain.Entities;
using Logistics.Domain.Primitives.Enums;
using Logistics.Infrastructure.Integrations.Accounting.Providers;
using Logistics.Infrastructure.Integrations.Accounting.Providers.QuickBooks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Logistics.Infrastructure.Integrations.Accounting;

internal sealed class AccountingProviderFactory(
    IServiceProvider serviceProvider,
    ILogger<AccountingProviderFactory> logger) : IAccountingProviderFactory
{
    public IAccountingProviderService GetProvider(AccountingProviderType providerType)
    {
        IAccountingProviderService service = providerType switch
        {
            AccountingProviderType.QuickBooksOnline => serviceProvider.GetRequiredService<QuickBooksOnlineService>(),
            AccountingProviderType.Demo => serviceProvider.GetRequiredService<DemoAccountingService>(),
            _ => throw new NotSupportedException($"Accounting provider '{providerType}' is not supported")
        };

        logger.LogDebug("Created accounting provider service for {ProviderType}", providerType);
        return service;
    }

    public IAccountingProviderService GetProvider(AccountingProviderConfiguration configuration)
    {
        var service = GetProvider(configuration.ProviderType);
        service.Initialize(configuration);
        return service;
    }

    public bool IsProviderSupported(AccountingProviderType providerType) =>
        providerType is AccountingProviderType.QuickBooksOnline or AccountingProviderType.Demo;
}
