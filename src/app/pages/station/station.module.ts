import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StationRoutingModule} from './station-routing.module';
import {StationComponent} from './station.component';
import {CdkTableModule} from "@angular/cdk/table";
import {StationListComponent} from './station-list/station-list.component';
import {StationIconComponent} from "../../icons/station-icon/station-icon.component";

@NgModule({
  declarations: [
    StationComponent,
    StationListComponent
  ],
  imports: [
    CommonModule,
    StationRoutingModule,
    CdkTableModule,
    StationIconComponent
  ]
})
export class StationModule {
}
