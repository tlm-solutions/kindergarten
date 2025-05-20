import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-profile-icon',
    imports: [CommonModule],
    templateUrl: './profile-icon.component.svg',
    styleUrls: ['./profile-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileIconComponent {

}
