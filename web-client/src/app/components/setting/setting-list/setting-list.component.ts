import { Component, OnInit } from '@angular/core';

import { ComponentUtils } from '../../component.utils';
import { NotificationService } from '../../../services/notification/notification.service';
import { SettingsService } from '../../../services/setting/application-param.service';
import { AppParams } from '../../../model/model.app-param';
import { TargetFolder } from '../../../model/model.target-folder';

@Component({
  selector: 'app-setting-list',
  templateUrl: './setting-list.component.html',
  styleUrls: ['./setting-list.component.css']
})
export class SettingListComponent extends ComponentUtils implements OnInit {

  applicationParams: AppParams[];
  targetFolders: TargetFolder[] = [];
  isUploadFolderOnline = false;
  loadingStatus = true;

  constructor(private notificationService: NotificationService, private settingsService: SettingsService) { 
    super(notificationService);
  }

  ngOnInit() {
    this.settingsService.getAllParams().subscribe(
      params => {
        this.applicationParams = params;
      },
      error => {
        console.log(error);
      }
    );
    this.settingsService.isUploadFolderOnline().subscribe(
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
    this.settingsService.getTargetFolders().subscribe(
      targetFolders => {
        this.targetFolders = targetFolders;
      },
      error => {
        console.log(error);
      }
    );
  }

  saveTargetFolder(targetFolder: TargetFolder) {
    if (targetFolder.editPath){
      targetFolder.path = targetFolder.editPath;
    }

    this.settingsService.saveTargetFolder(targetFolder).subscribe(
      returnTargetFolder => {
        targetFolder.id = returnTargetFolder.id;
        targetFolder.online = returnTargetFolder.online;
        this.notificationService.showSuccessMessage("Saved");
      }, 
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.message)
      }
    );
    
  }

  changePathValue(targetFolder: TargetFolder, event: any) {
    targetFolder.editPath = event.target.textContent.trim();
  }

  changeActive(targetFolder: TargetFolder) {
    this.targetFolders.forEach(tf => {
      tf.active = false;
    })
    targetFolder.active = true;
  }

  addTargetFolder() {
    const newTargetFolder = new TargetFolder();
    newTargetFolder.id = null;
    newTargetFolder.online = false;
    newTargetFolder.active = false;
    this.targetFolders.push(newTargetFolder);
  }

  removeFolderFromList(targetFolder: TargetFolder) {
    const index = this.targetFolders.indexOf(targetFolder);
    if (index) {
      this.targetFolders.splice(index, 1);
    }
  }

  removeTargetFolder(targetFolder: TargetFolder) {

    if (targetFolder.id) {
      console.log("Remove from database.");
      this.settingsService.deleteTargetFolder(targetFolder).subscribe(
        wasDeleted => {
          if (wasDeleted) {
            this.removeFolderFromList(targetFolder);
          } else {
            this.notificationService.showWarningMessage("This folder can't be removed.")
          }
        }, 
        error => {
          console.log(error);
          this.notificationService.showWarningMessage("This folder can't be removed.")
        }
      );
    } else {
      this.removeFolderFromList(targetFolder);
    } 
  }
}
