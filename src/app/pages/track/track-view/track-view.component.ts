import {ChangeDetectionStrategy, Component} from '@angular/core';
import {map, Observable, share, switchMap} from "rxjs";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TrackService} from "../../../data/track/track.service";
import {Region, RegionId} from "../../../data/region/region.domain";
import {UserId} from "../../../data/user/user.domain";
import {RegionService} from "../../../data/region/region.service";
import {UserService} from "../../../data/user/user.service";
import {GpsEntry, TrackId} from "../../../data/track/track.domain";
import {Coordinate} from "ol/coordinate";
import {NotificationService} from "@feel/notification";
import {CommonModule} from "@angular/common";
import {RelativeTimePipe} from "../../../core/pipes/relative-time.pipe";
import {ButtonComponent} from "@feel/form";
import {TrackMapComponent} from "../track-map/track-map.component";

@Component({
    selector: 'app-track-view',
    templateUrl: './track-view.component.html',
    styleUrls: ['./track-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RelativeTimePipe, RouterLink, ButtonComponent, TrackMapComponent]
})
export class TrackViewComponent {

  protected readonly track = this.route.params.pipe(
    map(({id}) => id),
    switchMap(id => this.trackService.get(id)),
    share(),
  );

  protected readonly correlation = this.route.params.pipe(
    map(({id}) => id),
    switchMap(id => this.trackService.getCorrelation(id)),
    map(correlation => correlation.map<Coordinate>(correlation => ([correlation.lon, correlation.lat]))),
    share(),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly trackService: TrackService,
    private readonly regionService: RegionService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {
    // this.correlation.subscribe(console.log);
  }

  protected getRegion(id: RegionId): Observable<Region | undefined> {
    return this.regionService.getCached(id);
  }

  protected getUserName(id: UserId): Observable<string | undefined> {
    return this.userService.getCached(id).pipe(map(user => {
      if (!user) {
        return undefined;
      } else if (!user.name || user.name.length === 0) {
        return '<empty name>';
      } else {
        return user.name
      }
    }));
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

  protected getCommitLink(name: string, commit: string): string | null {
    switch (name) {
    case 'stasi':
      return `https://github.com/tlm-solutions/stasi/commit/${commit}`;
    default:
      return null;
    }
  }

  protected renderCommitId(commit: string): string {
    return commit.substring(0, 7);
  }

  protected delete(id: TrackId): void {
    if (confirm("Confirm?")) {
      this.trackService.delete(id).subscribe(() => this.notificationService.success($localize`Track was successfully deleted.`))
    }
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
