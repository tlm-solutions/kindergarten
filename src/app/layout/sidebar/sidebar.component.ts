import {ChangeDetectionStrategy, Component, HostListener} from '@angular/core';
import {SidebarService} from "./sidebar.service";
import {CommonModule} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {DashboardIconComponent} from "../../core/icons/dashboard-icon/dashboard-icon.component";
import {MapIconComponent} from "../../core/icons/map-icon/map-icon.component";
import {RegionIconComponent} from "../../core/icons/region-icon/region-icon.component";
import {TrackIconComponent} from "../../core/icons/track-icon/track-icon.component";
import {ProfileIconComponent} from "../../core/icons/profile-icon/profile-icon.component";
import {StationIconComponent} from "../../core/icons/station-icon/station-icon.component";
import {UserIconComponent} from "../../core/icons/user-icon/user-icon.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, DashboardIconComponent, MapIconComponent, RegionIconComponent, TrackIconComponent, ProfileIconComponent, StationIconComponent, UserIconComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {

  constructor(
    private readonly sidebarService: SidebarService
  ) {
  }

  @HostListener('window:click')
  protected hide(): void {
    if (this.sidebarService.isCurrentlyShown()) {
      this.sidebarService.hide();
    }
  }
}
