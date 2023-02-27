import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegionRoutingModule} from './region-routing.module';
import {RegionComponent} from './region.component';
import {RegionListComponent} from './region-list/region-list.component';
import {RegionIconComponent} from "../../core/icons/region-icon/region-icon.component";

@NgModule({
  declarations: [
    RegionComponent,
    RegionListComponent
  ],
  imports: [
    CommonModule,
    RegionRoutingModule,
    RegionIconComponent,
  ]
})
export class RegionModule {
}
