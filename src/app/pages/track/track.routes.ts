import {Routes} from '@angular/router';
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

export default routes;
