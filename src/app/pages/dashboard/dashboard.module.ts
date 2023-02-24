import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {CardComponent} from "../../ui/card/card.component";
import {UserIconComponent} from "../../icons/user-icon/user-icon.component";
import {StationIconComponent} from "../../icons/station-icon/station-icon.component";
import {StatisticCardComponent} from "../../ui/statistic-card/statistic-card.component";
import {RegionIconComponent} from "../../icons/region-icon/region-icon.component";


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CardComponent,
    UserIconComponent,
    StationIconComponent,
    StatisticCardComponent,
    RegionIconComponent
  ]
})
export class DashboardModule {
}
