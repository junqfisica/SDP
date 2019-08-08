import { Component, OnInit, TemplateRef, Input } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'

import { DataService } from '../../../services/data/data.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { Channel } from '../../../model/model.channel';
import { SeismicData } from '../../../model/model.seismic-data';

@Component({
  selector: 'app-download-files',
  templateUrl: './download-files.component.html',
  styleUrls: ['./download-files.component.css']
})
export class DownloadFilesComponent implements OnInit {

  loadingModalRef: BsModalRef | null;
  _data: Channel | SeismicData[];
  _filename: string;
  _showIcon: boolean = true;
  isDisable = false;

  @Input() set showIcon (value: boolean) {   
    this._showIcon = value;
  }

  @Input() set filename (value: string) {
    this._filename = value;
  }

  @Input() set data (value: Channel | SeismicData[]) {
    this._data = value;
    if (this._data instanceof Channel) {
      this.isDisable = this._data.number_of_files === 0;
    } else if (this._data instanceof Array) {
      this.isDisable = this._data.length === 0;
      this._data.forEach(sd => {
        if (!(sd instanceof SeismicData)) {
          console.error("Data must be an instace of Channel or SeismicData[]");
        }
      });
    } else {
      console.error("Data must be an instace of Channel or SeismicData[]");
    }
  }

  constructor(private dataService: DataService, private notificationService: NotificationService, 
    private modalService: BsModalService) {       
  }

  ngOnInit() {
  }

  openLoadingModal(template: TemplateRef<any>) {
    this.loadingModalRef = this.modalService.show(template, {backdrop: 'static', class: 'modal-dialog modal-lg'});
  }

  closeLoadingModal() {
    setTimeout(() => {
      if (this.loadingModalRef){
        this.loadingModalRef.hide();
        this.loadingModalRef = null;
      }
    }, 500)
  }

  openFile(file: Blob) {
    if (file !== null) {
      const blob = new Blob([file], { type: file.type});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = this._filename + ".tar";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); // remove the element
      window.URL.revokeObjectURL(url);
    } else {
      this.notificationService.showWarningMessage("Fail to download files, try it later.")
    }
    this.closeLoadingModal();
  }

  downloadFiles(template: TemplateRef<any>){
    this.openLoadingModal(template);
  
    if (this._data instanceof Channel) {
      this.dataService.downloadFiles(this._data).subscribe(
        file => {
          this.openFile(file);
        },
        error => {
          console.log(error);
          this.closeLoadingModal();
        }
      );
    } else if (this._data instanceof Array){
      this.dataService.downloadFileList(this._data).subscribe(
        file => {
          this.openFile(file);
        },
        error => {
          console.log(error);
          this.closeLoadingModal();
        }
      );
    }
  }

}
