import {DataService} from "./data.service";
import {Observable} from "rxjs";

export interface DataCacheService<DtoWithId extends DtoSmall, DtoSmall extends { id: Id }, DtoWithoutId, Id> extends DataService<DtoWithId, DtoSmall, DtoWithoutId, Id> {

  findSmallById(id: Id): Observable<DtoSmall | undefined>;

  invalidateCache(): void;

  forceUpdateCache(): void;
}
