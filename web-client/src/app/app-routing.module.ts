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
import { ChannelCreateComponent } from './components/channel/channel-create/channel-create.component';
import { StationListComponent } from './components/station/station-list/station-list.component';
import { ChannelListComponent } from './components/channel/channel-list/channel-list.component';
import { LocationListComponent } from './components/location/location-list/location-list.component';
import { StationEditComponent } from './components/station/station-edit/station-edit.component';
import { ChannelEditComponent } from './components/channel/channel-edit/channel-edit.component';
import { UploadListComponent } from './components/pre-production/upload-list/upload-list.component';
import { FilesListComponent } from './components/pre-production/files-list/files-list.component';
import { DataListComponent } from './components/seismic-data/data-list/data-list.component';
import { DataSearchComponent } from './components/public/data-search/data-search.component';
import { LocationEditComponent } from './components/location/location-edit/location-edit.component';
import { LocationCreateComponent } from './components/location/location-create/location-create.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'search', component: DataSearchComponent },
  { path: 'user/createUser', component: CreateUserComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_USER_CREATE"]}},
  { path: 'user/users', component: UserListComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_USER"]}},
  { path: 'user/edit/:id', component: UserEditComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_USER_EDIT"]}},
  { path: 'user/account/:username', component: AccountComponent, canActivate: [SameUserPermission]},
  { path: 'data/upload/:username', component: DataUploadComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_DATA_UPLOAD"]}},
  { path: 'data/upload-list', component: UploadListComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_DATA_UPLOAD"]}},
  { path: 'data/upload-list/files/:folderPath', component: FilesListComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_DATA_UPLOAD"]}},
  { path: 'fdsn/create', component: FdsnCreateComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_FDSN_CREATE"]}},
  { path: 'fdsn/create/channel/:stationId/:locationId', component: ChannelCreateComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_FDSN_CREATE"]}},
  { path: 'fdsn/create/location/:stationId', component: LocationCreateComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_FDSN_CREATE"]}},
  { path: 'fdsn/locations/:stationId', component: LocationListComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_FDSN_EDIT"]}},
  { path: 'fdsn/channels/:stationId/:locationId', component: ChannelListComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_FDSN_EDIT"]}},
  { path: 'fdsn/data/:channelId', component: DataListComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_FDSN_EDIT"]}},
  { path: 'fdsn/channel/edit/:channelId', component: ChannelEditComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_FDSN_EDIT"]}},
  { path: 'fdsn/location/edit/:locationId', component: LocationEditComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_FDSN_EDIT"]}},
  { path: 'fdsn/stations', component: StationListComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_FDSN_EDIT"]}},
  { path: 'fdsn/stations/edit/:stationId', component: StationEditComponent, canActivate: [RightPermission], data: {rights: ["RIGHT_FDSN_EDIT"]}},
  { path: 'settings', component: SettingListComponent, canActivate: [AdminPermission]},
  { path: 'settings/editSetting/:id', component: ApplicationParamEditComponent, canActivate: [AdminPermission]},

  // otherwise redirect to profile
  { path: '**', redirectTo: 'search' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
