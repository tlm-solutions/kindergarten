import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackRoutingModule } from './track-routing.module';
import { TrackComponent } from './track.component';
import { TrackListComponent } from './track-list/track-list.component';


@NgModule({
  declarations: [
    TrackComponent,
    TrackListComponent
  ],
  imports: [
    CommonModule,
    TrackRoutingModule
  ]
})
export class TrackModule { }
