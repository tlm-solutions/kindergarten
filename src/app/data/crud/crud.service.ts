import {CrudService} from "./crud.service.interface";
import {DATACARE_BASE_PATH, IdHolder, WithoutId} from "../api.domain";
import { HttpClient } from "@angular/common/http";
import {inject} from "@angular/core";
import {catchError, Observable, retry} from "rxjs";
import {handleHttpError, toPascalCase} from "../api.utils";
import {NotificationService} from "@feel/notification";
import {PaginationResponse} from "./crud.domain";

export abstract class AbstractCrudService<D extends IdHolder<I>, I> implements CrudService<D, I> {

  protected readonly http = inject(HttpClient);
  protected readonly notificationService = inject(NotificationService);

  protected readonly pascalName = toPascalCase(this.name);

  constructor(
    protected readonly apiName: string,
    protected readonly name: string,
    protected readonly pluralName: string,
  ) {
  }

  public getPage(offset: number, limit: number): Observable<PaginationResponse<D>> {
    return this.http.get<PaginationResponse<D>>(`${DATACARE_BASE_PATH}/${this.apiName}`, {
      withCredentials: true,
      params: {offset, limit}
    })
      .pipe(retry(2), catchError(handleHttpError(`get${this.pascalName}Page`)));
  }

  public get(id: I): Observable<D> {
    return this.http.get<D>(`${DATACARE_BASE_PATH}/${this.apiName}/${id}`, {withCredentials: true})
      .pipe(retry(2), catchError(handleHttpError(`get${this.pascalName}`)));
  }

  public add(dto: WithoutId<D>): Observable<D> {
    return this.http.post<D>(`${DATACARE_BASE_PATH}/${this.apiName}`, dto, {withCredentials: true})
      .pipe(catchError(handleHttpError(`add${this.pascalName}`)));
  }

  public set(id: I, dto: WithoutId<D>): Observable<D> {
    return this.http.put<D>(`${DATACARE_BASE_PATH}/${this.apiName}/${id}`, dto, {withCredentials: true})
      .pipe(retry(2), catchError(handleHttpError(`set${this.pascalName}`)));
  }

  public update(id: I, dto: Partial<WithoutId<D>>): Observable<D> {
    return this.http.patch<D>(`${DATACARE_BASE_PATH}/${this.apiName}/${id}`, dto, {withCredentials: true})
      .pipe(retry(2), catchError(handleHttpError(`update${this.pascalName}`)));
  }

  public delete(id: I): Observable<void> {
    return this.http.delete<void>(`${DATACARE_BASE_PATH}/${this.apiName}/${id}`, {withCredentials: true})
      .pipe(retry(2), catchError(handleHttpError(`delete${this.pascalName}`)));
  }
}
