import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserRoutingModule} from './user-routing.module';
import {UserComponent} from './user.component';
import {UserIconComponent} from "../../core/icons/user-icon/user-icon.component";
import { UserListComponent } from './user-list/user-list.component';
import { UserViewComponent } from './user-view/user-view.component';
import {ButtonComponent} from "../../core/components/button/button.component";

@NgModule({
  declarations: [
    UserComponent,
    UserListComponent,
    UserViewComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    UserIconComponent,
    ButtonComponent
  ]
})
export class UserModule {
}
