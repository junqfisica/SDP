import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { FileUploader, FileItem } from 'ng2-file-upload';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'

import { ComponentUtils } from '../../component.utils';
import { NotificationService } from '../../../services/notification/notification.service';
import { ServerUrl } from '../../../statics/server-url';
import { FileUtil } from '../../../statics/file-util';
import { FdsnService } from '../../../services/fdsn/fdsn.service';
import { StationInfoFile } from './../../../model/model.station-info-files';

@Component({
  selector: 'app-station-attached',
  templateUrl: './station-attached.component.html',
  styleUrls: ['./station-attached.component.css']
})
export class StationAttachedComponent extends ComponentUtils implements OnInit {

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  serviceUrl = ""
  supportedFileExt: string[] = ['pdf'];
  infoFiles: StationInfoFile[] = [];
  deleteModalRef: BsModalRef | null;
  deleteData: StationInfoFile;

  constructor(private fdsnService: FdsnService, private sanitizer: DomSanitizer, private route: ActivatedRoute, 
    private notificationService: NotificationService, private modalService: BsModalService,) { 
    super(notificationService);
    this.route.params.subscribe(
      params => {          
        if (params && params.stationId) {
          this.serviceUrl = ServerUrl.rootUrl + '/api/fdsn/attacheFile/' + params.stationId;
          this.startUploader();
          this.featchAttachedFiles(params.stationId);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnInit() { 
  }

  featchAttachedFiles(stationId: String){
    this.fdsnService.getStationInfoFiles(stationId).subscribe(
      result => {
       this.infoFiles = result;       
      },
      error => {
        console.log(error);
      }
      
    );
  }

  startUploader() {
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
      this.fileAdd(fileItem);
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
  
  getFile(fileEntry: any) {
    return new Promise((resolve, reject) => {
        fileEntry.file(
            (file: File) => {
              resolve(file);
            },
            (error: any) => {
              console.log(error);
              reject(error);
            }
        );
    });
  }

  async parseFiles(entries: any) {
    for (let entry of entries) {
      const file = <File>await this.getFile(entry);
      this.uploader.addToQueue(new Array<File>(file));
    }
  }


  drop(event: any) {
    if (this.uploader.options.isHTML5) {
      const items = event.dataTransfer.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry();
        }
      }
    }
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
      if (item.file.name == fileItem.file.name) {
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

  downloadFile(infoFile: StationInfoFile) {
    this.fdsnService.getAttachedFile(infoFile.id).subscribe(
      (file) => {
        if (file !== null) {
          const blob = new Blob([file], { type: file.type});
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = infoFile.filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a); // remove the element
          window.URL.revokeObjectURL(url);
        } else {
          this.notificationService.showWarningMessage("The file " + infoFile.filename + " is not avaible.")
        }
      },
      error => {
        this.notificationService.showErrorMessage(error.message);
        console.log(error);
      }
    );
  }

  openDeleteModal(template: TemplateRef<any>, data: StationInfoFile) {
    this.deleteModalRef = this.modalService.show(template);
    this.deleteData = data;
  }

  closeDeleteModal() {
    this.deleteModalRef.hide();
    this.deleteModalRef = null;
  }

  private removeChannelFromList() {
    if (this.deleteData) {
      const index = this.infoFiles.indexOf(this.deleteData);
      if (index > -1) {
        this.infoFiles.splice(index, 1);
      }
    }
  }

  deleteDataFromModal() {
    
    this.fdsnService.deleteAttachedFile(this.deleteData).subscribe(
      wasDeleted => {
        if (wasDeleted) {
          this.notificationService.showSuccessMessage("File " + this.deleteData.filename + " has been deleted.");
          this.removeChannelFromList();
        } else {
          this.notificationService.showWarningMessage("Fail to delete file " + this.deleteData.filename + ".");
        }
        this.deleteData = null;
        this.closeDeleteModal();
      },
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.error.message);
        this.closeDeleteModal();
      }
    )
  }

}
