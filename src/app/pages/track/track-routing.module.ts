import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TrackComponent} from './track.component';
import {TrackListComponent} from "./track-list/track-list.component";
import {TrackViewComponent} from "./track-view/track-view.component";
import {AUTH_CAN_ACTIVATE} from "../../data/auth/auth.guard";
import {TrackEditComponent} from "./track-edit/track-edit.component";

const routes: Routes = [{
  path: '', component: TrackComponent, canActivate: [AUTH_CAN_ACTIVATE], children: [
    {path: '', component: TrackListComponent},
    {path: ':id', component: TrackViewComponent},
    {path: ':id/edit', component: TrackEditComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackRoutingModule {
}
