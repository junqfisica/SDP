import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/';

import { NotificationService } from '../../../services/notification/notification.service';

import { DateUtil } from '../../../statics/date-util';

import { SeismicData } from '../../../model/model.seismic-data';
import { PublicService } from '../../../services/public/public.service';
import { SeismicDataSearch } from '../../../model/model.seismic-data-search';

@Component({
  selector: 'app-data-search',
  templateUrl: './data-search.component.html',
  styleUrls: ['./data-search.component.css']
})
export class DataSearchComponent implements OnInit {

  seismicData: SeismicData[] = [];
  page = 1;
  itemsPerPage = 10;
  totalItems = 0;
  dataSource: Observable<SeismicData>;
  typeaheadLoading: boolean;
  startDateFilter: Date;
  stopDateFilter: Date;
  startTimeFilter: Date;
  stopTimeFilter: Date;
  searchFilters = new SeismicDataSearch().searchParms;
  isFilterCollapsed = true;
  bsConfig = { dateInputFormat: 'DD.MM.YYYY', containerClass: 'theme-default' };

  constructor(private publicService: PublicService, private notificationService: NotificationService) {
    
    // Search for data
    this.dataSource = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.searchFilters.filename);
    }).pipe(
      mergeMap(() => this.publicService.searchData(this.buildQueryParams())
      .pipe(
        // Map search result observable to result list.
        map((data) => {
          return data.result;
        }))
      )
    );
  }

  ngOnInit() {
  }

  buildQueryParams(): HttpParams {
    
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
    
    const searchParms = this.searchFilters;
    if (this.startDateFilter) {
      this.startDateFilter.setHours(startHH,startMM,startSS);
      searchParms.startTime = DateUtil.convertDateToUTCStringWithoutShift(this.startDateFilter, true)
    }

    if (this.stopDateFilter) {
      this.stopDateFilter.setHours(stopHH,stopMM,stopSS, 999);
      searchParms.stopTime = DateUtil.convertDateToUTCStringWithoutShift(this.stopDateFilter, true)
    }
    searchParms.page = this.page;
    searchParms.perPage = this.itemsPerPage;

    return new HttpParams({ fromObject: searchParms });
  }

  dateTimeToUTC(dateTime: string){
    return DateUtil.convertUTCStringToDate(dateTime);
  }

  pageChanged(event: PageChangedEvent) {
    this.page = event.page;
    this.searchData();
  }

  itemsPerPageChanged(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.page = 1;
    this.searchData();
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    this.searchData();
  }

  filterCollapsed(){
    this.clearFilter();
  }

  filterExpanded(){
    this.searchFilters.filename = '';
  }

  searchData() {
    const httpParams = this.buildQueryParams();
    
    this.publicService.searchData(httpParams).subscribe(
      result => {
        this.seismicData = result.result;
        this.totalItems = result.total;
      },
      error => {
        console.log(error);
        
      }
    );
  }

  downloadFile(data: SeismicData){
    this.publicService.downloadFile(data).subscribe(
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
          this.notificationService.showWarningMessage("The file " + data.filename + " is not avaible or has restriction.")
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
    this.searchFilters = new SeismicDataSearch().searchParms;
  }

}
