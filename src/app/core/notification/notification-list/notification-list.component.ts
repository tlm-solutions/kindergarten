import {ChangeDetectionStrategy, Component} from "@angular/core";
import {NotificationService} from "../notification.service";
import {IdHolder} from "../../../data/base/data.domain";
import {fadeAnimation} from "../../animation/fade.animation";

@Component({
  selector: "app-notification-list",
  templateUrl: "./notification-list.component.html",
  styleUrls: ["./notification-list.component.scss"],
  animations: [fadeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationListComponent {

  protected notifications = this.notificationService.getNotifications();

  constructor(
    private readonly notificationService: NotificationService,
  ) {
  }

  protected trackBy<T>(index: number, {id}: IdHolder<T>): T {
    return id;
  }
}
