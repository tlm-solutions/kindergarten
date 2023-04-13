import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-map-icon',
  templateUrl: './map-icon.component.svg',
  styleUrls: ['./map-icon.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapIconComponent {

}
