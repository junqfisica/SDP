import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

import { FileUploadModule } from 'ng2-file-upload';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserService } from './services/user/user.service';
import { AuthService } from './services/auth/auth.service';
import { SettingsService } from './services/setting/application-param.service';
import { NotificationService } from './services/notification/notification.service';
import { FdsnService } from './services/fdsn/fdsn.service';
import { PreProductionService } from './services/pre-production/pre-production.service';
import { DataService } from './services/data/data.service';
import { PublicService } from './services/public/public.service';

import { TokenInterceptor } from './interceptors/token.interceptor';

import { LoginPermission, SameUserPermission, AdminPermission, RightPermission } from './urlPermission/url.permission';

import { NoCommaNumberPipe } from './pipes/number-pipe';

import { LoginComponent } from './components/login/login.component';
import { CreateUserComponent } from './components/user/create-user/create-user.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';
import { AccountComponent } from './components/user/account/account.component';
import { DataUploadComponent } from './components/seismic-data/data-upload/data-upload.component';
import { SettingListComponent } from './components/setting/setting-list/setting-list.component';
import { ApplicationParamEditComponent } from './components/setting/application-param-edit/application-param-edit.component';
import { FdsnCreateComponent } from './components/seismic-data/fdsn/fdsn-create/fdsn-create.component';
import { StationListComponent } from './components/station/station-list/station-list.component';
import { ChannelCreateComponent } from './components/channel/channel-create/channel-create.component';
import { ChannelListComponent } from './components/channel/channel-list/channel-list.component';
import { StationEditComponent } from './components/station/station-edit/station-edit.component';
import { ChannelEditComponent } from './components/channel/channel-edit/channel-edit.component';
import { WrapTlGoogleChartComponent } from './components/reusable/wrap-tl-google-chart/wrap-tl-google-chart.component';
import { UploadListComponent } from './components/pre-production/upload-list/upload-list.component';
import { FilesListComponent } from './components/pre-production/files-list/files-list.component';
import { DataListComponent } from './components/seismic-data/data-list/data-list.component';
import { DownloadMetadataComponent } from './components/reusable/download-metadata/download-metadata.component';
import { ProgressEventComponent } from './components/reusable/progress-event/progress-event.component';
import { DownloadFilesComponent } from './components/reusable/download-files/download-files.component';
import { DataSearchComponent } from './components/public/data-search/data-search.component';

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
    StationEditComponent,
    ChannelEditComponent,
    WrapTlGoogleChartComponent,
    UploadListComponent,
    FilesListComponent,
    DataListComponent,
    DownloadMetadataComponent,
    ProgressEventComponent,
    DownloadFilesComponent,
    NoCommaNumberPipe,
    DataSearchComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    ProgressbarModule.forRoot(),
    FileUploadModule,
    Ng2GoogleChartsModule
  ],
  providers: [
    AuthService,
    NotificationService,
    UserService,
    SettingsService,
    FdsnService,
    PreProductionService,
    DataService,
    PublicService,
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
