import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BehaviorSubject, map, Observable, share, switchMap} from "rxjs";
import {TrackService} from "../../../data/track/track.service";
import {TrackId, TrackWithId} from "../../../data/track/track.domain";
import {RegionId, RegionWithId} from "../../../data/region/region.domain";
import {RegionService} from "../../../data/region/region.service";
import {UserId, UserWithId} from "../../../data/user/user.domain";
import {UserService} from "../../../data/user/user.service";

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackListComponent {

  private readonly pagination = new BehaviorSubject({offset: 0, limit: 10});
  private readonly trackPages = this.pagination.pipe(
    switchMap(({offset, limit}) => this.trackService.findPage(offset, limit)),
    share(),
  );

  protected readonly tracks = this.trackPages.pipe(map(({elements}) => elements));

  constructor(
    private readonly trackService: TrackService,
    private readonly regionService: RegionService,
    private readonly userService: UserService,
  ) {
  }

  updateOffset(target: EventTarget | null) {
    this.pagination.next({limit: this.pagination.value.limit, offset: parseInt((target as HTMLInputElement).value)});
  }

  updateLimit(target: EventTarget | null) {
    this.pagination.next({offset: this.pagination.value.offset, limit: parseInt((target as HTMLInputElement).value)});
  }

  protected getRegion(id: RegionId): Observable<RegionWithId | undefined> {
    return this.regionService.findSmallById(id);
  }

  protected getUser(id: UserId): Observable<UserWithId | undefined> {
    return this.userService.findSmallById(id);
  }

  protected trackBy(idx: number, element: TrackWithId): TrackId {
    return element.id;
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
