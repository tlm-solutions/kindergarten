import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {LandingpageRoutingModule} from './landingpage-routing.module';
import {LandingpageComponent} from './landingpage.component';
import {StatisticCardComponent} from "../../core/components/statistic-card/statistic-card.component";
import {UserIconComponent} from "../../core/icons/user-icon/user-icon.component";
import {StationIconComponent} from "../../core/icons/station-icon/station-icon.component";
import {RegionIconComponent} from "../../core/icons/region-icon/region-icon.component";
import {TrackIconComponent} from "../../core/icons/track-icon/track-icon.component";

@NgModule({
  declarations: [
    LandingpageComponent
  ],
  imports: [
    CommonModule,
    LandingpageRoutingModule,
    UserIconComponent,
    StationIconComponent,
    StatisticCardComponent,
    RegionIconComponent,
    TrackIconComponent,
    NgOptimizedImage
  ]
})
export class LandingpageModule {
}
