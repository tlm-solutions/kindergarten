import {Injectable} from '@angular/core';
import {Line, Region, RegionId, ReportingPoint, ReportingPointId, ReportingPointRaw} from "./region.domain";
import {AbstractCachedCrudService} from "../crud/cached-crud.service";
import {map, Observable, tap} from "rxjs";
import {DATACARE_BASE_PATH} from "../api.domain";

@Injectable({
  providedIn: 'root'
})
export class RegionService extends AbstractCachedCrudService<Region, RegionId> {

  private regionData: Record<string, Line> = {};

  constructor() {
    super("region", "region", "regions");
  }

  public getReportingPoints(regionId: RegionId): Observable<ReportingPoint[]> {
    return this.http.get<ReportingPoint[]>(`${DATACARE_BASE_PATH}/${this.apiName}/${regionId}/reporting_point`);
  }

  public getReportingPoint(regionId: RegionId, id: ReportingPointId): Observable<ReportingPointRaw[]> {
    return this.http.get<ReportingPointRaw[]>(`${DATACARE_BASE_PATH}/${this.apiName}/${regionId}/reporting_point/${id}`);
  }

  public loadRegion(id: number): Observable<void> {
    return this.http.get<Record<string, Line>>(`assets/data/region/${id}.json`)
      .pipe(
        tap(data => this.regionData = data),
        map(() => void 0),
      );
  }

  public lookupLine(line: number): Line | undefined {
    return this.regionData[String(line)];
  }
}
