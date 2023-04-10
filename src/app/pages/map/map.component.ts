import {Component} from '@angular/core';
import {routingAnimation} from "../../core/animation/routing.animation";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  animations: [routingAnimation]
})
export class MapComponent {

}
