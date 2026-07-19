import { Component, computed, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { FeatureService } from "@logistics/shared/services";

interface SettingsTab {
  label: string;
  route: string;
}

/**
 * Tabbed shell for the settings pages. The tab bar is a row of plain `routerLink` anchors (styled
 * to mimic `ui-tab-list`) rather than `ui-tabs`, because the shared tabs component is content-only
 * and not router-aware. Note "Plan & Billing" links outside `/settings` to `/subscription/manage`.
 */
@Component({
  selector: "app-settings-layout",
  templateUrl: "./settings-layout.html",
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
})
export class SettingsLayoutComponent {
  private readonly featureService = inject(FeatureService);

  protected readonly tabs = computed<SettingsTab[]>(() => {
    const tabs: SettingsTab[] = [
      { label: "Company", route: "/settings/company" },
      { label: "Payments", route: "/settings/payments" },
      { label: "Plan & Billing", route: "/subscription/manage" },
      { label: "Features", route: "/settings/features" },
    ];

    if (this.featureService.isEnabled("mcp_server")) {
      tabs.push({ label: "API Keys", route: "/settings/api-keys" });
    }
    if (this.featureService.isEnabled("accounting")) {
      tabs.push({ label: "Accounting", route: "/settings/accounting" });
    }

    tabs.push({ label: "Privacy", route: "/settings/privacy" });
    return tabs;
  });
}
