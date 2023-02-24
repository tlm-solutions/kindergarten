import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StationComponent {
}
