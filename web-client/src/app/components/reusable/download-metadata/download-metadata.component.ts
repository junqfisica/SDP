import { Component, OnInit, TemplateRef, Input } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'

import { FdsnService } from '../../../services/fdsn/fdsn.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { Channel } from '../../../model/model.channel';

@Component({
  selector: 'app-download-metadata',
  templateUrl: './download-metadata.component.html',
  styleUrls: ['./download-metadata.component.css']
})
export class DownloadMetadataComponent implements OnInit {

  loadingModalRef: BsModalRef | null;
  _channel: Channel;
  _filename: string;
  _showIcon: boolean = true;

  @Input() set showIcon (value: boolean) {   
    this._showIcon = value;
  }

  @Input() set filename (value: string) {
    this._filename = value;
  }

  @Input() set channel (value: Channel) {
    this._channel = value;
  }

  constructor(private fdsnService: FdsnService, private notificationService: NotificationService, 
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

  getMetadata(template: TemplateRef<any>){
    this.openLoadingModal(template);
  
    this.fdsnService.getMetadata(this._channel).subscribe(
      file => {
        if (file !== null) {
          const blob = new Blob([file], { type: file.type});
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = this._filename + ".xml";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a); // remove the element
          window.URL.revokeObjectURL(url);
        } else {
          this.notificationService.showWarningMessage("Fail to get metadata, try it later.")
        }
        this.closeLoadingModal();
      },
      error => {
        console.log(error);
      },
      () => {
        // this.closeLoadingModal();
      }
    );
  }

}
