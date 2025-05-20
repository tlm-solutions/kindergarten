import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-region-icon',
    imports: [CommonModule],
    templateUrl: './region-icon.component.svg',
    styleUrls: ['./region-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegionIconComponent {

}
