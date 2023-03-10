import {BehaviorSubject, map, Observable, Subscription, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {BASE_PATH, PaginationResponse} from "./data.domain";
import {Injectable, OnDestroy} from "@angular/core";
import {DataCacheService} from "./data-cache.service";

const MAX_CACHE_AGE = 1000 * 60 * 5;

@Injectable()
export abstract class AbstractDataCacheService<DtoWithId extends DtoSmall, DtoSmall extends { id: Id }, DtoWithoutId, Id>
  implements DataCacheService<DtoWithId, DtoSmall, DtoWithoutId, Id>, OnDestroy {

  private readonly cache = new BehaviorSubject<DtoSmall[]>([]);
  private lastUpdate = 0;

  private updateSubscription: Subscription | undefined;

  constructor(
    private readonly http: HttpClient,
    private readonly name: string,
  ) {
  }

  public ngOnDestroy(): void {
    this.updateSubscription?.unsubscribe();
  }

  public findAll(): Observable<DtoSmall[]> {
    if (this.lastUpdate < (Date.now() - MAX_CACHE_AGE)) {
      this.forceUpdateCache();
    }

    return this.cache.asObservable();
  }

  public findPage(offset: number, limit: number): Observable<PaginationResponse<DtoSmall>> {
    return this.http.get<PaginationResponse<DtoSmall>>(`${BASE_PATH}/${this.name}`, {params: {offset, limit}, withCredentials: true});
  }

  public findById(id: Id): Observable<DtoWithId> {
    return this.http.get<DtoWithId>(`${BASE_PATH}/${this.name}/${id}`, {withCredentials: true});
  }

  public findSmallById(id: Id): Observable<DtoSmall | undefined> {
    if (this.lastUpdate < (Date.now() - MAX_CACHE_AGE)) {
      this.forceUpdateCache();
    }

    return this.cache.pipe(map(items => items.find(item => item.id === id)));
  }

  public save(dto: DtoWithoutId): Observable<DtoWithId> {
    return this.http.post<DtoWithId>(`${BASE_PATH}/${this.name}`, dto, {withCredentials: true});
  }

  public update(id: Id, dto: DtoWithoutId): Observable<DtoWithId> {
    return this.http.put<DtoWithId>(`${BASE_PATH}/${this.name}/${id}`, dto, {withCredentials: true});
  }

  public patch(id: Id, dto: DtoWithoutId): Observable<DtoWithId> {
    return this.http.patch<DtoWithId>(`${BASE_PATH}/${this.name}/${id}`, dto, {withCredentials: true})
      .pipe(tap(dto => {
        const items = this.cache.value;
        const item = items.find(item => item.id === id);
        if (item) {
          for (const key in item) {
            item[key] = dto[key];
          }

          this.cache.next(items)
        }
      }));
  }

  public delete(id: Id): Observable<Id> {
    return this.http.delete(`${BASE_PATH}/${this.name}/${id}`, {withCredentials: true})
      .pipe(map(() => {
        this.cache.next(this.cache.value.filter(item => item.id === id));
        return id;
      }));
  }

  public invalidateCache(): void {
    this.lastUpdate = 0;
  }

  public forceUpdateCache(): void {
    if (this.updateSubscription) {
      return;
    }

    this.updateSubscription = this.http.get<PaginationResponse<DtoSmall>>(`${BASE_PATH}/${this.name}`, {withCredentials: true})
      .subscribe(data => {
        this.lastUpdate = Date.now();
        this.cache.next(data.elements);
        this.updateSubscription = undefined;
      });
  }
}
