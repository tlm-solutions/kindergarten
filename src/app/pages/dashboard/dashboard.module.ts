import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {StatisticCardComponent} from "../../core/components/statistic-card/statistic-card.component";
import {UserIconComponent} from "../../core/icons/user-icon/user-icon.component";
import {StationIconComponent} from "../../core/icons/station-icon/station-icon.component";
import {RegionIconComponent} from "../../core/icons/region-icon/region-icon.component";
import {TrackIconComponent} from "../../core/icons/track-icon/track-icon.component";

@NgModule({
  declarations: [
    DashboardComponent
  ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        UserIconComponent,
        StationIconComponent,
        StatisticCardComponent,
        RegionIconComponent,
        TrackIconComponent
    ]
})
export class DashboardModule {
}
