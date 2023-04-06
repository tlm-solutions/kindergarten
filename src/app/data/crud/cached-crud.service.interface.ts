import {Observable} from "rxjs";
import {CrudService} from "./crud.service.interface";
import {IdHolder, NameHolder} from "../api.domain";

export interface CachedCrudService<D extends (IdHolder<I> & NameHolder), I> extends CrudService<D, I> {

  findAll(): Observable<D[]>;

  getCached(id: I): Observable<D | undefined>;

  searchCached(term: string): Observable<D[]>;

  invalidateCache(): void;
}
