import {ChangeDetectionStrategy, Component} from '@angular/core';
import {routingAnimation} from "../../core/animation/routing.animation";

import {RouterOutlet} from "@angular/router";

@Component({
    selector: 'app-station',
    templateUrl: './station.component.html',
    styleUrls: ['./station.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [routingAnimation],
    imports: [RouterOutlet]
})
export class StationComponent {
}
