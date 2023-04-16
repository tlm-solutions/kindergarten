import {Injectable} from '@angular/core';
import {Correlation, Track, TrackId} from "./track.domain";
import {Observable} from "rxjs";
import {AbstractCrudService} from "../crud/crud.service";
import {DATACARE_BASE_PATH} from "../api.domain";

@Injectable({
  providedIn: 'root'
})
export class TrackService extends AbstractCrudService<Track, TrackId> {

  constructor() {
    super("trekkie", "track", "tracks");
  }

  public getCorrelation(id: TrackId): Observable<Correlation[]> {
    return this.http.get<Correlation[]>(`${DATACARE_BASE_PATH}/${this.apiName}/${id}/correlate`, {withCredentials: true})
  }
}
