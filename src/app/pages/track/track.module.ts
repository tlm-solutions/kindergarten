import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TrackRoutingModule} from './track-routing.module';
import {TrackComponent} from './track.component';
import {TrackListComponent} from './track-list/track-list.component';
import {TrackViewComponent} from './track-view/track-view.component';
import {MapComponent} from "../../core/components/map/map.component";
import {ButtonComponent} from "../../core/components/button/button.component";
import {TrackEditComponent} from './track-edit/track-edit.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TextFieldComponent} from "../../core/components/text-field/text-field.component";
import {CheckboxComponent} from "../../core/components/checkbox/checkbox.component";
import {TrackMapComponent} from "./track-map/track-map.component";
import {RelativeTimePipe} from "../../core/pipes/relative-time.pipe";
import {DurationPipe} from "../../core/pipes/duration.pipe";


@NgModule({
  declarations: [
    TrackComponent,
    TrackListComponent,
    TrackViewComponent,
    TrackEditComponent,
    TrackMapComponent
  ],
  imports: [
    CommonModule,
    TrackRoutingModule,
    MapComponent,
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    TextFieldComponent,
    CheckboxComponent,
    RelativeTimePipe,
    DurationPipe
  ]
})
export class TrackModule {
}
