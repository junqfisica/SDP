import { Component, OnInit } from '@angular/core';

import { FileUploader } from 'ng2-file-upload';

import { ServerUrl } from '../../../statics/server-url';
import { ComponentUtils } from '../../component.utils';
import { NotificationService } from '../../../services/notification/notification.service';


@Component({
  selector: 'app-data-upload',
  templateUrl: './data-upload.component.html',
  styleUrls: ['./data-upload.component.css']
})
export class DataUploadComponent extends ComponentUtils implements OnInit {

  uploader: FileUploader;
  hasBaseDropZoneOver = false;

  constructor(private notificationService: NotificationService) { 
    super(notificationService);
  }

  ngOnInit() {

    this.uploader = new FileUploader({
      url: ServerUrl.rootUrl + '/api/seismicData/upload',
      headers: [
        { name: 'X-Access-Token', value: this.currentUser.token }
      ]
    });
    
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    };
    
    this.uploader.onCompleteItem = (item: any, responseJson: any, status: any, headers: any) => {
      
      const response = JSON.parse(responseJson);
      console.log(response);
      
      if (item && item.isError) {
        console.log(response);
        if (response && response.message) {
          item.errormessage = response.message;
        } else {
          item.errormessage = 'error';
        }
      }
    };

  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

}
