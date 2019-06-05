import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { CreateUserComponent } from './components/user/create-user/create-user.component';
import { SameUserPermission, RightPermission, AdminPermission } from './urlPermission/url.permission';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';
import { AccountComponent } from './components/user/account/account.component';
import { DataUploadComponent } from './components/seismic-data/data-upload/data-upload.component';
import { SettingListComponent } from './components/setting/setting-list/setting-list.component';
import { ApplicationParamEditComponent } from './components/setting/application-param-edit/application-param-edit.component';
import { FdsnCreateComponent } from './components/seismic-data/fdsn/fdsn-create/fdsn-create.component';
import { ChannelCreateComponent } from './components/seismic-data/fdsn/channel-create/channel-create.component';
import { StationListComponent } from './components/seismic-data/fdsn/station-list/station-list.component';
import { ChannelListComponent } from './components/seismic-data/fdsn/channel-list/channel-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'user/createUser', component: CreateUserComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_USER_CREATE"]}},
  { path: 'user/users', component: UserListComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_USER"]}},
  { path: 'user/edit/:id', component: UserEditComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_USER_EDIT"]}},
  { path: 'user/account/:username', component: AccountComponent, canActivate: [SameUserPermission]},
  { path: 'data/upload/:username', component: DataUploadComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_DATA_UPLOAD"]}},
  { path: 'fdsn/create', component: FdsnCreateComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_FDSN_CREATE"]}},
  { path: 'fdsn/create/channel/:stationId', component: ChannelCreateComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_FDSN_CREATE"]}},
  { path: 'fdsn/channel/:stationId', component: ChannelListComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_FDSN_EDIT"]}},
  { path: 'fdsn/stations', component: StationListComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_FDSN_EDIT"]}},
  { path: 'settings', component: SettingListComponent, canActivate: [AdminPermission]},
  { path: 'settings/editSetting/:id', component: ApplicationParamEditComponent, canActivate: [AdminPermission]},

  // otherwise redirect to profile
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
