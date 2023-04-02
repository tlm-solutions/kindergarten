import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RegionService} from "../../../data/region/region.service";
import {RegionId, RegionWithId} from "../../../data/region/region.domain";

@Component({
  selector: 'app-region-list',
  templateUrl: './region-list.component.html',
  styleUrls: ['./region-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegionListComponent {

  protected readonly regions = this.regionService.findAll();

  constructor(
    private readonly regionService: RegionService,
  ) {
  }

  protected trackBy(idx: number, element: RegionWithId): RegionId {
    return element.id;
  }
}
