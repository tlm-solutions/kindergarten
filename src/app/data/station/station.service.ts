import {Injectable} from '@angular/core';
import {Station, StationId} from "./station.domain";
import {AbstractCachedCrudService} from "../crud/cached-crud.service";

@Injectable({
  providedIn: 'root'
})
export class StationService extends AbstractCachedCrudService<Station, StationId> {

  constructor() {
    super("station", "station", "stations");
  }
}
