import {Injectable} from '@angular/core';
import {AbstractDataService} from "../base/abstract-data.service";
import {TrackId, TrackSmallWithId, TrackWithId, TrackWithoutId} from "./track.domain";

@Injectable({
  providedIn: 'root'
})
export class TrackService extends AbstractDataService<TrackWithId, TrackSmallWithId, TrackWithoutId, TrackId> {

  constructor() {
    super("trekkie");
  }
}
