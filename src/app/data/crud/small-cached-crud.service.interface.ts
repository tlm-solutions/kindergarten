import {Observable} from "rxjs";
import {CrudService} from "./crud.service.interface";
import {IdHolder, NameHolder} from "../api.domain";

export interface SmallCachedCrudService<D extends S, S extends (IdHolder<I> & NameHolder), I> extends CrudService<D, I> {

  findAll(): Observable<S[]>;

  getCached(id: I): Observable<S | undefined>;

  searchCached(term: string): Observable<S[]>;

  invalidateCache(): void;
}
