import {Component, HostBinding, Input} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";

export type ButtonFlavor = "good" | "danger";

@Component({
  selector: "app-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ButtonComponent {

  @Input() public label?: string;
  @Input() public link?: string;
  @Input() public externalLink?: string;
  @Input() public query?: Record<string, string | undefined>;
  @Input() public flavor?: ButtonFlavor;
  @Input() @HostBinding("class.disabled") public disabled?: boolean | null;

  @HostBinding("class.good")
  private get good(): boolean {
    return this.flavor === "good";
  }

  @HostBinding("class.danger")
  private get danger(): boolean {
    return this.flavor === "danger";
  }
}
