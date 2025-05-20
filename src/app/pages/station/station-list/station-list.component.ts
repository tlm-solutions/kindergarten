import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StationService} from "../../../data/station/station.service";
import {map, Observable} from "rxjs";
import {UserService} from "../../../data/user/user.service";
import {UserId} from "../../../data/user/user.domain";
import {RegionService} from "../../../data/region/region.service";
import {Region, RegionId} from "../../../data/region/region.domain";
import {IdHolder} from "../../../data/api.domain";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-station-list',
    templateUrl: './station-list.component.html',
    styleUrls: ['./station-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterLink]
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
