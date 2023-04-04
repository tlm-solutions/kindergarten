import {ChangeDetectionStrategy, Component} from '@angular/core';
import {map, Observable, share, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {TrackService} from "../../../data/track/track.service";
import {RegionId, RegionWithId} from "../../../data/region/region.domain";
import {UserId, UserWithId} from "../../../data/user/user.domain";
import {RegionService} from "../../../data/region/region.service";
import {UserService} from "../../../data/user/user.service";

@Component({
  selector: 'app-track-view',
  templateUrl: './track-view.component.html',
  styleUrls: ['./track-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackViewComponent {

  protected readonly track = this.route.params.pipe(
    map(({id}) => id),
    switchMap(id => this.trackService.findById(id)),
    share(),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly trackService: TrackService,
    private readonly regionService: RegionService,
    private readonly userService: UserService,
  ) {
  }

  protected getRegion(id: RegionId): Observable<RegionWithId | undefined> {
    return this.regionService.findSmallById(id);
  }

  protected getUser(id: UserId): Observable<UserWithId | undefined> {
    return this.userService.findSmallById(id);
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
