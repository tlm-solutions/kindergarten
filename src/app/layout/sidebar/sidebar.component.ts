import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  protected readonly color = new FormControl('#fff');

  constructor(
    private readonly router: Router,
  ) {
  }

  ngOnInit() {
    this.color.valueChanges.subscribe(color => {
      const s = document.body.style;
      s.setProperty('--color-primary', color);
    })
  }

  get next(): string | undefined {
    const url = this.router.url.substring(1);
    return url.length === 0 ? undefined : url;
  }
}
