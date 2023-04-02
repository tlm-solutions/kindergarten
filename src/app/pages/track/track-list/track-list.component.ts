import {Component} from '@angular/core';
import {BehaviorSubject, map, Observable, share, switchMap} from "rxjs";
import {TrackService} from "../../../data/track/track.service";
import {TrackId, TrackWithId} from "../../../data/track/track.domain";
import {RegionId, RegionWithId} from "../../../data/region/region.domain";
import {RegionService} from "../../../data/region/region.service";

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.scss']
})
export class TrackListComponent {

  private readonly pagination = new BehaviorSubject({offset: 0, limit: 0});
  private readonly trackPages = this.pagination.pipe(
    switchMap(({offset, limit}) => this.trackService.findPage(offset, limit)),
    share(),
  );

  protected readonly tracks = this.trackPages.pipe(map(({elements}) => elements));

  constructor(
    private readonly trackService: TrackService,
    private readonly regionService: RegionService,
  ) {
  }

  protected findSmallRegion(id: RegionId): Observable<RegionWithId | undefined> {
    return this.regionService.findSmallById(id);
  }

  protected trackBy(idx: number, element: TrackWithId): TrackId {
    return element.id;
  }

  updateOffset(target: EventTarget|null) {
    this.pagination.next({limit: this.pagination.value.limit, offset: parseInt((target as HTMLInputElement).value)});
  }

  updateLimit(target: EventTarget|null) {
    this.pagination.next({offset: this.pagination.value.offset, limit: parseInt((target as HTMLInputElement).value)});
  }
}
