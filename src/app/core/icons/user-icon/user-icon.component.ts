import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-user-icon',
    imports: [CommonModule],
    templateUrl: './user-icon.component.svg',
    styleUrls: ['./user-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserIconComponent {

}
