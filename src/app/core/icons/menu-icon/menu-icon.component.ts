import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-menu-icon',
  templateUrl: './menu-icon.component.svg',
  styleUrls: ['./menu-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
standalone: true,
})
export class MenuIconComponent {
}
