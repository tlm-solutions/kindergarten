import {Component, Input} from '@angular/core';
import {ReportingPoint} from "../../../data/region/region.domain";

@Component({
  selector: 'app-region-map-reporting-point-info',
  templateUrl: './region-map-reporting-point-info.component.html',
  styleUrls: ['./region-map-reporting-point-info.component.scss']
})
export class RegionMapReportingPointInfoComponent {

  @Input()
  protected reportingPoint?: ReportingPoint;

  protected roundLatLon(num: number): number {
    const idk = Math.pow(10, 4);
    return Math.round(num * idk) / idk;
  }
}
