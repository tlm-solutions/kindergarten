import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ReportingPointRaw} from "../../../data/region/region.domain";
import {UserId} from "../../../data/user/user.domain";
import {map, Observable} from "rxjs";
import {UserService} from "../../../data/user/user.service";
import {TrackService} from "../../../data/track/track.service";
import {Track} from "../../../data/track/track.domain";
import {CommonModule} from '@angular/common';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-region-reporting-point-info',
    templateUrl: './region-reporting-point-info.component.html',
    styleUrls: ['./region-reporting-point-info.component.scss'],
    imports: [CommonModule, RouterLink]
})
export class RegionReportingPointInfoComponent implements OnChanges {

  @Input()
  protected reportingPointRaw?: ReportingPointRaw;
  protected track?: Observable<Track | undefined>;

  constructor(
    private readonly userService: UserService,
    private readonly trackService: TrackService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.track = this.trackService.get(changes["reportingPointRaw"].currentValue.trekkie_run);
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

  protected roundLatLon(num: number): number {
    const idk = Math.pow(10, 4);
    return Math.round(num * idk) / idk;
  }
}
