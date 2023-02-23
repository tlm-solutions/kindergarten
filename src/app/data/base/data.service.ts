import {Observable} from "rxjs";
import {PaginationResponse} from "./data.domain";

export interface DataService<DtoWithId, DtoWithoutId, Id> {

  findAll(offset: number, limit: number): Observable<PaginationResponse<DtoWithId>>;

  findById(id: Id): Observable<DtoWithId>;

  save(dto: DtoWithoutId): Observable<DtoWithId>;

  update(id: Id, dto: DtoWithoutId): Observable<DtoWithId>;

  patch(id: Id, dto: DtoWithoutId): Observable<DtoWithId>;

  delete(id: Id): Observable<Id>;
}
