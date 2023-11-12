import {ChangeDetectionStrategy, Component} from '@angular/core';
import {routingAnimation} from "../../core/animation/routing.animation";
import {CommonModule} from "@angular/common";
import {MapWindshieldComponent} from "./map-windshield/map-windshield.component";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  animations: [routingAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MapWindshieldComponent],
})
export class MapComponent {

}
