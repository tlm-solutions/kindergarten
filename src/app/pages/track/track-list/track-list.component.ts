import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, filter, map, Observable, share, Subscription, switchMap} from "rxjs";
import {TrackService} from "../../../data/track/track.service";
import {Region, RegionId} from "../../../data/region/region.domain";
import {RegionService} from "../../../data/region/region.service";
import {User, UserId} from "../../../data/user/user.domain";
import {UserService} from "../../../data/user/user.service";
import {IdHolder} from "../../../data/api.domain";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {formatDuration} from "../../../core/utils";

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackListComponent implements OnInit, OnDestroy {

  protected readonly page = new BehaviorSubject<number>(1);
  protected readonly form = new FormGroup({
    offset: new FormControl<number>(0, {nonNullable: true, validators: Validators.min(0)}),
    limit: new FormControl<number>(14, {nonNullable: true, validators: Validators.min(1)}),
  });

  private readonly pagination = this.route.queryParams.pipe(
    map(({offset, limit}) => ({
      offset: offset ?? 15,
      limit: limit ?? 0
    }))
  );

  private readonly trackPages = this.pagination.pipe(
    switchMap(({offset, limit}) => this.trackService.getPage(offset, limit)),
    share(),
  );
  protected readonly tracks = this.trackPages.pipe(map(({elements}) => elements));
  private subscription: Subscription | undefined;

  constructor(
    private readonly trackService: TrackService,
    private readonly regionService: RegionService,
    private readonly userService: UserService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
  }

  public ngOnInit(): void {
    this.subscription = this.form.valueChanges
      .pipe(filter(() => this.form.valid))
      .subscribe(({offset, limit}) => {
        this.page.next((offset ?? 0) % (limit ?? 15) + 1);
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {offset, limit},
          queryParamsHandling: "merge",
        })
      });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public prev(): void {
    this.form.controls.offset.setValue(this.form.controls.offset.value - this.form.controls.limit.value);
  }

  public next(): void {
    this.form.controls.offset.setValue(this.form.controls.offset.value + this.form.controls.limit.value);
  }

  protected getRegion(id: RegionId): Observable<Region | undefined> {
    return this.regionService.getCached(id);
  }

  protected getUser(id: UserId): Observable<User | undefined> {
    return this.userService.getCached(id);
  }

  protected trackBy<T>(_: number, {id}: IdHolder<T>): T {
    return id;
  }

  protected duration(start: string, end: string): string {
    return formatDuration(Date.parse(end) - Date.parse(start));
  }
}
