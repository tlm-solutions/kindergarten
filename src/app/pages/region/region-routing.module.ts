import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegionComponent} from './region.component';
import {RegionListComponent} from "./region-list/region-list.component";

const routes: Routes = [{
  path: '', component: RegionComponent, children: [
    {path: '', component: RegionListComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegionRoutingModule {
}
