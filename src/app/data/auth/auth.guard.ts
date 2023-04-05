import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {map, skip} from "rxjs";
import {NotificationService} from "../../core/notification/notification.service";

export const AUTH_CAN_ACTIVATE: CanActivateFn = (_, state) => {
  console.log("Checking can activate, because of auth status.");

  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return authService.getUser()
    .pipe(
      skip(authService.isUpdateInProgress() ? 1 : 0),
      map(user => {
        const id = user?.id;

        if (id === undefined || id === null) {
          notificationService.info("You need to be logged in.");
          return router.createUrlTree(['login'], {queryParams: {next: state.url}});
        } else {
          return true;
        }
      }),
    )
};
