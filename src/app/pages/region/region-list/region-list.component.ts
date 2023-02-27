import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RegionService} from "../../../data/region/region.service";
import {RegionId, RegionWithId} from "../../../data/region/region.domain";
import {map} from "rxjs";

@Component({
  selector: 'app-region-list',
  templateUrl: './region-list.component.html',
  styleUrls: ['./region-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegionListComponent {

  protected readonly regions = this.regionService.findAll();
  protected readonly regionCount = this.regions.pipe(map(regions => regions.length));

  constructor(
    private readonly regionService: RegionService,
  ) {
  }

  protected trackBy(idx: number, element: RegionWithId): RegionId {
    return element.id;
  }
}
