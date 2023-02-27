import {Component, HostBinding, Input} from "@angular/core";
import {Notification} from "../notification.domain";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.scss"],
})
export class NotificationComponent {

  @Input()
  public notification?: Notification;

  protected get durationPercentage(): number {
    if (!this.notification) {
      return 100;
    }

    return this.notification.remainingDuration / this.notification?.initialDuration * 100;
  }

  @HostBinding("class.success")
  private get good(): boolean {
    return this.notification?.flavor === "success";
  }

  @HostBinding("class.error")
  private get danger(): boolean {
    return this.notification?.flavor === "error";
  }
}
