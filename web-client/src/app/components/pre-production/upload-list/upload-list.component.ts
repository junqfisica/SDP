import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

import { PreProductionService } from '../../../services/pre-production/pre-production.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { UploadDirStructure } from '../../../model/model.upload-dir-structure';
import { FileUtil } from '../../../statics/file-util';
import { Network } from '../../../model/model.network';
import { FdsnService } from '../../../services/fdsn/fdsn.service';
import { Station } from '../../../model/model.station';
import { Search } from '../../../model/model.search';
import { Channel } from '../../../model/model.channel';
import { DateUtil } from '../../../statics/date-util';
import { FileTransferResult } from '../../../model/model.file-transfer-result';
import { ProgressEventComponent } from '../../reusable/progress-event/progress-event.component';
import { AppUtil } from 'src/app/statics/app-util';

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
  transferStatusModalTemplateRef: BsModalRef | null;
  transferModalTemplateRef: BsModalRef | null;
  dirs:UploadDirStructure[] = [];
  showDirs:UploadDirStructure[];
  deleteDir: UploadDirStructure;
  selectedDir: UploadDirStructure;
  progressEvent: ProgressEventComponent;
  transferStatusFilter: string = "";

  networks: Network[];
  transferForm: FormGroup;
  stationsDataSource: Observable<Station>;
  channelDataSource: Observable<Channel>;
  stationLoading: boolean;
  channelLoading: boolean;

  constructor(private preProductionService: PreProductionService, private notificationService: NotificationService, 
    private modalService: BsModalService, private fdsnService: FdsnService, private formBuilder: FormBuilder) { 
      preProductionService.scanUploadDir().subscribe(
        dirStructure => {          
          this.dirs = dirStructure;
          this.totalItems = this.dirs.length;
          this.setShowDirs();
          this.getNetworks();
          this.buildForm();
          this.isLoaddingPage = false;
        },
        error => {
          console.log(error);
          notificationService.showErrorMessage(error.message)
          this.isLoaddingPage = false;
        }
      );

    // Search for stations
    this.stationsDataSource = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.transferControl.searchStation.value);
    }).pipe(
      mergeMap((term: string) => {      
      term = term !== undefined ? term.toUpperCase() : term
      return this.fdsnService.searchStations(this.buildQueryParams("network_id, name", term,"name, creation_date")).pipe(
        // Map search result observable to result list.
        map((data) => {
          return data.result;
        }))
      })
    );

    // Search for channel
    this.channelDataSource = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.transferControl.searchChannel.value);
    }).pipe(
      mergeMap((term: string) => this.fdsnService.searchChannels(
        this.buildQueryParams( "station_id, name", this.transferControl.station.value.id + "," +term.toUpperCase(),"name, start_time", true))
      .pipe(
        // Map search result observable to result list.
        map((data) => {
          return data.result;
        }))
      )
    );
  }

  ngOnInit() {}

  buildForm(){

    this.transferForm = this.formBuilder.group({
      searchStation: ['', {}],
      searchChannel: ['', {}],
      station: ['', {validators: [Validators.required], updateOn: 'change'}],
      channel: ['', {validators: [Validators.required], updateOn: 'change'}],
    });

  }

  buildQueryParams(searchBy="name", value="", orderBy="", isAnd=false): HttpParams {    
    const searchParms = new Search(searchBy, value).searchParms;
    searchParms.orderBy = orderBy;
    searchParms.orderDesc = false;
    searchParms.use_AND_Operator = isAnd;
    searchParms.mapColumnAndValue = isAnd;
    searchParms.page = 1;
    searchParms.perPage = 1000;

    return new HttpParams({ fromObject: searchParms });
  }

  get transferControl() { return this.transferForm.controls };

  changeStationLoading(e: boolean): void {
    this.stationLoading = e;
  }

  onSelectStation(e: TypeaheadMatch): void {
    this.transferControl.station.setValue(e.item);
    this.transferControl.searchChannel.setValue('');
    this.transferControl.channel.setValue(null);

  }

  changeChannelLoading(e: boolean): void {
    this.channelLoading = e;
  }

  onSelectChannel(e: TypeaheadMatch): void {
    this.transferControl.channel.setValue(e.item);
  }

  getNetworks() {
    this.fdsnService.getNetworks().subscribe(
      data => {
        this.networks = data;
      },
      error => {
        console.log(error);
        this.notificationService.showErrorMessage("Error when trying to get networks");
      }
    );
  }

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

  openTransferStatusModal(template: TemplateRef<any>, dir: UploadDirStructure) {
    this.selectedDir = dir;
    this.transferStatusModalTemplateRef = this.modalService.show(template, {class: 'modal-dialog modal-lg'});
  }

  openTransferModal(template: TemplateRef<any>, dir: UploadDirStructure, progressEvent: ProgressEventComponent) {
    this.selectedDir = dir;
    this.progressEvent = progressEvent;
    this.transferModalTemplateRef = this.modalService.show(template, {class: 'modal-dialog modal-lg'});
  }

  closeTransferModal() {
    this.transferModalTemplateRef.hide();
    this.transferModalTemplateRef = null;
    this.selectedDir = null;
    this.progressEvent = null;
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

  dateTimeToUTC(dateTime: string){
    return DateUtil.convertUTCStringToDate(dateTime);
  }

  transferStatusOverview(transferResults: FileTransferResult[]) {
    for (const result of transferResults){
      if (result.error){
        return "Error";
      } else if (result.status !== "Ok"){
        return "Warning"
      }
    };
    return "Ok";
  }

  transferData(dir: UploadDirStructure, progressEvent: ProgressEventComponent){
    // const path = FileUtil.formatPath(dir.path);
    dir.isTransfering = true;
    dir.progressId = AppUtil.generateId();
    dir.status = undefined; // set transferResults to undefined. Avoid pass this structure to the server.
    this.preProductionService.transferFolderData(dir).subscribe(
      results => {
        dir.transferResults = results.transferResults;
        dir.status = this.transferStatusOverview(dir.transferResults);
        dir.isTransfering = false;
        progressEvent.setProgress(100);
      }, 
      error=>{
        console.log(error);
        this.notificationService.showErrorMessage(error.error.message);
        dir.isTransfering = false;
      }
    );
    // Listen to progress.
    progressEvent.startListenProgress(dir.progressId);
  }

  onSubmitTransfer(){
    if (this.transferForm.invalid || !this.selectedDir) {
      return;
    }
    const channelId = this.transferControl.channel.value.id;
    this.selectedDir.channel_id = channelId;
    this.transferData(this.selectedDir, this.progressEvent);
    this.closeTransferModal();
    
  }
  
}
  