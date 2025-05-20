import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-map-icon',
    templateUrl: './map-icon.component.svg',
    styleUrls: ['./map-icon.component.scss'],
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapIconComponent {

}
