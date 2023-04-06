import {ChangeDetectionStrategy, Component} from '@angular/core';
import {UserService} from "../../../data/user/user.service";
import {IdHolder} from "../../../data/api.domain";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {

  protected readonly users = this.userService.findAll();

  constructor(
    private readonly userService: UserService,
  ) {
  }

  protected trackBy<T>(_: number, {id}: IdHolder<T>): T {
    return id;
  }
}
