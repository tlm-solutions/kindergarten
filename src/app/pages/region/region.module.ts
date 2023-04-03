import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegionRoutingModule} from './region-routing.module';
import {RegionComponent} from './region.component';
import {RegionListComponent} from './region-list/region-list.component';
import {RegionIconComponent} from "../../core/icons/region-icon/region-icon.component";
import {ButtonComponent} from "../../core/components/button/button.component";
import {RegionViewComponent} from './region-view/region-view.component';
import {MapComponent} from "../../core/components/map/map.component";

@NgModule({
  declarations: [
    RegionComponent,
    RegionListComponent,
    RegionViewComponent
  ],
  imports: [
    CommonModule,
    RegionRoutingModule,
    RegionIconComponent,
    ButtonComponent,
    MapComponent,
  ]
})
export class RegionModule {
}
