import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';

import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { StoreLoginComponent } from './components/store-login/store-login.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';

@NgModule({
  declarations: [
    UserLoginComponent,
    UserRegisterComponent,
    StoreLoginComponent,
    AdminLoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }