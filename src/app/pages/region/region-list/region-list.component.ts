import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RegionService} from "../../../data/region/region.service";
import {IdHolder} from "../../../data/api.domain";

@Component({
  selector: 'app-region-list',
  templateUrl: './region-list.component.html',
  styleUrls: ['./region-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionListComponent {

  protected readonly regions = this.regionService.findAll();

  constructor(
    private readonly regionService: RegionService,
  ) {
  }

  protected trackBy<T>(_: number, {id}: IdHolder<T>): T {
    return id;
  }
}
