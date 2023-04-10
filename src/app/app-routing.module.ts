import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'station', loadChildren: () => import('./pages/station/station.module').then(m => m.StationModule)},
  {path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)},
  {path: 'user', loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule)},
  {path: 'region', loadChildren: () => import('./pages/region/region.module').then(m => m.RegionModule)},
  {path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule)},
  {path: 'track', loadChildren: () => import('./pages/track/track.module').then(m => m.TrackModule)},
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
    data: {sidebar: false}
  },
  { path: 'map', loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
