import {Injectable, OnDestroy} from "@angular/core";
import {interval, Subscription} from "rxjs";
import {DEFAULT_NOTIFICATION_DURATION, Notification, NotificationFlavor} from "./notification.domain";

@Injectable({
  providedIn: "root",
})
export class NotificationService implements OnDestroy {

  private notifications0: Notification[];
  private intervall: Subscription | null;

  constructor() {
    this.notifications0 = [];
    this.intervall = null;
  }

  public get notifications() {
    return this.notifications0;
  }

  public ngOnDestroy(): void {
    this.intervall?.unsubscribe();
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
    this.notifications0.push(notification);
    setTimeout(() => notification.remainingDuration--, 1);
    this.checkIntervall();
  }

  private checkIntervall() {
    if (this.intervall) {
      return;
    }

    this.intervall = interval(500)
      .subscribe(() => {
        this.notifications0 = this.notifications0.filter(notification => notification.remainingDuration-- > 0);

        if (!this.notifications0.length) {
          this.intervall?.unsubscribe();
          this.intervall = null;
        }
      });
  }
}
