import {Injectable} from '@angular/core';
import {AbstractDataService} from "../base/abstract-data.service";
import {TrackId, TrackWithId, TrackWithoutId} from "./track.domain";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TrackService extends AbstractDataService<TrackWithId, TrackWithId, TrackWithoutId, TrackId> {

  constructor(http: HttpClient) {
    super(http, "trekkie");
  }
}
