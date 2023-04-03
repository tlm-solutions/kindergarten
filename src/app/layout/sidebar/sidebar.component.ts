import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor(
    private readonly router: Router,
  ) {
  }

  get next(): string | undefined {
    const url = this.router.url.substring(1);
    return url.length === 0 ? undefined : url;
  }
}
