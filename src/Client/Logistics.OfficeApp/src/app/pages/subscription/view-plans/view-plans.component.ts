import {CurrencyPipe} from "@angular/common";
import {Component, OnInit, inject, signal} from "@angular/core";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {ApiService} from "@/core/api";
import {SubscriptionPlanDto} from "@/core/api/models";
import {TenantService} from "@/core/services";

@Component({
  selector: "app-view-plans",
  imports: [CardModule, CurrencyPipe, ButtonModule],
  templateUrl: "./view-plans.component.html",
})
export class ViewPlansComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly tenantService = inject(TenantService);

  readonly subscriptionPlans = signal<SubscriptionPlanDto[]>([]);

  ngOnInit(): void {
    this.apiService.subscriptionApi.getSubscriptionPlans().subscribe((result) => {
      if (result.success && result.data) {
        this.subscriptionPlans.set(result.data);
      }
    });
  }

  isCurrentPlan(plan: SubscriptionPlanDto): boolean {
    const currentPlanId = this.tenantService.getTenantData()?.subscription?.plan?.id;
    return currentPlanId === plan.id;
  }
}
