import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, map} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  protected readonly sidebar = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => this.route.root.firstChild?.snapshot?.data?.['sidebar'] !== false),
  );

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
  }
}
