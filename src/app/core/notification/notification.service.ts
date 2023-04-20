import {Injectable, OnDestroy} from "@angular/core";
import {BehaviorSubject, interval, Observable, Subscription} from "rxjs";
import {DEFAULT_NOTIFICATION_DURATION, Notification, NotificationFlavor} from "./notification.domain";

@Injectable({
  providedIn: "root",
})
export class NotificationService implements OnDestroy {

  private notifications = new BehaviorSubject<Notification[]>([]);
  private intervall: Subscription | null;

  constructor() {
    this.intervall = null;
  }

  public getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  public ngOnDestroy(): void {
    this.intervall?.unsubscribe();
    this.notifications.complete();
  }

  public success(text: string): void {
    console.info("Notification:", text);
    this.notify(text, "success");
  }

  public error(text: string): void {
    console.error("Notification:", text);
    this.notify(text, "error");
  }

  public info(text: string) {
    console.info("Notification:", text);
    this.notify(text, "info");
  }

  public notify(text: string, flavor: NotificationFlavor) {
    const initialDuration = DEFAULT_NOTIFICATION_DURATION * 2;
    const notification = {id: Date.now(), text, flavor, remainingDuration: initialDuration, initialDuration};

    const notifications = [...this.notifications.value];
    notifications.push(notification);
    this.notifications.next(notifications);

    setTimeout(() => notification.remainingDuration--, 1);
    this.checkIntervall();
  }

  private checkIntervall() {
    if (this.intervall) {
      return;
    }

    this.intervall = interval(500)
      .subscribe(() => {
        const notifications = this.notifications.value.filter(notification => notification.remainingDuration-- > 0);
        this.notifications.next(notifications);

        if (!notifications.length) {
          this.intervall?.unsubscribe();
          this.intervall = null;
        }
      });
  }
}
