import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, filter, Subscription} from "rxjs";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {routingAnimation} from "../../core/animation/routing.animation";
import {SidebarService} from "../sidebar/sidebar.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [routingAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {

  protected readonly title = new BehaviorSubject<string>(this.route.root.firstChild?.snapshot?.data['title'])
  private subscription: Subscription | undefined;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly _title: Title,
    private readonly sidebarService: SidebarService,
  ) {
  }

  public ngOnInit(): void {
    this.subscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const title = this.route.root.firstChild?.snapshot?.data?.['title'];
        this.title.next(title);
        this._title.setTitle(`${title} | Kindergarten`)
      })
    ;
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  protected showSidebar(): void {
    this.sidebarService.show();
  }
}

