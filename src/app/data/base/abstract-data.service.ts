import {map, Observable} from "rxjs";
import {DataService} from "./data.service";
import {HttpClient} from "@angular/common/http";
import {BASE_PATH, PaginationResponse} from "./data.domain";
import {Injectable} from "@angular/core";

@Injectable()
export abstract class AbstractDataService<DtoWithId extends DtoSmall, DtoSmall extends { id: Id }, DtoWithoutId, Id>
  implements DataService<DtoWithId, DtoSmall, DtoWithoutId, Id> {

  constructor(
    private readonly http: HttpClient,
    private readonly name: string,
  ) {
  }

  public findAll(): Observable<DtoSmall[]> {
    return this.http.get<PaginationResponse<DtoSmall>>(`${BASE_PATH}/${this.name}`)
      .pipe(map(data => data.elements));
  }

  public findPage(offset: number, limit: number): Observable<PaginationResponse<DtoSmall>> {
    return this.http.get<PaginationResponse<DtoSmall>>(`${BASE_PATH}/${this.name}`, {params: {offset, limit}});
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
