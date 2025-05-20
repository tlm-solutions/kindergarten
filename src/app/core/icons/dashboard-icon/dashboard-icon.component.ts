import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-dashboard-icon',
    imports: [CommonModule],
    templateUrl: './dashboard-icon.component.svg',
    styleUrls: ['./dashboard-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardIconComponent {
}
