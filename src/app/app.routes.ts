import {CanActivateFn, Router, Routes} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./data/auth/auth.service";
import {NotificationService} from "@feel/notification";
import {map, skip} from "rxjs";
import mapRoutes from "./pages/map/map.routes";

const FN: CanActivateFn = route => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return authService.getUser()
    .pipe(
      skip(authService.isUpdateInProgress() ? 1 : 0),
      map(user => {
        const id = user?.id;

        if (id === undefined || id === null) {
          return true;
        } else {
          notificationService.info($localize`You are already logged in.`);
          const next = route.queryParams['next'] ?? 'dashboard';
          return router.parseUrl(`/${next}`);
        }
      }),
    )
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landingpage/landingpage.component').then(c => c.LandingpageComponent),
    data: {title: $localize`Kindergarten`}
  },
  {
    path: 'station', loadChildren: () => import('./pages/station/station.routes'),
    data: {title: $localize`Stations`}
  },
  {
    path: 'user', loadChildren: () => import('./pages/user/user.routes'),
    data: {title: $localize`Users`}
  },
  {
    path: 'region', loadChildren: () => import('./pages/region/region.routes'),
    data: {title: $localize`Regions`}
  },
  {
    path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(c => c.ProfileComponent),
    data: {title: $localize`Profile`}
  },
  {
    path: 'track', loadChildren: () => import('./pages/track/track.routes'),
    data: {title: $localize`Tracks`}
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent),
    data: {title: $localize`Login`, sidebar: false, header: false},
    canActivate: [FN]
  },
  {
    path: 'map',
    children: mapRoutes,
    data: {
      title: $localize`Map`,
      headerElement: () => import('./pages/map/map-region-selector/map-region-selector.component').then(c => c.MapRegionSelectorComponent)
    }
  },
  {path: '**', redirectTo: '/', pathMatch: 'full'}
];
