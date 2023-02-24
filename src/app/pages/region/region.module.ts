import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegionRoutingModule} from './region-routing.module';
import {RegionComponent} from './region.component';
import {RegionIconComponent} from "../../icons/region-icon/region-icon.component";


@NgModule({
  declarations: [
    RegionComponent
  ],
  imports: [
    CommonModule,
    RegionRoutingModule,
    RegionIconComponent,
  ]
})
export class RegionModule {
}
