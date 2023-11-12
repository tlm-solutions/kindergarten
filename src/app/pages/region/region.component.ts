import {ChangeDetectionStrategy, Component} from '@angular/core';
import {routingAnimation} from "../../core/animation/routing.animation";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [routingAnimation],
  standalone: true,
  imports: [CommonModule, RouterOutlet],
})
export class RegionComponent {

}
