import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegionId, RegionWithId, RegionWithoutId} from "./region.domain";
import {AbstractDataCacheService} from "../base/abstract-data-cache.service";

@Injectable({
  providedIn: 'root'
})
export class RegionService extends AbstractDataCacheService<RegionWithId, RegionWithId, RegionWithoutId, RegionId> {

  constructor(http: HttpClient) {
    super(http, "region");
  }
}
