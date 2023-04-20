import {DATACARE_BASE_PATH, IdHolder, NameHolder, WithoutId} from "../api.domain";
import {AbstractCrudService} from "./crud.service";
import {BehaviorSubject, catchError, map, Observable, of, Subscription, tap} from "rxjs";
import {handleHttpError} from "../api.utils";
import {SmallCachedCrudService} from "./small-cached-crud.service.interface";
import {PaginationResponse} from "./crud.domain";
import {Injectable, OnDestroy} from "@angular/core";

const MAX_AGE = 5;

@Injectable()
export abstract class AbstractSmallCachedCrudService<D extends S, S extends (IdHolder<I> & NameHolder), I> extends AbstractCrudService<D, I> implements SmallCachedCrudService<D, S, I>, OnDestroy {

  private readonly cache = new BehaviorSubject<S[]>([]);
  private cacheUpdateSubscription: Subscription | undefined;
  private cacheExpire = 0;

  constructor(apiName: string, name: string, pluralName: string) {
    super(apiName, name, pluralName);
  }

  public ngOnDestroy(): void {
    this.cache.complete();
  }

  public findAll(): Observable<S[]> {
    if (this.cacheExpire < Date.now() && !this.cacheUpdateSubscription) {
      this.updateCache();
    }

    return this.cache.asObservable();
  }

  public getCached(id: I | undefined | null): Observable<S | undefined> {
    if (id === undefined || id === null) {
      return of(undefined);
    }

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

  public override get(id: I): Observable<D> {
    return super.get(id).pipe(tap(dto => this.receive(id, dto)));
  }

  public override add(dto: WithoutId<D>): Observable<D> {
    return super.add(dto).pipe(tap(dto => {
      const items = [...this.cache.value];
      items.push(dto);
      this.cache.next(items);
    }));
  }

  public override set(id: I, dto: WithoutId<D>): Observable<D> {
    return super.set(id, dto).pipe(tap(dto => this.receive(id, dto)));
  }

  public override update(id: I, dto: Partial<WithoutId<D>>): Observable<D> {
    return super.update(id, dto).pipe(tap(dto => this.receive(id, dto)));
  }

  public override delete(id: I): Observable<void> {
    return super.delete(id).pipe(tap(() => {
      this.cache.next(this.cache.value.filter(item => item.id === id));
    }));
  }

  private receive(id: I, dto: D) {
    const items = [...this.cache.value];
    const idx = items.findIndex(item => item.id === id);

    if (idx >= 0) {
      items[idx] = Object.assign(items[idx], dto);
    } else {
      items.push(dto);
    }

    this.cache.next(items);
  }

  protected updateCache() {
    this.cacheUpdateSubscription = this.http.get<PaginationResponse<S>>(`${DATACARE_BASE_PATH}/${this.apiName}`)
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
          this.notificationService.error($localize`The ${this.pluralName} cache could not be updated. See browser console for more details.`);
        }
      })
  }
}
