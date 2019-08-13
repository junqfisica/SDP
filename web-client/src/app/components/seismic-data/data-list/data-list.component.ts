import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/';

import { FdsnService } from '../../../services/fdsn/fdsn.service';
import { DataService } from '../../../services/data/data.service';
import { NotificationService } from '../../../services/notification/notification.service';

import { DateUtil } from '../../../statics/date-util';

import { Search } from '../../../model/model.search';
import { ComponentUtils } from '../../component.utils';
import { Channel } from '../../../model/model.channel';
import { Station } from '../../../model/model.station';
import { SeismicData } from '../../../model/model.seismic-data';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.css']
})
export class DataListComponent extends ComponentUtils implements OnInit {

  channelId: string;
  station: Station;
  channel: Channel;
  seismicData: SeismicData[] = [];
  deleteModalRef: BsModalRef | null;
  plotModalRef: BsModalRef | null;
  deleteData: SeismicData;
  plotSeismicData: SeismicData;
  page = 1;
  itemsPerPage = 10;
  totalItems = 0;
  dataSource: Observable<SeismicData>;
  searchValue: string;
  typeaheadLoading: boolean;
  isLoaddingPage = true;
  isChannelInfoCollapsed = true;
  plotUrl: SafeUrl;
  startDateFilter: Date;
  stopDateFilter: Date;
  startTimeFilter: Date;
  stopTimeFilter: Date;
  isFilterCollapsed = true;
  bsConfig = { dateInputFormat: 'DD.MM.YYYY', containerClass: 'theme-default' };

  constructor(private route: ActivatedRoute, private fdsnService: FdsnService, private notificationService: NotificationService, 
    private modalService: BsModalService, private dataService: DataService, private sanitizer: DomSanitizer) {
    super(notificationService)
    this.route.params.subscribe(
      params => {          
        if (params && params.channelId) {
          this.fdsnService.getChannel(params.channelId).subscribe(
            channel => {
              this.channel = channel;
              this.fetchStation(this.channel.station_id);
              // console.log(this.channel);
              this.isLoaddingPage = false;
              this.searchFiles();
            },
            error =>{
              console.log(error);
              this.notificationService.showErrorMessage(error.message);
              this.isLoaddingPage = false;
            }
          );
          this.channelId = params.channelId;
        }
      },
      error => {
        console.log(error);
      }
    );

    // Search for stations
    this.dataSource = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.searchValue);
    }).pipe(
      mergeMap((term: string) => this.dataService.searchData(this.buildQueryParams(term))
      .pipe(
        // Map search result observable to result list.
        map((data) => {
          return data.result;
        }))
      )
    );
  }

  ngOnInit() {}

  createDateTextQuery(startDate?: Date, stopDate?: Date) {
    
    let startHH = 0;
    let startMM = 0;
    let startSS = 0;
    let stopHH = 23;
    let stopMM = 59;
    let stopSS = 59.999;

    if (this.startTimeFilter) {
      startHH = this.startTimeFilter.getHours();
      startMM = this.startTimeFilter.getMinutes();
      startSS = this.startTimeFilter.getSeconds();
    }

    if (this.stopTimeFilter) {
      stopHH = this.stopTimeFilter.getHours();
      stopMM = this.stopTimeFilter.getMinutes();
      stopSS = this.stopTimeFilter.getSeconds() + 0.999;
      
    }  
    
    if (startDate && stopDate){
      stopDate.setHours(stopHH,stopMM,stopSS, 999);
      startDate.setHours(startHH,startMM,startSS);
      return "stop_time <= " + "'" + DateUtil.convertDateToUTCStringWithoutShift(stopDate, true) + "'" + " and start_time >= " + "'" + 
      DateUtil.convertDateToUTCStringWithoutShift(startDate, true) + "'";
    } else if (startDate) {
      startDate.setHours(startHH,startMM,startSS);
      return "start_time >= " + "'" + DateUtil.convertDateToUTCStringWithoutShift(startDate, true) + "'";
    } else if (stopDate) {
      stopDate.setHours(stopHH,stopMM,stopSS);
      return "stop_time <= " + "'" + DateUtil.convertDateToUTCStringWithoutShift(stopDate, true) + "'";
    } else {
      return null;
    }
  };

  fetchStation(stationId: string){
    this.fdsnService.getStation(stationId).subscribe(
      station => {
        this.station = station;
      },
      error =>{
        console.log(error);
        this.notificationService.showErrorMessage(error.message);
      }
    );
  }

  buildQueryParams(value="", orderBy="filename, start_time", searchBy = "channel_id, filename"): HttpParams {
    if (searchBy !== 'id') {
      value = this.channelId + "," + value;
    }
    
    const searchParms = new Search(searchBy, value).searchParms
    searchParms.orderBy = orderBy;
    searchParms.orderDesc = false;
    searchParms.use_AND_Operator = true;
    searchParms.mapColumnAndValue = true;
    searchParms.page = this.page;
    searchParms.perPage = this.itemsPerPage;
    searchParms.TextualQuery = this.createDateTextQuery(this.startDateFilter, this.stopDateFilter);        

    return new HttpParams({ fromObject: searchParms });
  }

  dateTimeToUTC(dateTime: string){
    return DateUtil.convertUTCStringToDate(dateTime);
  }

  pageChanged(event: PageChangedEvent) {
    this.page = event.page;
    this.searchFiles();
  }

  itemsPerPageChanged(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.page = 1;
    this.searchFiles();
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    this.searchFiles(e.item.id, "start_time", "id");
  }

  searchFiles(value="", orderBy="filename, start_time", searchBy = "channel_id, filename"){
    
    this.dataService.searchData(this.buildQueryParams(value, orderBy, searchBy)).subscribe(
      data => {        
        this.totalItems = data.total;
        this.seismicData = data.result;
        // console.log(this.seismicData);
      },
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.message)
      }      
    )
  }

  openDeleteModal(template: TemplateRef<any>, data: SeismicData) {
    this.deleteModalRef = this.modalService.show(template);
    this.deleteData = data;
  }

  closeDeleteModal() {
    this.deleteModalRef.hide();
    this.deleteModalRef = null;
  }

  openPlotModal(template: TemplateRef<any>, data: SeismicData) {
    this.plotModalRef = this.modalService.show(template, {class: 'modal-dialog bs-xl'});
    this.plotSeismicData = data;
    this.fetchImagePlotUrl(data);
  }

  closePlotModal() {
    this.plotModalRef.hide();
    this.plotModalRef = null;
    this.plotUrl = null;
  }

  private removeChannelFromList() {
    if (this.deleteData) {
      const index = this.seismicData.indexOf(this.deleteData);
      if (index > -1) {
        this.seismicData.splice(index, 1);
      }
    }
  }

  deleteDataFromModal() {
    
    this.dataService.deleteData(this.deleteData).subscribe(
      wasDeleted => {
        if (wasDeleted) {
          this.notificationService.showSuccessMessage("Seismic data " + this.deleteData.filename + " has been deleted.");
          this.removeChannelFromList();
        } else {
          this.notificationService.showWarningMessage("Fail to delete Seismic data " + this.deleteData.filename + ".");
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

  private fetchImagePlotUrl(sd: SeismicData) {
    if (sd != null) {
      this.plotUrl = null;
      this.dataService.plotData(sd).subscribe(
        imageData => {
          if (imageData) {
            const url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageData));
            this.plotUrl =  url;
          }
        },
        error => {
          this.notificationService.showErrorMessage('Please repeat the request later, as the server is busy.');
          console.log(error);
        }
      );
    }
  }

  downloadFile(data: SeismicData){
    this.dataService.downloadFile(data).subscribe(
      file => {
        if (file !== null) {
          const blob = new Blob([file], { type: file.type});
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = data.filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a); // remove the element
          window.URL.revokeObjectURL(url);
        } else {
          this.notificationService.showWarningMessage("The file " + data.filename + " is not avaible.")
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  clearFilter(): void {
    this.startTimeFilter = null;
    this.stopTimeFilter = null;
    this.startDateFilter = null;
    this.stopDateFilter = null;
  }
}
