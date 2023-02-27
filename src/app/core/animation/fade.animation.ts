import {animate, state, style, transition, trigger} from "@angular/animations";

export const fadeAnimation = trigger("fade", [
  state("void", style({opacity: 0})),
  transition("* => *", animate("150ms ease-in-out")),
]);
