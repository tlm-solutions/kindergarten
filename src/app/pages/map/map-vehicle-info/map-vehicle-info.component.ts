import {Component} from '@angular/core';
import {NetworkService} from "../../../data/network/network.service";
import {ActivatedRoute} from "@angular/router";
import {switchMap} from "rxjs";
import {formatDuration, formatRelativeTime} from "../../../core/utils";
import {RegionService} from "../../../data/region/region.service";
import {Line, Type} from "../../../data/region/region.domain";

@Component({
  selector: 'app-map-vehicle-info',
  templateUrl: './map-vehicle-info.component.html',
  styleUrls: ['./map-vehicle-info.component.scss']
})
export class MapVehicleInfoComponent {

  protected readonly vehicle = this.route.queryParams.pipe(
    switchMap(({line, run}) => this.networkService.getVehicle(Number(line), Number(run)))
  );

  constructor(
    private readonly networkService: NetworkService,
    private readonly regionService: RegionService,
    private readonly route: ActivatedRoute,
  ) {
  }

  protected lookupLine(line: number): Line | undefined {
    return this.regionService.lookupLine(line);
  }

  protected relativeTime(time: number | string): string {
    return formatRelativeTime(Number(time));
  }

  protected duration(time: number | string): string {
    console.log(time);
    return formatDuration(Number(time));
  }

  public type(type: Type): string | undefined {
    switch (type) {
      case Type.BUS:
        return "Bus";
      case Type.TRAM:
        return "Tram";
      default:
        return undefined;
    }
  }
}
