import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegionComponent} from './region.component';
import {RegionListComponent} from "./region-list/region-list.component";
import {RegionViewComponent} from "./region-view/region-view.component";

const routes: Routes = [{
  path: '', component: RegionComponent, children: [
    {path: '', component: RegionListComponent},
    {path: ':id', component: RegionViewComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegionRoutingModule {
}
