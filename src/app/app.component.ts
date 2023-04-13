import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, map} from "rxjs";
import {routingAnimation} from "./core/animation/routing.animation";
import {SidebarService} from "./layout/sidebar/sidebar.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [routingAnimation]
})
export class AppComponent {

  protected readonly layout = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => {
      const data = this.route.root.firstChild?.snapshot?.data;

      return {
        sidebar: data?.['sidebar'] !== false,
        header: data?.['header'] !== false,
      };
    }),
  );

  protected readonly sidebar = this.sidebarService.isShown();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly sidebarService: SidebarService,
  ) {
  }
}
