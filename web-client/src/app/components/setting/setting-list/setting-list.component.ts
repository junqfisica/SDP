import { Component, OnInit } from '@angular/core';
import { ComponentUtils } from '../../component.utils';
import { NotificationService } from '../../../services/notification/notification.service';
import { ApplicationParamService } from '../../../services/setting/application-param.service';
import { AppParams } from '../../../model/model.app-param';

@Component({
  selector: 'app-setting-list',
  templateUrl: './setting-list.component.html',
  styleUrls: ['./setting-list.component.css']
})
export class SettingListComponent extends ComponentUtils implements OnInit {

  applicationParams: AppParams[];
  isUploadFolderOnline = false;
  loadingStatus = true;

  constructor(private notificationService: NotificationService, private applicationParamService: ApplicationParamService) { 
    super(notificationService)
  }

  ngOnInit() {
    this.applicationParamService.getAllParams().subscribe(
      params => {
        this.applicationParams = params;
      },
      error => {
        console.log(error);
      }
    );
    this.applicationParamService.isUploadFolderOnline().subscribe(
      isUploadFolderOnline => {
        this.isUploadFolderOnline = isUploadFolderOnline;
        this.loadingStatus = false;
      },
      error => {
        console.log(error)
        this.notificationService.showErrorMessage(error.error.message)
        this.loadingStatus = false;
      }
    );
  }

}
