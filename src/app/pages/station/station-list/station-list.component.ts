import {Component} from '@angular/core';
import {BehaviorSubject, switchMap} from "rxjs";
import {StationId, StationWithId} from "../../../data/station/station.domain";
import {Pagination} from "../../../data/base/data.domain";
import {StationService} from "../../../data/station/station.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss']
})
export class StationListComponent {

  protected readonly pagination = new BehaviorSubject<Pagination>({offset: 0, limit: 30});

  protected readonly stations = this.pagination.pipe(
    switchMap(({offset, limit}) => this.stationService.findAll(offset, limit)),
  );

  constructor(
    private readonly stationService: StationService,
    private readonly activatedRoute: ActivatedRoute,
  ) {
  }

  protected trackBy(idx: number, element: StationWithId): StationId {
    return element.id;
  }
}
