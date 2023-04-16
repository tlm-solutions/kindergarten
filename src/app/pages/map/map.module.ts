import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MapRoutingModule} from './map-routing.module';
import {MapComponent} from './map.component';
import {MapWindshieldComponent} from './map-windshield/map-windshield.component';


@NgModule({
  declarations: [
    MapComponent,
    MapWindshieldComponent
  ],
  imports: [
    CommonModule,
    MapRoutingModule
  ]
})
export class MapModule {
}
