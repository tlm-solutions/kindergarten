import {Component} from '@angular/core';
import {NetworkService} from "../../../data/network/network.service";
import {ActivatedRoute} from "@angular/router";
import {switchMap} from "rxjs";
import {formatDuration, formatRelativeTime} from "../../../core/utils";

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
    private readonly route: ActivatedRoute,
  ) {
  }

  protected relativeTime(time: number | string): string {
    return formatRelativeTime(Number(time));
  }

  protected duration(time: number|string): string{
    console.log(time);
    return formatDuration(Number(time));
  }
}
