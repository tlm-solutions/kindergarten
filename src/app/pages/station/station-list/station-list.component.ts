import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StationService} from "../../../data/station/station.service";
import {Observable} from "rxjs";
import {UserService} from "../../../data/user/user.service";
import {User, UserId} from "../../../data/user/user.domain";
import {RegionService} from "../../../data/region/region.service";
import {Region, RegionId} from "../../../data/region/region.domain";
import {IdHolder} from "../../../data/api.domain";

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationListComponent {

  protected readonly stations = this.stationService.findAll();

  constructor(
    private readonly stationService: StationService,
    private readonly regionService: RegionService,
    private readonly userService: UserService,
  ) {
  }

  protected trackBy<T>(_: number, {id}: IdHolder<T>): T {
    return id;
  }

  protected getRegion(id: RegionId): Observable<Region | undefined> {
    return this.regionService.getCached(id);
  }

  protected getUser(id: UserId): Observable<User | undefined> {
    return this.userService.getCached(id);
  }
}
