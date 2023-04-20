import {Component} from '@angular/core';
import {AuthService} from "../../data/auth/auth.service";
import {map, share, switchMap} from "rxjs";
import {NotificationService} from "../../core/notification/notification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {

  protected readonly user = this.authService.getUser().pipe(share());
  protected readonly authState = this.user.pipe(map(user => !!user?.id));

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
  ) {
  }

  get next(): string | undefined {
    const url = this.router.url.substring(1);
    return url.length === 0 ? undefined : url;
  }

  protected logout(): void {
    this.authService.logout()
      .pipe(switchMap(() => this.router.navigate(['login'])))
      .subscribe(() => this.notificationService.success($localize`Logout was successful.`));
  }
}
