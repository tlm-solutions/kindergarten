import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TrackRoutingModule} from './track-routing.module';
import {TrackComponent} from './track.component';
import {TrackListComponent} from './track-list/track-list.component';
import {TrackViewComponent} from './track-view/track-view.component';
import {MapComponent} from "../../core/components/map/map.component";
import {ButtonComponent} from "../../core/components/button/button.component";


@NgModule({
  declarations: [
    TrackComponent,
    TrackListComponent,
    TrackViewComponent
  ],
  imports: [
    CommonModule,
    TrackRoutingModule,
    MapComponent,
    ButtonComponent
  ]
})
export class TrackModule {
}
