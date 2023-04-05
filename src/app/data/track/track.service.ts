import {Injectable} from '@angular/core';
import {AbstractDataService} from "../base/abstract-data.service";
import {Correlation, TrackId, TrackSmallWithId, TrackWithId, TrackWithoutId} from "./track.domain";
import {Observable} from "rxjs";
import {BASE_PATH} from "../base/data.domain";

@Injectable({
  providedIn: 'root'
})
export class TrackService extends AbstractDataService<TrackWithId, TrackSmallWithId, TrackWithoutId, TrackId> {

  constructor() {
    super("trekkie");
  }

  public getCorrelation(id: TrackId): Observable<Correlation[]> {
    return this.http.get<Correlation[]>(`${BASE_PATH}/${this.name}/${id}/correlate`, {withCredentials: true})
  }
}
