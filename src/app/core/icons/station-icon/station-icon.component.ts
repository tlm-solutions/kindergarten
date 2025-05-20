import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-station-icon',
    imports: [CommonModule],
    templateUrl: './station-icon.component.svg',
    styleUrls: ['./station-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StationIconComponent {

}
