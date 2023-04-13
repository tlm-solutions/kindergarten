import {ChangeDetectionStrategy, Component, HostListener} from '@angular/core';
import {SidebarService} from "./sidebar.service";

@Component({
  selector: 'app-sidebar',
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
    console.log(this.sidebarService.isCurrentlyShown());
    if (this.sidebarService.isCurrentlyShown()) {
      this.sidebarService.hide();
    }
  }
}
