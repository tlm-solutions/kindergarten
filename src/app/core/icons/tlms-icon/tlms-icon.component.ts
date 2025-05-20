import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-tlms-icon',
    imports: [CommonModule],
    templateUrl: './icon-tlms.component.svg',
    styleUrls: ['./tlms-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TlmsIconComponent {

}
