import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StationComponent} from './station.component';
import {StationEditComponent} from "./station-edit/station-edit.component";
import {StationViewComponent} from "./station-view/station-view.component";
import {StationListComponent} from "./station-list/station-list.component";
import {AUTH_CAN_ACTIVATE} from "../../data/auth/auth.guard";

const routes: Routes = [{
  path: '', component: StationComponent,
  children: [
    {path: '', component: StationListComponent},
    {path: ':id', component: StationViewComponent},
    {path: ':id/edit', component: StationEditComponent, canActivate: [AUTH_CAN_ACTIVATE]},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StationRoutingModule {
}
