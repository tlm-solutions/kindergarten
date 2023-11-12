import {Routes} from '@angular/router';
import {MapComponent} from './map.component';

const routes: Routes = [
  {path: '', redirectTo: '0', pathMatch: 'full'},
  {path: ':regionId', component: MapComponent}
];

export default routes;
