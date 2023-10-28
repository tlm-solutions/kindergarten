import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SidebarComponent} from './layout/sidebar/sidebar.component';
import {DashboardIconComponent} from "./core/icons/dashboard-icon/dashboard-icon.component";
import {RegionIconComponent} from "./core/icons/region-icon/region-icon.component";
import {StationIconComponent} from "./core/icons/station-icon/station-icon.component";
import {UserIconComponent} from "./core/icons/user-icon/user-icon.component";
import {TrackIconComponent} from "./core/icons/track-icon/track-icon.component";
import {ProfileIconComponent} from "./core/icons/profile-icon/profile-icon.component";
import {MapIconComponent} from "./core/icons/map-icon/map-icon.component";
import {HeaderComponent} from './layout/header/header.component';
import {MenuIconComponent} from "./core/icons/menu-icon/menu-icon.component";
import {NotificationListComponent} from "@feel/notification";
import {HeaderHostDirective} from './layout/header/header-host.directive';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    HeaderHostDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DashboardIconComponent,
    RegionIconComponent,
    StationIconComponent,
    UserIconComponent,
    TrackIconComponent,
    ProfileIconComponent,
    MapIconComponent,
    MenuIconComponent,
    NotificationListComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
