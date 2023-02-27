import {NgModule} from "@angular/core";
import {NotificationListComponent} from "./notification-list/notification-list.component";
import {NotificationComponent} from "./notification/notification.component";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    NotificationListComponent,
    NotificationComponent,
  ],
  exports: [
    NotificationComponent,
    NotificationListComponent,
  ],
  imports: [CommonModule],
})
export class NotificationModule {
}
