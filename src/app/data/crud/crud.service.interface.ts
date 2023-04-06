import {IdHolder, WithoutId} from "../api.domain";
import {Observable} from "rxjs";
import {PaginationResponse} from "./crud.domain";

export interface CrudService<D extends IdHolder<I>, I> {

  getPage(offset: number, limit: number): Observable<PaginationResponse<D>>;

  get(id: I): Observable<D>;

  add(dto: WithoutId<D>): Observable<D>;

  set(id: I, dto: WithoutId<D>): Observable<D>;

  update(id: I, dto: Partial<WithoutId<D>>): Observable<D>;

  delete(id: I): Observable<void>;
}
