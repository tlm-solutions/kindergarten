import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BehaviorSubject, map, Observable, share, switchMap} from "rxjs";
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
export class TrackListComponent {

  private readonly pagination = new BehaviorSubject({offset: 0, limit: 15});
  private readonly trackPages = this.pagination.pipe(
    switchMap(({offset, limit}) => this.trackService.getPage(offset, limit)),
    share(),
  );

  protected readonly form = new FormGroup({
    offset: new FormControl<number>(0, {nonNullable: true, validators: Validators.min(0)}),
    limit: new FormControl<number>(15, {nonNullable: true, validators: Validators.min(1)}),
  });
  protected readonly tracks = this.trackPages.pipe(map(({elements}) => elements));

  constructor(
    private readonly trackService: TrackService,
    private readonly regionService: RegionService,
    private readonly userService: UserService,
  ) {
    this.form.valueChanges.subscribe(({offset, limit}) => {
      this.pagination.next({
        offset: offset ?? 0,
        limit: limit ?? 15
      })
    });
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
