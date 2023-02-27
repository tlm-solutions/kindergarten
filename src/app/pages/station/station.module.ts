import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StationRoutingModule} from './station-routing.module';
import {StationComponent} from './station.component';
import {CdkTableModule} from "@angular/cdk/table";
import {StationListComponent} from './station-list/station-list.component';
import {StationEditComponent} from './station-edit/station-edit.component';
import {ReactiveFormsModule} from "@angular/forms";
import {StationViewComponent} from './station-view/station-view.component';
import {MapComponent} from "../../core/components/map/map.component";
import {TextFieldComponent} from "../../core/components/text-field/text-field.component";
import {ButtonComponent} from "../../core/components/button/button.component";
import {ErrorComponent} from "../../core/components/error/error.component";
import {StationIconComponent} from "../../core/icons/station-icon/station-icon.component";

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
    MapComponent,
    TextFieldComponent,
    ButtonComponent,
    ErrorComponent,
  ]
})
export class StationModule {
}
