import { HttpErrorResponse } from "@angular/common/http";
import {Observable, throwError} from "rxjs";

export function handleHttpError(operation: string): (error: HttpErrorResponse) => Observable<never> {
  return (error: HttpErrorResponse): Observable<never> => {
    console.error(`${operation}: ${error.message}`, error);

    return throwError(() => error);
  };
}

export function toPascalCase(value: string): string {
  return value.split("-")
    .map(part => part[0].toUpperCase() + part.substring(1))
    .join("");
}
