import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StationService} from "../../data/station/station.service";
import {map} from "rxjs";
import {UserService} from "../../data/user/user.service";
import {RegionService} from "../../data/region/region.service";
import {TrackService} from "../../data/track/track.service";
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterLink} from "@angular/router";
import {StatisticCardComponent} from "../../core/components/statistic-card/statistic-card.component";
import {RegionIconComponent} from "../../core/icons/region-icon/region-icon.component";
import {StationIconComponent} from "../../core/icons/station-icon/station-icon.component";
import {UserIconComponent} from "../../core/icons/user-icon/user-icon.component";
import {TrackIconComponent} from "../../core/icons/track-icon/track-icon.component";

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, StatisticCardComponent, RegionIconComponent, StationIconComponent, UserIconComponent, TrackIconComponent],
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
