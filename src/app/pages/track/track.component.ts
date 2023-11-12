import {ChangeDetectionStrategy, Component} from '@angular/core';
import {routingAnimation} from "../../core/animation/routing.animation";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [routingAnimation],
  standalone: true,
  imports: [CommonModule, RouterOutlet],
})
export class TrackComponent {

}
