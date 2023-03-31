import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StationService} from "../../../data/station/station.service";
import {map, Observable, share, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../data/user/user.service";
import {RegionId, RegionWithId} from "../../../data/region/region.domain";
import {UserId, UserWithId} from "../../../data/user/user.domain";
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
    switchMap(id => this.stationService.findById(id)),
    share(),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly stationService: StationService,
    private readonly regionService: RegionService,
    private readonly userService: UserService
  ) {
  }

  protected getRegion(id: RegionId): Observable<RegionWithId | undefined> {
    return this.regionService.findSmallById(id);
  }

  protected getUser(id: UserId): Observable<UserWithId | undefined> {
    return this.userService.findSmallById(id);
  }
}
