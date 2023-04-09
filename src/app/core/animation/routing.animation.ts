import {animate, group, query, sequence, style, transition, trigger} from "@angular/animations";

export const routingAnimation = trigger('routing', [
  transition('* => *', [
    sequence([
      group([
        query(':enter', style({opacity: 0, position: 'absolute'}), {optional: true}),
        query(':leave', [
          style({opacity: 1, position: 'static'}),
          animate('150ms ease-in-out', style({opacity: 0})),
        ], {optional: true}),
      ]),
      group([
        query(':leave', style({opacity: 0, position: 'absolute'}), {optional: true}),
        query(':enter', [
          style({opacity: 0, position: 'static'}),
          animate('150ms ease-in-out', style({opacity: 1}))
        ], {optional: true})
      ])
    ]),
  ])
]);
