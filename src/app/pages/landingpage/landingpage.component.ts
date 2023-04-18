import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StationService} from "../../data/station/station.service";
import {map} from "rxjs";
import {UserService} from "../../data/user/user.service";
import {RegionService} from "../../data/region/region.service";
import {TrackService} from "../../data/track/track.service";

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingpageComponent {

  protected readonly stationCount = this.stationService.findAll()
    .pipe(map(stations => String(stations.length)));
  protected readonly userCount = this.userService.findAll()
    .pipe(map(users => String(users.length)));
  protected readonly regionCount = this.regionService.findAll()
    .pipe(map(region => String(region.length)));
  protected readonly trackCount = this.trackService.getPage(0, 0)
    .pipe(map(data => String(data.count)));

  constructor(
    private readonly stationService: StationService,
    private readonly userService: UserService,
    private readonly regionService: RegionService,
    private readonly trackService: TrackService,
  ) {
  }
}
