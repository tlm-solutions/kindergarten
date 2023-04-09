import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../data/auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, EMPTY, switchMap, take} from "rxjs";
import {NotificationService} from "../../core/notification/notification.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {

  protected readonly form = new FormGroup({
    email: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    password: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
  });

  protected readonly wrongCredentials = new BehaviorSubject<boolean>(false);
  protected readonly loading = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
  ) {
  }

  public ngOnDestroy():void {
    this.wrongCredentials.complete();
    this.loading.complete();
}

  protected login(): void {
    if (this.loading.value || !this.form.valid) {
      return;
    }

    const {email, password} = this.form.getRawValue();
    this.loading.next(true);

    this.authService.login(email, password)
      .pipe(
        switchMap(response => {
          if (response.success) {
            this.notificationService.success(`Successfully logged in as ${response.name}.`)
            const next = this.route.snapshot.queryParams['next'] ?? 'dashboard';
            return this.router.navigateByUrl(this.router.parseUrl(`/${next}`));
          }

          return EMPTY;
        }),
        take(1),
      )
      .subscribe({
        error: () => {
          this.wrongCredentials.next(true)
          this.loading.next(false);
        },
      });
  }
}
