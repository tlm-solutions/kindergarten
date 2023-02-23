import {Injectable} from '@angular/core';
import {AbstractDataService} from "../base/abstract-data.service";
import {StationId, StationWithId, StationWithoutId} from "./station.domain";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StationService extends AbstractDataService<StationWithId, StationWithoutId, StationId> {

  constructor(http: HttpClient) {
    super(http, "station");
  }
}
