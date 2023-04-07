import {inject, NgModule} from '@angular/core';
import {CanActivateFn, Router, RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login.component';
import {AuthService} from "../../data/auth/auth.service";
import {NotificationService} from "../../core/notification/notification.service";
import {map, skip} from "rxjs";

const FN: CanActivateFn = route => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return authService.getUser()
    .pipe(
      skip(authService.isUpdateInProgress() ? 1 : 0),
      map(user => {
        const id = user?.id;

        if (id === undefined || id === null) {
          return true;
        } else {
          notificationService.info("You are already logged in.");
          const next = route.queryParams['next'] ?? 'dashboard';
          return router.parseUrl(`/${next}`);
        }
      }),
    )
};

const routes: Routes = [
  {path: '', component: LoginComponent, canActivate: [FN]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {
}
