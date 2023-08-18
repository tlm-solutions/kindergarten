import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StationRoutingModule} from './station-routing.module';
import {StationComponent} from './station.component';
import {StationListComponent} from './station-list/station-list.component';
import {StationEditComponent} from './station-edit/station-edit.component';
import {ReactiveFormsModule} from "@angular/forms";
import {StationViewComponent} from './station-view/station-view.component';
import {MapComponent} from "../../core/components/map/map.component";
import {StationIconComponent} from "../../core/icons/station-icon/station-icon.component";
import {ButtonComponent, CheckboxComponent, FormErrorComponent, TextFieldComponent} from "@feel/form";

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
    StationIconComponent,
    ReactiveFormsModule,
    MapComponent,
    ButtonComponent,
    TextFieldComponent,
    FormErrorComponent,
    CheckboxComponent,
  ]
})
export class StationModule {
}
