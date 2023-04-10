import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MapComponent} from './map.component';

const routes: Routes = [
  {path: '', redirectTo: '0', pathMatch: 'full'},
  {path: ':regionId', component: MapComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapRoutingModule {
}
