import {Component} from '@angular/core';
import {map} from "rxjs";
import {UserService} from "../../../data/user/user.service";
import {UserId, UserWithId} from "../../../data/user/user.domain";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {

  protected readonly users = this.userService.findAll();
  protected readonly userCount = this.users.pipe(map(users => users.length));

  constructor(
    private readonly userService: UserService,
  ) {
  }

  protected trackBy(idx: number, element: UserWithId): UserId {
    return element.id;
  }
}
