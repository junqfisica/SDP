import { Component, OnInit, TemplateRef } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

import { PreProductionService } from '../../../services/pre-production/pre-production.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { UploadDirStructure } from '../../../model/model.upload-dir-structure';
import { FileUtil } from '../../../statics/file-util';

@Component({
  selector: 'app-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.css']
})
export class UploadListComponent implements OnInit {

  isLoaddingPage = true;
  page = 1;
  itemsPerPage = 10;
  totalItems = 0;
  deleteModalRef: BsModalRef | null;
  dirs:UploadDirStructure[] = [];
  showDirs:UploadDirStructure[];
  deleteDir: UploadDirStructure;

  constructor(private preProductionService: PreProductionService, private notificationService: NotificationService, 
    private modalService: BsModalService) { 
      preProductionService.scanUploadDir().subscribe(
        dirStructure => {
          this.dirs = dirStructure;
          this.totalItems = this.dirs.length;
          this.setShowDirs();
          this.isLoaddingPage = false;
        },
        error => {
          console.log(error);
          notificationService.showErrorMessage(error.message)
          this.isLoaddingPage = false;
        }
      );
  }

  ngOnInit() {}

  pageChanged(event: PageChangedEvent) {
    this.page = event.page;
    this.setShowDirs();
  }

  itemsPerPageChanged(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.setShowDirs();
  }

  setShowDirs() {
    setTimeout(() => {
      const startIndex = (this.page - 1)*this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.showDirs = this.dirs.slice(startIndex, endIndex);
    }, 100);
  }

  openDeleteModal(template: TemplateRef<any>, dir: UploadDirStructure) {
    this.deleteModalRef = this.modalService.show(template);
    this.deleteDir = dir;
  }

  closeDeleteModal() {
    this.deleteModalRef.hide();
    this.deleteModalRef = null;
  }

  private removeDirFromList() {
    if (this.deleteDir) {
      const index = this.dirs.indexOf(this.deleteDir);
      if (index > -1) {
        this.dirs.splice(index, 1);
        this.totalItems = this.dirs.length;
        this.setShowDirs();
        this.deleteDir = null;
      }
    }
  }

  formatPath(path: string) {
    return FileUtil.formatPath(path);
  }

  
  deleteDirFromModal() {
    if (this.deleteDir) {
      const path = FileUtil.formatPath(this.deleteDir.path);
      this.preProductionService.delete(path).subscribe(
        deleted => {
          if (deleted) {
            this.notificationService.showSuccessMessage("Folder was deleted.");
            this.removeDirFromList();
          } else {
            this.notificationService.showErrorMessage("Fail to delete folder.");
          }
        },
        error => {
          console.log(error);
          this.notificationService.showErrorMessage(error.error.message);
        }
      );
    }
    this.closeDeleteModal();
  }
  
}
  