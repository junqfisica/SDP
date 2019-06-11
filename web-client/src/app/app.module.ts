import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

import { FileUploadModule } from 'ng2-file-upload';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserService } from './services/user/user.service';
import { AuthService } from './services/auth/auth.service';
import { ApplicationParamService } from './services/setting/application-param.service';
import { NotificationService } from './services/notification/notification.service';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { LoginPermission, SameUserPermission, AdminPermission, RightPermission } from './urlPermission/url.permission';
import { LoginComponent } from './components/login/login.component';
import { CreateUserComponent } from './components/user/create-user/create-user.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';
import { AccountComponent } from './components/user/account/account.component';
import { DataUploadComponent } from './components/seismic-data/data-upload/data-upload.component';
import { SettingListComponent } from './components/setting/setting-list/setting-list.component';
import { ApplicationParamEditComponent } from './components/setting/application-param-edit/application-param-edit.component';
import { FdsnCreateComponent } from './components/seismic-data/fdsn/fdsn-create/fdsn-create.component';
import { FdsnService } from './services/fdsn/fdsn.service';
import { StationListComponent } from './components/seismic-data/fdsn/station-list/station-list.component';
import { ChannelCreateComponent } from './components/seismic-data/fdsn/channel-create/channel-create.component';
import { ChannelListComponent } from './components/seismic-data/fdsn/channel-list/channel-list.component';
import { StationEditComponent } from './components/seismic-data/fdsn/station-edit/station-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateUserComponent,
    UserListComponent,
    UserEditComponent,
    AccountComponent,
    DataUploadComponent,
    SettingListComponent,
    ApplicationParamEditComponent,
    FdsnCreateComponent,
    StationListComponent,
    ChannelCreateComponent,
    ChannelListComponent,
    StationEditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ButtonsModule.forRoot(),
    AlertModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    TypeaheadModule.forRoot(),
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PopoverModule.forRoot(),
    TimepickerModule.forRoot(),
    FileUploadModule,
    Ng2GoogleChartsModule
  ],
  providers: [
    AuthService,
    NotificationService,
    UserService,
    ApplicationParamService,
    FdsnService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    LoginPermission,
    SameUserPermission,
    AdminPermission,
    RightPermission
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
