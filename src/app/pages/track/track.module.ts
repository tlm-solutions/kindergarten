import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TrackRoutingModule} from './track-routing.module';
import {TrackComponent} from './track.component';
import {TrackListComponent} from './track-list/track-list.component';
import {TrackViewComponent} from './track-view/track-view.component';
import {MapComponent} from "../../core/components/map/map.component";
import {TrackEditComponent} from './track-edit/track-edit.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TrackMapComponent} from "./track-map/track-map.component";
import {RelativeTimePipe} from "../../core/pipes/relative-time.pipe";
import {DurationPipe} from "../../core/pipes/duration.pipe";
import {ButtonComponent} from "@feel/form";

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
    FormsModule,
    ReactiveFormsModule,
    RelativeTimePipe,
    DurationPipe,
    ButtonComponent
  ]
})
export class TrackModule {
}
