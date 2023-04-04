import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-track-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-icon.component.svg',
  styleUrls: ['./track-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackIconComponent {

}
