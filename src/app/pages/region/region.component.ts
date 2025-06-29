import {ChangeDetectionStrategy, Component} from '@angular/core';
import {routingAnimation} from "../../core/animation/routing.animation";

import {RouterOutlet} from "@angular/router";

@Component({
    selector: 'app-region',
    templateUrl: './region.component.html',
    styleUrls: ['./region.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [routingAnimation],
    imports: [RouterOutlet]
})
export class RegionComponent {

}
