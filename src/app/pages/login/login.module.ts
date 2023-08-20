import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginRoutingModule} from './login-routing.module';
import {LoginComponent} from './login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {TlmsIconComponent} from "../../core/icons/tlms-icon/tlms-icon.component";
import {ButtonComponent, FormErrorComponent, TextFieldComponent} from "@feel/form";

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    TlmsIconComponent,
    TextFieldComponent,
    FormErrorComponent,
    ButtonComponent,
  ]
})
export class LoginModule {
}
