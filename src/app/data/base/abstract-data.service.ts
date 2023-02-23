import {map, Observable} from "rxjs";
import {DataService} from "./data.service";
import {HttpClient} from "@angular/common/http";
import {BASE_PATH, PaginationResponse} from "./data.domain";

export abstract class AbstractDataService<DtoWithId, DtoWithoutId, Id> implements DataService<DtoWithId, DtoWithoutId, Id> {

  constructor(
    private readonly http: HttpClient,
    private readonly name: string,
  ) {
  }

  public findAll(offset: number, limit: number): Observable<PaginationResponse<DtoWithId>> {
    return this.http.get<PaginationResponse<DtoWithId>>(`${BASE_PATH}/${this.name}`, {params: {offset, limit}});
  }

  public findById(id: Id): Observable<DtoWithId> {
    return this.http.get<DtoWithId>(`${BASE_PATH}/${this.name}/${id}`);
  }

  public save(dto: DtoWithoutId): Observable<DtoWithId> {
    return this.http.post<DtoWithId>(`${BASE_PATH}/${this.name}`, dto);
  }

  public update(id: Id, dto: DtoWithoutId): Observable<DtoWithId> {
    return this.http.put<DtoWithId>(`${BASE_PATH}/${this.name}/${id}`, dto);
  }

  public patch(id: Id, dto: DtoWithoutId): Observable<DtoWithId> {
    return this.http.patch<DtoWithId>(`${BASE_PATH}/${this.name}/${id}`, dto);
  }

  public delete(id: Id): Observable<Id> {
    return this.http.delete(`${BASE_PATH}/${this.name}/${id}`)
      .pipe(map(() => id));
  }
}
