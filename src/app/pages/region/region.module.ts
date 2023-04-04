import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegionRoutingModule} from './region-routing.module';
import {RegionComponent} from './region.component';
import {RegionListComponent} from './region-list/region-list.component';
import {RegionIconComponent} from "../../core/icons/region-icon/region-icon.component";
import {ButtonComponent} from "../../core/components/button/button.component";
import {RegionViewComponent} from './region-view/region-view.component';
import {MapComponent} from "../../core/components/map/map.component";
import { RegionEditComponent } from './region-edit/region-edit.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TextFieldComponent} from "../../core/components/text-field/text-field.component";

@NgModule({
  declarations: [
    RegionComponent,
    RegionListComponent,
    RegionViewComponent,
    RegionEditComponent
  ],
  imports: [
    CommonModule,
    RegionRoutingModule,
    RegionIconComponent,
    ButtonComponent,
    MapComponent,
    FormsModule,
    TextFieldComponent,
    ReactiveFormsModule,
  ]
})
export class RegionModule {
}
