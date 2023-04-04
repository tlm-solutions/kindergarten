import {ChangeDetectionStrategy, Component} from '@angular/core';
import {map, share, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {RegionService} from "../../../data/region/region.service";

@Component({
  selector: 'app-region-view',
  templateUrl: './region-view.component.html',
  styleUrls: ['./region-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionViewComponent {

  protected readonly region = this.route.params.pipe(
    map(({id}) => id),
    switchMap(id => this.regionService.findById(id)),
    share(),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly regionService: RegionService,
  ) {
  }
}
