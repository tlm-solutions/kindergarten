import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapRoutingModule} from './map-routing.module';
import {MapComponent} from './map.component';
import {MapWindshieldComponent} from './map-windshield/map-windshield.component';
import {MapVehicleInfoComponent} from './map-vehicle-info/map-vehicle-info.component';
import {DurationPipe} from "../../core/pipes/duration.pipe";
import {RelativeTimePipe} from "../../core/pipes/relative-time.pipe";
import {MapRegionSelectorComponent} from './map-region-selector/map-region-selector.component';

@NgModule({
  declarations: [
    MapComponent,
    MapWindshieldComponent,
    MapVehicleInfoComponent,
    MapRegionSelectorComponent
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    DurationPipe,
    RelativeTimePipe
  ]
})
export class MapModule {
}
