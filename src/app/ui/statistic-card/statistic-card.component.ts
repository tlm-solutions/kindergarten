import {Component, ElementRef, HostListener, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-statistic-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './statistic-card.component.html',
  styleUrls: ['./statistic-card.component.scss']
})
export class StatisticCardComponent {

  @Input()
  public name?: string | null;

  @Input()
  public link?: string | null;

  @Input()
  public value?: string | null;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {
  }

  @HostListener('window:mousemove', ["$event"])
  private onMouseMove(event: MouseEvent): void {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();

    this.elementRef.nativeElement.style.setProperty('--xPos', `${Math.round(event.clientX - rect.left)}px`);
    this.elementRef.nativeElement.style.setProperty('--yPos', `${Math.round(event.clientY - rect.top)}px`);
  }
}
