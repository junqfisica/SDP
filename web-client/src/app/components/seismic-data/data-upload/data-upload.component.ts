import { Component, OnInit } from '@angular/core';

import { FileUploader, FileItem } from 'ng2-file-upload';

import { ServerUrl } from '../../../statics/server-url';
import { ComponentUtils } from '../../component.utils';
import { NotificationService } from '../../../services/notification/notification.service';
import { FileUtil } from '../../../statics/file-util';


@Component({
  selector: 'app-data-upload',
  templateUrl: './data-upload.component.html',
  styleUrls: ['./data-upload.component.css']
})
export class DataUploadComponent extends ComponentUtils implements OnInit {

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  serviceUrl = ServerUrl.rootUrl + '/api/preProduction/upload'
  private supportedFileExt: string[] = ['mseed'];

  constructor(private notificationService: NotificationService) { 
    super(notificationService);
  }

  ngOnInit() {

    this.uploader = new FileUploader({
      url: this.serviceUrl,
      headers: [
        { name: 'X-Access-Token', value: this.currentUser.token }
      ]
    });
    
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    };

    this.uploader.onAfterAddingFile = (fileItem) => {
      this.fileAdd(fileItem)     
    }
    
    this.uploader.onCompleteItem = (item: any, responseJson: any, status: any, headers: any) => {
      
      let response = null 
      
      if (responseJson){
        response = JSON.parse(responseJson);
        // console.log(response);
      }

      if (item && item.isError) {
        console.log(response);
        if (response && response.message) {
          item.errormessage = response.message;
        } else {
          item.errormessage = 'error status:' + status;
        }
      }
      
    };

  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  private getFileItemFromQueue(file: File): FileItem {
    
    for (const fileItem of this.uploader.queue) {
      if (fileItem.file.name == file.name) {
        return fileItem;
      }
    }
    return null
  }

  private removeFileFromQueue(file: File) {
    const removeFile = this.getFileItemFromQueue(file);
    if (removeFile) {
      this.uploader.removeFromQueue(removeFile);
    }
  }

  private hasValidaExtention(file: File): boolean{
    const extension = FileUtil.getFileExtension(file.name);
    return this.supportedFileExt.includes(extension);
  }

  private isFileDuplicateInQueue(fileItem: FileItem): boolean {
    let numberOfEqualFiles = 0
    this.uploader.queue.forEach(item => {
      if (fileItem.file.name == fileItem.file.name) {
        numberOfEqualFiles++;
        if (numberOfEqualFiles > 1){
          return
        }
      }
    });
    return numberOfEqualFiles > 1 ? true : false
  }

  public fileAdd(fileItem: FileItem) {
    const file = fileItem._file;
    if (!this.hasValidaExtention(file)) {
      this.removeFileFromQueue(file);
      this.notificationService.showWarningMessage(file.name + " has not a valid extension or is a directory.");
      return
    };

    if (this.isFileDuplicateInQueue(fileItem)) {
      this.removeFileFromQueue(file);
      this.notificationService.showWarningMessage("The file " + file.name + " is already in the queue.");

    }
  }

}
