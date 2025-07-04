import {Injectable, inject} from "@angular/core";
import {Observable} from "rxjs";
import {ApiService} from "@/core/api";
import {NotificationDto, Result} from "@/core/api/models";
import {PredefinedDateRanges} from "@/shared/utils";
import {BaseHubConnection} from "./base-hub-connection";
import {TenantService} from "./tenant.service";

@Injectable({providedIn: "root"})
export class NotificationService extends BaseHubConnection {
  private readonly apiService = inject(ApiService);

  constructor() {
    const tenantService = inject(TenantService);

    super("notification", tenantService);
  }

  set onReceiveNotification(callback: OnReceiveNotifictionFn) {
    this.hubConnection.on("ReceiveNotification", callback);
  }

  getPastTwoWeeksNotifications(): Observable<Result<NotificationDto[]>> {
    const pastTwoWeeksDateRange = PredefinedDateRanges.getPastTwoWeeks();
    return this.apiService.getNotifications(
      pastTwoWeeksDateRange.startDate,
      pastTwoWeeksDateRange.endDate
    );
  }

  markAsRead(notificationId: string): Observable<Result> {
    return this.apiService.updateNotification({
      id: notificationId,
      isRead: true,
    });
  }
}

type OnReceiveNotifictionFn = (notification: NotificationDto) => void;
