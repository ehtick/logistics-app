import {Observable} from "rxjs";
import {ApiBase} from "./api-base";
import {
  CancelSubscriptionCommand,
  RenewSubscriptionCommand,
  Result,
  SubscriptionPlanDto,
} from "./models";

export class SubscriptionApi extends ApiBase {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  getSubscriptionPlans(): Observable<Result<SubscriptionPlanDto[]>> {
    return this.get("/subscriptions/plans");
  }

  cancelSubscription(command: CancelSubscriptionCommand): Observable<Result> {
    return this.put(`/subscriptions/${command.id}/cancel`, command);
  }

  renewSubscription(command: RenewSubscriptionCommand): Observable<Result> {
    return this.put(`/subscriptions/${command.id}/renew`, command);
  }
}
