import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StationRoutingModule} from './station-routing.module';
import {StationComponent} from './station.component';
import {CdkTableModule} from "@angular/cdk/table";
import {StationListComponent} from './station-list/station-list.component';
import {StationIconComponent} from "../../icons/station-icon/station-icon.component";
import {StationEditComponent} from './station-edit/station-edit.component';
import {ReactiveFormsModule} from "@angular/forms";
import { StationViewComponent } from './station-view/station-view.component';
import {CardComponent} from "../../ui/card/card.component";
import {MapComponent} from "../../ui/map/map.component";

@NgModule({
  declarations: [
    StationComponent,
    StationListComponent,
    StationEditComponent,
    StationViewComponent,
  ],
  imports: [
    CommonModule,
    StationRoutingModule,
    CdkTableModule,
    StationIconComponent,
    ReactiveFormsModule,
    CardComponent,
    MapComponent
  ]
})
export class StationModule {
}
