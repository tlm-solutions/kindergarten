import {ChangeDetectionStrategy, Component} from '@angular/core';
import {routingAnimation} from "../../core/animation/routing.animation";
import {RouterOutlet} from '@angular/router';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [routingAnimation],
  standalone: true,
  imports: [CommonModule, RouterOutlet],
})
export class UserComponent {

}
