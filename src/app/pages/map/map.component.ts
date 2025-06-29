import {ChangeDetectionStrategy, Component} from '@angular/core';
import {routingAnimation} from "../../core/animation/routing.animation";

import {MapWindshieldComponent} from "./map-windshield/map-windshield.component";

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    animations: [routingAnimation],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MapWindshieldComponent]
})
export class MapComponent {

}
