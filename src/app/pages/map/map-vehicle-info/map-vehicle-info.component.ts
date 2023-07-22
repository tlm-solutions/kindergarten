import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NetworkService} from "../../../data/network/network.service";
import {ActivatedRoute} from "@angular/router";
import {switchMap} from "rxjs";
import {RegionService} from "../../../data/region/region.service";
import {Line, Type} from "../../../data/region/region.domain";

@Component({
  selector: 'app-map-vehicle-info',
  templateUrl: './map-vehicle-info.component.html',
  styleUrls: ['./map-vehicle-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  public type(type: Type): string | undefined {
    switch (type) {
      case Type.BUS:
        return $localize`Bus`;
      case Type.TRAM:
        return $localize`Tram`;
      default:
        return undefined;
    }
  }

  protected lookupLine(line: number): Line | undefined {
    return this.regionService.lookupLine(line);
  }
}
