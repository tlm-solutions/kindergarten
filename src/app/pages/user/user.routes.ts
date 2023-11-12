import {Routes} from '@angular/router';
import {UserComponent} from './user.component';
import {UserListComponent} from "./user-list/user-list.component";
import {UserViewComponent} from "./user-view/user-view.component";

const routes: Routes = [{
  path: '', component: UserComponent, children: [
    {path: '', component: UserListComponent},
    {path: ':id', component: UserViewComponent},
  ]
}];

export default routes;
