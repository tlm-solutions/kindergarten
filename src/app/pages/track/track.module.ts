import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TrackRoutingModule} from './track-routing.module';
import {TrackComponent} from './track.component';
import {TrackListComponent} from './track-list/track-list.component';
import {TrackViewComponent} from './track-view/track-view.component';
import {MapComponent} from "../../core/components/map/map.component";


@NgModule({
  declarations: [
    TrackComponent,
    TrackListComponent,
    TrackViewComponent
  ],
  imports: [
    CommonModule,
    TrackRoutingModule,
    MapComponent
  ]
})
export class TrackModule {
}
