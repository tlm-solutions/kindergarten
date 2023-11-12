import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {filter, map} from "rxjs";
import {SidebarService} from "./layout/sidebar/sidebar.service";
import {routingAnimation} from "./core/animation/routing.animation";
import {SidebarComponent} from "./layout/sidebar/sidebar.component";
import {HeaderComponent} from "./layout/header/header.component";
import {NotificationListComponent} from "@feel/notification";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, RouterOutlet, NotificationListComponent],
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
