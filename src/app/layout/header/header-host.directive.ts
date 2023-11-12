import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appHeaderHost]',
  standalone: true,
})
export class HeaderHostDirective {

  constructor(
    public readonly viewContainerRef: ViewContainerRef,
  ) {
  }
}
