import {Component} from '@angular/core';
import {StationService} from "../../data/station/station.service";
import {map} from "rxjs";
import {UserService} from "../../data/user/user.service";
import {RegionService} from "../../data/region/region.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  protected readonly stationCount = this.stationService.findAll()
    .pipe(map(stations => String(stations.length)));
  protected readonly userCount = this.userService.findAll()
    .pipe(map(users => String(users.length)));
  protected readonly regionCount = this.regionService.findAll()
    .pipe(map(region => String(region.length)));

  constructor(
    private readonly stationService: StationService,
    private readonly userService: UserService,
    private readonly regionService: RegionService,
  ) {
  }
}
