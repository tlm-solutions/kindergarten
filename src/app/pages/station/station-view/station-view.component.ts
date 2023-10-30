import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StationService} from "../../../data/station/station.service";
import {map, Observable, share, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../data/user/user.service";
import {Region, RegionId} from "../../../data/region/region.domain";
import {UserId} from "../../../data/user/user.domain";
import {RegionService} from "../../../data/region/region.service";

@Component({
  selector: 'app-station-view',
  templateUrl: './station-view.component.html',
  styleUrls: ['./station-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StationViewComponent {

  protected readonly station = this.route.params.pipe(
    map(({id}) => id),
    switchMap(id => this.stationService.get(id)),
    share(),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly stationService: StationService,
    private readonly regionService: RegionService,
    private readonly userService: UserService
  ) {
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
}
