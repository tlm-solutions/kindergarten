import {Component} from '@angular/core';
import {RegionService} from "../../../data/region/region.service";
import {map} from "rxjs";

@Component({
  selector: 'app-map-region-selector',
  templateUrl: './map-region-selector.component.html',
  styleUrls: ['./map-region-selector.component.scss']
})
export class MapRegionSelectorComponent {

  protected readonly regions = this.regionService.findAll()
    .pipe(map(regions => regions.filter(region => !region.work_in_progress)));

  constructor(
    private readonly regionService: RegionService,
  ) {
  }
}
