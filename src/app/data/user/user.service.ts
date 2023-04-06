import {Injectable} from '@angular/core';
import {User, UserId} from "./user.domain";
import {AbstractCachedCrudService} from "../crud/cached-crud.service";

@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractCachedCrudService<User, UserId> {

  constructor() {
    super("user", "user", "users");
  }
}
