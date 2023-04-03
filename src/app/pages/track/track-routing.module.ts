import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TrackComponent} from './track.component';
import {TrackListComponent} from "./track-list/track-list.component";
import {TrackViewComponent} from "./track-view/track-view.component";

const routes: Routes = [{
  path: '', component: TrackComponent, children: [
    {path: '', component: TrackListComponent},
    {path: ':id', component: TrackViewComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackRoutingModule {
}
