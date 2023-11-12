import {Routes} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: '0', pathMatch: 'full'},
  {path: ':regionId', loadComponent: () => import("./map.component").then(c => c.MapComponent)}
];

export default routes;
