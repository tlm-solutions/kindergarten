import {Component, Input} from '@angular/core';
import {ReportingPoint} from "../../../data/region/region.domain";

import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-region-map-reporting-point-info',
    templateUrl: './region-map-reporting-point-info.component.html',
    styleUrls: ['./region-map-reporting-point-info.component.scss'],
    imports: [RouterLink]
})
export class RegionMapReportingPointInfoComponent {

  @Input()
  protected reportingPoint?: ReportingPoint;

  protected roundLatLon(num: number): number {
    const idk = Math.pow(10, 4);
    return Math.round(num * idk) / idk;
  }
}
