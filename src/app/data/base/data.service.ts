import {Observable} from "rxjs";
import {IdHolder, PaginationResponse} from "./data.domain";

export interface DataService<DtoWithId extends DtoSmall, DtoSmall extends IdHolder<Id>, DtoWithoutId, Id> {

  findAll(): Observable<DtoSmall[]>;

  findPage(offset: number, limit: number): Observable<PaginationResponse<DtoSmall>>;

  findById(id: Id): Observable<DtoWithId>;

  save(dto: DtoWithoutId): Observable<DtoWithId>;

  update(id: Id, dto: DtoWithoutId): Observable<DtoWithId>;

  patch(id: Id, dto: DtoWithoutId): Observable<DtoWithId>;

  delete(id: Id): Observable<Id>;
}
