import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../data/auth/auth.service";
import {Router} from "@angular/router";
import {EMPTY, switchMap} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  protected readonly form = new FormGroup({
    email: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    password: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
  }

  protected login(): void {
    if (!this.form.valid) {
      return;
    }

    const {email, password} = this.form.getRawValue();

    this.authService.login(email, password)
      .pipe(
        switchMap(response => {
          if (response.success) {
            return this.router.navigate(['dashboard']);
          }

          return EMPTY;
        })
      )
      .subscribe();
  }
}
