import {AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, Type, ViewChild} from '@angular/core';
import {BehaviorSubject, filter, map, Subscription, switchMap, tap} from "rxjs";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {routingAnimation} from "../../core/animation/routing.animation";
import {SidebarService} from "../sidebar/sidebar.service";
import {HeaderHostDirective} from "./header-host.directive";
import {CommonModule} from "@angular/common";
import {MenuIconComponent} from "../../core/icons/menu-icon/menu-icon.component";

@Component({
    selector: 'app-header',
    imports: [CommonModule, MenuIconComponent, HeaderHostDirective],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    animations: [routingAnimation],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {

  protected readonly title = new BehaviorSubject<string | undefined>(this.route.root.firstChild?.snapshot?.data['title'])
  private subscription: Subscription | undefined;

  @ViewChild(HeaderHostDirective, {static: false})
  private readonly host?: HeaderHostDirective;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly _title: Title,
    private readonly sidebarService: SidebarService,
  ) {
  }

  public ngAfterViewInit(): void {
    // @ts-expect-error because of any
    this.route.root.firstChild?.snapshot?.data['headerElement']?.().then(headerElement =>
      this.host?.viewContainerRef.createComponent(headerElement).changeDetectorRef.markForCheck()
    );
  }

  public ngOnInit(): void {
    this.subscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        const data: {
          title?: string,
          headerElement?: () => Promise<Type<unknown>>
        } | undefined = this.route.root.firstChild?.snapshot?.data;
        return {title: data?.['title'], headerElement: data?.['headerElement']};
      }),
      tap(({title}) => {
        this.title.next(title);
        this._title.setTitle($localize`${title} | Kindergarten`);
        this.host?.viewContainerRef.clear();
      }),
      filter(({headerElement}) => !!headerElement),
      map(({headerElement}) => headerElement!),
      switchMap(headerElement => headerElement())
    )
      .subscribe(headerElement => this.host?.viewContainerRef.createComponent(headerElement).changeDetectorRef.markForCheck());
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  protected showSidebar(): void {
    this.sidebarService.show();
  }
}

