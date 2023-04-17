import {Injectable} from '@angular/core';
import {Region, RegionId, ReportingPoint} from "./region.domain";
import {AbstractCachedCrudService} from "../crud/cached-crud.service";
import {Observable} from "rxjs";
import {DATACARE_BASE_PATH} from "../api.domain";

@Injectable({
  providedIn: 'root'
})
export class RegionService extends AbstractCachedCrudService<Region, RegionId> {

  constructor() {
    super("region", "region", "regions");
  }

  public getReportingPoints(regionId: RegionId): Observable<ReportingPoint[]> {
    return this.http.get<ReportingPoint[]>(`${DATACARE_BASE_PATH}/${this.apiName}/${regionId}/reporting_points`);
  }
}
