import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {StationIconComponent} from "./core/icons/station-icon/station-icon.component";
import {UserIconComponent} from "./core/icons/user-icon/user-icon.component";
import {ProfileIconComponent} from "./core/icons/profile-icon/profile-icon.component";
import {RegionIconComponent} from "./core/icons/region-icon/region-icon.component";
import {TrackIconComponent} from "./core/icons/track-icon/track-icon.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NotificationModule} from "./core/notification/notification.module";
import {HeaderComponent} from './layout/header/header.component';
import {ButtonComponent} from "./core/components/button/button.component";
import {DashboardIconComponent} from "./core/icons/dashboard-icon/dashboard-icon.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StationIconComponent,
    UserIconComponent,
    ProfileIconComponent,
    RegionIconComponent,
    TrackIconComponent,
    NotificationModule,
    ButtonComponent,
    DashboardIconComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
