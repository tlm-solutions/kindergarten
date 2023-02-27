import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StationId, StationWithId} from "../../../data/station/station.domain";
import {StationService} from "../../../data/station/station.service";
import {map} from "rxjs";

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StationListComponent {

  protected readonly stations = this.stationService.findAll();
  protected readonly stationCount = this.stations.pipe(map(stations => stations.length));

  constructor(
    private readonly stationService: StationService,
  ) {
  }

  protected trackBy(idx: number, element: StationWithId): StationId {
    return element.id;
  }
}
