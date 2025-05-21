import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NetworkService} from "../../../data/network/network.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {switchMap} from "rxjs";
import {RegionService} from "../../../data/region/region.service";
import {Line, Type} from "../../../data/region/region.domain";
import {Source} from "../../../data/network/network.domain";
import {CommonModule} from '@angular/common';
import {RelativeTimePipe} from "../../../core/pipes/relative-time.pipe";
import {DurationPipe} from "../../../core/pipes/duration.pipe";

@Component({
    selector: 'app-map-vehicle-info',
    templateUrl: './map-vehicle-info.component.html',
    styleUrls: ['./map-vehicle-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RelativeTimePipe, DurationPipe, RouterLink]
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

  protected getSourceDisplayName(source: Source): string {
    switch (source) {
    case Source.UnknownSource:
      return $localize`Unknown`;
    case Source.R09Telegram:
      return $localize`Telegram`;
    case Source.TrekkieGPS:
      return $localize`Realtime GPS`;
    default:
      return $localize`Other`;
    }
  }
}
