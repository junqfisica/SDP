import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/';

import { GoogleChartComponent, ChartSelectEvent } from 'ng2-google-charts';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';

import { Station } from '../../../../model/model.station';
import { FdsnService } from '../../../../services/fdsn/fdsn.service';
import { NotificationService } from '../../../../services/notification/notification.service';
import { Search } from '../../../../model/model.search';
import { ComponentUtils } from '../../../../components/component.utils';


@Component({
selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.css']
})
export class StationListComponent extends ComponentUtils implements OnInit {
  
  private _chart: GoogleChartComponent;
  @ViewChild('chart') set content(content: GoogleChartComponent) {
    // Called everytime the isDataLoaded change status.
    this._chart = content;
    this.reDrawGoogleChart(content);
  }
  
  isDataLoaded = false;
  deleteModalRef: BsModalRef | null;
  deleteStation: Station;
  stations: Station[] = []
  page = 1;
  itemsPerPage = 10;
  totalItems = 0;
  dataSource: Observable<Station>;
  searchValue: string;
  typeaheadLoading: boolean;
  timelineChartData: GoogleChartInterface =  {
    chartType: 'Timeline',
    options: {
      timeline: { 
        showRowLabels: true,
        showBarLabels: true
          
      },
      avoidOverlappingGridLines: false
    },
    dataTable: [
      ['Name','Label', 'From', 'To']
    ]
  };

  constructor(private fdsnService: FdsnService, private notificationService: NotificationService, private modalService: BsModalService, 
    private router: Router) {
    super(notificationService)
    this.searchStations();
    // Search for stations
    this.dataSource = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.searchValue);
    }).pipe(
      mergeMap((term: string) => this.fdsnService.searchStations(this.buildQueryParams("network_id, name", term.toUpperCase()))
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

  buildQueryParams(searchBy="name", value="", orderBy=""): HttpParams {
    const searchParms = new Search(searchBy, value).searchParms;
    searchParms.orderBy = orderBy;
    searchParms.orderDesc = false;
    searchParms.page = this.page;
    searchParms.perPage = this.itemsPerPage;

    return new HttpParams({ fromObject: searchParms });
  }

  openDeleteModal(template: TemplateRef<any>, station: Station) {
    this.deleteModalRef = this.modalService.show(template);
    this.deleteStation = station;
  }

  closeDeleteModal() {
    this.deleteModalRef.hide();
    this.deleteModalRef = null;
  }

  private removeStationFromList() {
    if (this.deleteStation) {
      const index = this.stations.indexOf(this.deleteStation);
      if (index > -1) {
        this.stations.splice(index, 1);
      }
    }
  }

  deleteStationFromModal() {
    
    this.fdsnService.deleteStation(this.deleteStation).subscribe(
      wasDeleted => {
        if (wasDeleted) {
          this.notificationService.showSuccessMessage("Station " + this.deleteStation.name + " has been deleted.");
          this.removeStationFromList();
        } else {
          this.notificationService.showWarningMessage("Fail to delete station " + this.deleteStation.name + ".");
        }
        this.deleteStation = null;
        this.closeDeleteModal();
      },
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.error.message);
        this.closeDeleteModal();
      }
    )
  }

  pageChanged(event: PageChangedEvent) {
    this.page = event.page;
    this.searchStations();
  }

  itemsPerPageChanged(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.page = 1;
    this.searchStations();
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    this.searchStations("id", e.item.id, "name");
  }

  private loadTimeLineData() {
    
    this.isDataLoaded = false;
    this.timelineChartData.dataTable = [];
    this.timelineChartData.dataTable.push(['Name','Label', 'From', 'To']);
    for (const st of this.stations) {
      this.timelineChartData.dataTable.push(
        [st.network_id + "-" + st.name, st.name, new Date(st.creation_date),  new Date(st.removal_date)]
      );
    };
    // Only re-draw if there is data.
    if (this.timelineChartData.dataTable.length > 1){
      this.isDataLoaded = true;
    }
  }

  private reDrawGoogleChart(googleChart: GoogleChartComponent){
    if (googleChart) {
      if (googleChart.wrapper) {
        googleChart.draw();
      };
    };
  }

  onSelectChart(event: ChartSelectEvent){
    const row = event.row;
    const st = this.stations[row];
    this.router.navigate(['/fdsn/channel/' + st.id]);
  }

  searchStations(searchBy="id", value="", orderBy="name"){
    // Forces to order by name when there is no input value.
    if (value.length === 0){
      orderBy = "name";
    }
    this.fdsnService.searchStations(this.buildQueryParams(searchBy, value, orderBy)).subscribe(
      data => {        
        this.totalItems = data.total;
        this.stations = data.result;
        this.loadTimeLineData();              
      },
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.message)
      }      
    )
  }
}
