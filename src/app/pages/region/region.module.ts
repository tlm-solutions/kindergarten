import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RegionRoutingModule} from './region-routing.module';
import {RegionComponent} from './region.component';
import {AppModule} from "../../app.module";


@NgModule({
  declarations: [
    RegionComponent
  ],
  imports: [
    CommonModule,
    RegionRoutingModule,
    AppModule
  ]
})
export class RegionModule {
}
