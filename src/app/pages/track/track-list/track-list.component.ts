import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, filter, map, Observable, share, Subscription, switchMap} from "rxjs";
import {TrackService} from "../../../data/track/track.service";
import {Region, RegionId} from "../../../data/region/region.domain";
import {RegionService} from "../../../data/region/region.service";
import {User, UserId} from "../../../data/user/user.domain";
import {UserService} from "../../../data/user/user.service";
import {IdHolder} from "../../../data/api.domain";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackListComponent implements OnInit, OnDestroy {

  private readonly pagination = new BehaviorSubject({offset: 0, limit: 14});
  protected readonly page = new BehaviorSubject<number>(1);
  private readonly trackPages = this.pagination.pipe(
    switchMap(({offset, limit}) => this.trackService.getPage(offset, limit)),
    share(),
  );

  protected readonly form = new FormGroup({
    offset: new FormControl<number>(0, {nonNullable: true, validators: Validators.min(0)}),
    limit: new FormControl<number>(14, {nonNullable: true, validators: Validators.min(1)}),
  });
  protected readonly tracks = this.trackPages.pipe(map(({elements}) => elements));
  private subscription: Subscription | undefined;

  constructor(
    private readonly trackService: TrackService,
    private readonly regionService: RegionService,
    private readonly userService: UserService,
  ) {
  }

  public ngOnInit(): void {
    this.subscription = this.form.valueChanges
      .pipe(filter(() => this.form.valid))
      .subscribe(({offset, limit}) => {
        this.page.next((offset ?? 0) % (limit ?? 15) + 1);
        this.pagination.next({
          offset: offset ?? 0,
          limit: limit ?? 15
        })
      });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.pagination.complete();
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

  public prev(): void {
    this.form.controls.offset.setValue(this.form.controls.offset.value - this.form.controls.limit.value);
  }

  public next(): void {
    this.form.controls.offset.setValue(this.form.controls.offset.value + this.form.controls.limit.value);
  }
}

function formatDuration(ms: number): string {
  ms = Math.abs(ms);

  const time = {
    day: Math.floor(ms / 86400000),
    hour: Math.floor(ms / 3600000) % 24,
    minute: Math.floor(ms / 60000) % 60,
    second: Math.floor(ms / 1000) % 60,
  };

  return Object.entries(time)
    .filter(val => val[1] !== 0)
    .map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
    .join(', ');
}
