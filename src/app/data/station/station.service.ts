import {Injectable} from '@angular/core';
import {StationId, StationWithId, StationWithoutId} from "./station.domain";
import {HttpClient} from "@angular/common/http";
import {AbstractDataCacheService} from "../base/abstract-data-cache.service";

@Injectable({
  providedIn: 'root'
})
export class StationService extends AbstractDataCacheService<StationWithId, StationWithId, StationWithoutId, StationId> {

  constructor(http: HttpClient) {
    super(http, "station");
  }
}
