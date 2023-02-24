import {Injectable} from '@angular/core';
import {UserId, UserWithId, UserWithoutId} from "./user.domain";
import {HttpClient} from "@angular/common/http";
import {AbstractDataCacheService} from "../base/abstract-data-cache.service";

@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractDataCacheService<UserWithId, UserWithId, UserWithoutId, UserId> {

  constructor(http: HttpClient) {
    super(http, "user");
  }
}
