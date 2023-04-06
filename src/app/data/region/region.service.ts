import {Injectable} from '@angular/core';
import {Region, RegionId} from "./region.domain";
import {AbstractCachedCrudService} from "../crud/cached-crud.service";

@Injectable({
  providedIn: 'root'
})
export class RegionService extends AbstractCachedCrudService<Region, RegionId> {

  constructor() {
    super("region", "region", "regions");
  }
}
