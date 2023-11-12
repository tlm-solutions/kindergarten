import {Routes} from '@angular/router';
import {RegionComponent} from './region.component';
import {RegionListComponent} from "./region-list/region-list.component";
import {RegionViewComponent} from "./region-view/region-view.component";
import {RegionEditComponent} from "./region-edit/region-edit.component";
import {AUTH_CAN_ACTIVATE} from "../../data/auth/auth.guard";
import {RegionReportingPointViewComponent} from "./region-reporting-point-view/region-reporting-point-view.component";

const routes: Routes = [{
  path: '', component: RegionComponent,
  children: [
    {path: '', component: RegionListComponent},
    {path: ':id', component: RegionViewComponent},
    {path: ':id/edit', component: RegionEditComponent, canActivate: [AUTH_CAN_ACTIVATE]},
    {path: ':id/reporting_point/:rid', component: RegionReportingPointViewComponent},
  ]
}];

export default routes;
