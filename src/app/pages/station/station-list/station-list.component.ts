import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StationId, StationWithId} from "../../../data/station/station.domain";
import {StationService} from "../../../data/station/station.service";
import {map, Observable} from "rxjs";
import {UserService} from "../../../data/user/user.service";
import {UserId, UserWithId} from "../../../data/user/user.domain";
import {RegionService} from "../../../data/region/region.service";
import {RegionId, RegionWithId} from "../../../data/region/region.domain";

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StationListComponent {

  protected readonly stations = this.stationService.findAll();
  protected readonly stationCount = this.stations.pipe(map(stations => stations.length));

  constructor(
    private readonly stationService: StationService,
    private readonly regionService: RegionService,
    private readonly userService: UserService,
  ) {
  }

  protected trackBy(idx: number, element: StationWithId): StationId {
    return element.id;
  }

  protected getRegion(id: RegionId): Observable<RegionWithId | undefined> {
    return this.regionService.findSmallById(id);
  }

  protected getUser(id: UserId): Observable<UserWithId | undefined> {
    return this.userService.findSmallById(id);
  }
}
