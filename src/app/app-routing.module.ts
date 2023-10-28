import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/landingpage/landingpage.module').then(m => m.LandingpageModule),
    data: {title: $localize`Kindergarten`}
  },
  {
    path: 'station', loadChildren: () => import('./pages/station/station.module').then(m => m.StationModule),
    data: {title: $localize`Stations`}
  },
  {
    path: 'user', loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule),
    data: {title: $localize`Users`}
  },
  {
    path: 'region', loadChildren: () => import('./pages/region/region.module').then(m => m.RegionModule),
    data: {title: $localize`Regions`}
  },
  {
    path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule),
    data: {title: $localize`Profile`}
  },
  {
    path: 'track', loadChildren: () => import('./pages/track/track.module').then(m => m.TrackModule),
    data: {title: $localize`Tracks`}
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
    data: {title: $localize`Login`, sidebar: false, header: false}
  },
  {
    path: 'map', loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule),
    data: {
      title: $localize`Map`,
      headerElement: () => import('./pages/map/map-region-selector/map-region-selector.component').then(c => c.MapRegionSelectorComponent)
    }
  },
  {path: '**', redirectTo: '/', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
