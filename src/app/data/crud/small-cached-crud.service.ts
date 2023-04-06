import {BASE_PATH, IdHolder, NameHolder, WithoutId} from "../api.domain";
import {AbstractCrudService} from "./crud.service";
import {BehaviorSubject, catchError, map, Observable, Subscription, tap} from "rxjs";
import {handleHttpError} from "../api.utils";
import {SmallCachedCrudService} from "./small-cached-crud.service.interface";
import {PaginationResponse} from "./crud.domain";

const MAX_AGE = 5;

export abstract class AbstractSmallCachedCrudService<D extends S, S extends (IdHolder<I> & NameHolder), I> extends AbstractCrudService<D, I> implements SmallCachedCrudService<D, S, I> {

  private readonly cache = new BehaviorSubject<S[]>([]);
  private cacheUpdateSubscription: Subscription | undefined;
  private cacheExpire = 0;

  public findAll(): Observable<S[]> {
    if (this.cacheExpire < Date.now() && !this.cacheUpdateSubscription) {
      this.updateCache();
    }

    return this.cache.asObservable();
  }

  public getCached(id: I): Observable<S | undefined> {
    if (this.cacheExpire < Date.now() && !this.cacheUpdateSubscription) {
      this.updateCache();
    }

    return this.cache.asObservable().pipe(map(items => items.find(item => item.id === id)));
  }

  public searchCached(term: string): Observable<S[]> {
    if (this.cacheExpire < Date.now() && !this.cacheUpdateSubscription) {
      this.updateCache();
    }

    term = term.trim().toLowerCase();

    return this.cache.asObservable()
      .pipe(map(items => items.filter(item => item.name.toLowerCase().includes(term))));
  }

  public invalidateCache(): void {
    this.cacheExpire = 0;
  }

  protected updateCache() {
    this.cacheUpdateSubscription = this.http.get<PaginationResponse<S>>(`${BASE_PATH}/${this.api_name}`)
      .pipe(
        catchError(handleHttpError(`update${this.pascalName}Cache`)),
        map(response => {
          if (response.elements.length === response.count) {
            return response.elements
          }

          const message = `Only received ${response.elements.length} of ${response.count} ${this.pluralName}, expected to receive all.`;
          console.error(message);
          throw new Error(message);
        }),
      )
      .subscribe({
        next: items => {
          this.cache.next(items);
          this.cacheExpire = Date.now() + MAX_AGE * 60 * 1000;
          this.cacheUpdateSubscription = undefined;
          console.info(`Updated ${this.name} cache, loaded ${items.length} ${this.pluralName} with a lifetime of ${MAX_AGE} min.`);
        },
        error: () => {
          this.notificationService.error(`The ${this.pluralName} cache could not be updated. See browser console for more details.`);
        }
      })
  }

  public override get(id: I): Observable<D> {
    return super.get(id).pipe(tap(dto => {
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

  public override add(dto: WithoutId<D>): Observable<D> {
    return super.add(dto).pipe(tap(dto => {
      const items = this.cache.value;
      items.push(dto);
      this.cache.next(items);
    }));
  }

  public override set(id: I, dto: WithoutId<D>): Observable<D> {
    return super.set(id, dto).pipe(tap(dto => {
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

  public override update(id: I, dto: Partial<WithoutId<D>>): Observable<D> {
    return super.update(id, dto).pipe(tap(dto => {
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

  public override delete(id: I): Observable<void> {
    return super.delete(id).pipe(tap(() => {
      this.cache.next(this.cache.value.filter(item => item.id === id));
    }));
  }
}
