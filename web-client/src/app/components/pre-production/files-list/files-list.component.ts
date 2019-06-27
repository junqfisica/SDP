import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

import { PreProductionService } from '../../../services/pre-production/pre-production.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { UploadFile } from '../../../model/model.upload-file';
import { FileUtil } from '../../../statics/file-util';


@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.css']
})
export class FilesListComponent implements OnInit {

  dirPath: string;
  uploadFiles: UploadFile[] = [];
  showFiles: UploadFile[] = [];
  deleteFile: UploadFile;
  isLoaddingPage = true;
  page = 1;
  itemsPerPage = 10;
  totalItems = 0;
  deleteModalRef: BsModalRef | null;

  constructor(private route: ActivatedRoute, private preProductionService: PreProductionService, private notificationService: NotificationService, 
    private modalService: BsModalService) {
    this.route.params.subscribe(
      params => {          
        if (params && params.folderPath) {
          this.dirPath = params.folderPath;
          this.fetchFiles();
        }
      },
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error);
      }
    );
  }

  ngOnInit() {
  }

  fetchFiles(){
    this.preProductionService.getFiles(this.dirPath).subscribe(
      files => {
        this.uploadFiles = files;
        this.totalItems = this.uploadFiles.length;
        console.log(this.totalItems);
        
        this.setShowFiles();
        this.isLoaddingPage = false;
      }, 
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.error.message);
        this.isLoaddingPage = false;
      }
    )
  }

  pageChanged(event: PageChangedEvent) {
    this.page = event.page;
    this.setShowFiles();
  }

  itemsPerPageChanged(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.setShowFiles();
  }

  setShowFiles() {
    setTimeout(() => {
      const startIndex = (this.page - 1)*this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.showFiles = this.uploadFiles.slice(startIndex, endIndex);
    }, 100);
  }

  openDeleteModal(template: TemplateRef<any>, file: UploadFile) {
    this.deleteModalRef = this.modalService.show(template);
    this.deleteFile = file;
  }

  closeDeleteModal() {
    this.deleteModalRef.hide();
    this.deleteModalRef = null;
  }

  private removeFileFromList() {
    if (this.deleteFile) {
      const index = this.uploadFiles.indexOf(this.deleteFile);
      if (index > -1) {
        this.uploadFiles.splice(index, 1);
        this.totalItems = this.uploadFiles.length;
        this.setShowFiles();
        this.deleteFile = null;
      }
    }
  }

  
  deleteDirFromModal() {
    if (this.deleteFile) {      
      this.preProductionService.deleteFile(this.deleteFile).subscribe(
        deleted => {
          if (deleted) {
            this.notificationService.showSuccessMessage("File was deleted.");
            this.removeFileFromList();
          } else {
            this.notificationService.showErrorMessage("Fail to delete folder.");
          }
        },
        error => {
          console.log(error);
          this.notificationService.showErrorMessage(error.message);
        }
      );
      
    }
    this.closeDeleteModal();
  }

}
