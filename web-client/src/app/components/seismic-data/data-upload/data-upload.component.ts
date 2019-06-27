import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { FileUploader, FileItem } from 'ng2-file-upload';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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

  @ViewChild('loaddingModalTemplate', {static: true}) private template : TemplateRef<BsModalRef>
  
  loadingModalRef: BsModalRef | null;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  serviceUrl = ServerUrl.rootUrl + '/api/preProduction/upload'
  private supportedFileExt: string[] = ['mseed'];

  constructor(private notificationService: NotificationService,  private modalService: BsModalService) { 
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

  openModal() {
    this.loadingModalRef = this.modalService.show(this.template, {backdrop: 'static'});
  }

  closeModal() {
    if(this.loadingModalRef) {
      // wait 1s to close, avoid error when modal open and close to fast.
      setTimeout(() => {
        if(this.loadingModalRef) {
          this.loadingModalRef.hide();
          this.loadingModalRef = null;
        }
      }, 1000) 
    }
  }

  readDir(directoryReader: any) {
    return new Promise((resolve, reject) => {
      directoryReader.readEntries(async(entries: any) => {
        if (entries.length) {
          await this.parseFiles(entries);
          resolve(entries);
        } else {
          resolve(null);
        }
      },
      (error: any) => {
        console.log(error);
        reject(error);
      });
    });
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
              this.closeModal();
            }
        );
    });
  }

  async parseFiles(entries: any) {
    for (let entry of entries) {
      if(entry.isFile){
        const file = <File>await this.getFile(entry);
        this.uploader.addToQueue(new Array<File>(file));
      } else if (entry.isDirectory){
        await this.parseDirectoryEntry(entry.createReader(), entry, true);
      }
    }
  }


  async parseDirectoryEntry(directoryReader: any, directoryEntry: any, isSubFolder=false) {
    const result = await this.readDir(directoryReader);
    if(!result) {      
      this.removeFileFromQueue(directoryEntry);
      if (!isSubFolder){
        console.log("Done");
        this.closeModal();  
      }
    } else {
      this.parseDirectoryEntry(directoryReader, directoryEntry, isSubFolder);
    }
  }


  drop(event: any) {
    if (this.uploader.options.isHTML5) {
      const items = event.dataTransfer.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry();
          if (entry.isDirectory) {
            this.openModal();
            const directoryReader = entry.createReader();
            this.parseDirectoryEntry(directoryReader, entry);
          }
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
    /** 
    if (!this.hasValidaExtention(file)) {
      this.removeFileFromQueue(file);
      this.notificationService.showWarningMessage(file.name + " has not a valid extension or is a directory.");
      return
    };*/

    if (this.isFileDuplicateInQueue(fileItem)) {
      this.removeFileFromQueue(file);
      this.notificationService.showWarningMessage("The file " + file.name + " is already in the queue.");

    }
  }

}
