import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-menu-icon',
    templateUrl: './menu-icon.component.svg',
    styleUrls: ['./menu-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule]
})
export class MenuIconComponent {
}
