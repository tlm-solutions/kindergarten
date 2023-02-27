import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginRoutingModule} from './login-routing.module';
import {LoginComponent} from './login.component';
import {TextFieldComponent} from "../../core/components/text-field/text-field.component";
import {ReactiveFormsModule} from "@angular/forms";
import {ErrorComponent} from "../../core/components/error/error.component";
import {ButtonComponent} from "../../core/components/button/button.component";
import {TlmsIconComponent} from "../../core/icons/tlms-icon/tlms-icon.component";

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    TextFieldComponent,
    ReactiveFormsModule,
    ErrorComponent,
    ButtonComponent,
    TlmsIconComponent,
  ]
})
export class LoginModule {
}
