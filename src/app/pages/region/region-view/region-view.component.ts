import {ChangeDetectionStrategy, Component} from '@angular/core';
import {map, share, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {RegionService} from "../../../data/region/region.service";
import {CommonModule} from "@angular/common";
import {ButtonComponent} from "@feel/form";
import {RegionMapComponent} from "../region-map/region-map.component";

@Component({
  selector: 'app-region-view',
  templateUrl: './region-view.component.html',
  styleUrls: ['./region-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ButtonComponent, RegionMapComponent],
})
export class RegionViewComponent {

  private readonly regionId = this.route.params.pipe(map(({id}) => id));

  protected readonly region = this.regionId.pipe(
    switchMap(id => this.regionService.get(id)),
    share(),
  );

  protected readonly reportingPoints = this.regionId.pipe(
    switchMap(id => this.regionService.getReportingPoints(id)),
    share(),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly regionService: RegionService,
  ) {
  }
}
