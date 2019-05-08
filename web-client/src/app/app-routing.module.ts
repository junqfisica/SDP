import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { CreateUserComponent } from './components/user/create-user/create-user.component';
import { SameUserPermission, AdminPermission, RightPermission } from './urlPermission/url.permission';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';
import { AccountComponent } from './components/user/account/account.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'user/createUser', component: CreateUserComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_USER_CREATE"]}},
  { path: 'user/users', component: UserListComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_USER"]}},
  { path: 'user/edit/:id', component: UserEditComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_USER_EDIT"]}},
  { path: 'user/account/:username', component: AccountComponent, canActivate: [SameUserPermission]},


  // otherwise redirect to profile
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
