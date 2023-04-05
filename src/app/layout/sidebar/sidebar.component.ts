import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {AuthService} from "../../data/auth/auth.service";
import {map, switchMap} from "rxjs";
import {NotificationService} from "../../core/notification/notification.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  protected readonly color = new FormControl('#fff');
  protected readonly authState = this.authService.getUser().pipe(
    map(user => !user?.id)
  );

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
  ) {
  }

  ngOnInit() {
    this.color.valueChanges.subscribe(color => {
      const s = document.body.style;
      s.setProperty('--color-primary', color);
    })
  }

  get next(): string | undefined {
    const url = this.router.url.substring(1);
    return url.length === 0 ? undefined : url;
  }

  protected logout(): void {
    this.authService.logout()
      .pipe(switchMap(() => this.router.navigate(['login'])))
      .subscribe(() => this.notificationService.success("Logout was successful."));
  }
}
