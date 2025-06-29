import {ChangeDetectionStrategy, Component} from '@angular/core';
import {routingAnimation} from "../../core/animation/routing.animation";

import {RouterOutlet} from "@angular/router";

@Component({
    selector: 'app-track',
    templateUrl: './track.component.html',
    styleUrls: ['./track.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [routingAnimation],
    imports: [RouterOutlet]
})
export class TrackComponent {

}
