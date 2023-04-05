import {Injectable} from '@angular/core';
import {StationId, StationWithId, StationWithoutId} from "./station.domain";
import {AbstractDataCacheService} from "../base/abstract-data-cache.service";

@Injectable({
  providedIn: 'root'
})
export class StationService extends AbstractDataCacheService<StationWithId, StationWithId, StationWithoutId, StationId> {

  constructor() {
    super("station", "Station");
  }
}
