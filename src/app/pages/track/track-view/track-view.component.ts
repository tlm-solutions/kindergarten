import {ChangeDetectionStrategy, Component} from '@angular/core';
import {map, Observable, share, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {TrackService} from "../../../data/track/track.service";
import {RegionId, RegionWithId} from "../../../data/region/region.domain";
import {UserId, UserWithId} from "../../../data/user/user.domain";
import {RegionService} from "../../../data/region/region.service";
import {UserService} from "../../../data/user/user.service";
import {GpsEntry} from "../../../data/track/track.domain";
import {Coordinate} from "ol/coordinate";

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

  protected readonly correlation = this.route.params.pipe(
    map(({id}) => id),
    switchMap(id => this.trackService.getCorrelation(id)),
    share(),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly trackService: TrackService,
    private readonly regionService: RegionService,
    private readonly userService: UserService,
  ) {
    this.correlation.subscribe(console.log);
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

  protected convertToCoords(gps: GpsEntry[], start: string, end: string): Coordinate[] {
    const startTime = Date.parse(start);
    const endTime = Date.parse(end);

    return gps.filter(gps => {
      const gpsTime = Date.parse(gps.time);
      return startTime <= gpsTime && gpsTime <= endTime
    })
      .map(gps => [gps.lon, gps.lat]);
  }

  protected convertToCoordsBefore(gps: GpsEntry[], time: string) {
    const parsedTime = Date.parse(time);

    return gps.filter(gps => Date.parse(gps.time) <= parsedTime)
      .map(gps => [gps.lon, gps.lat]);
  }

  protected convertToCoordsAfter(gps: GpsEntry[], time: string) {
    const parsedTime = Date.parse(time);

    return gps.filter(gps => parsedTime <= Date.parse(gps.time))
      .map(gps => [gps.lon, gps.lat]);
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
