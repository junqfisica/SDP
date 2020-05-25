import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/';

import { ComponentUtils } from '../../component.utils';
import { LocationModel } from '../../../model/model.location-model';
import { FdsnService } from '../../../services/fdsn/fdsn.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { Search } from '../../../model/model.search';
import { Station } from '../../../model/model.station';


@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.css']
})
export class LocationListComponent extends ComponentUtils implements OnInit {

  station: Station;
  stationId: String;
  deleteModalRef: BsModalRef | null;
  deleteLocation: LocationModel;
  locations: LocationModel[] = [];
  page = 1;
  itemsPerPage = 10;
  totalItems = 0;
  dataSource: Observable<LocationModel>;
  searchValue: string;
  typeaheadLoading: boolean;
  isLoaddingPage = true;

  constructor(private fdsnService: FdsnService, private notificationService: NotificationService, private modalService: BsModalService, 
    private router: Router, private route: ActivatedRoute) { 
    super(notificationService)
    
    this.route.params.subscribe(
      params => {          
        if (params && params.stationId) {
          this.fdsnService.getStation(params.stationId).subscribe(
            station => {
              this.station = station;
              this.isLoaddingPage = false;
              this.searchLocation();
            },
            error =>{
              console.log(error);
              this.notificationService.showErrorMessage(error.message);
              this.isLoaddingPage = false;
            }
          );
          this.stationId = params.stationId;
        }
      },
      error => {
        console.log(error);
      }
    );
    // Search for locations
    this.dataSource = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.searchValue);
    }).pipe(
      mergeMap((term: string) => this.fdsnService.searchLocations(this.buildQueryParams(term.toUpperCase()))
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


  buildQueryParams(value="", orderBy="name", searchBy = "station_id, name"): HttpParams {

    if (searchBy !== 'id') {
      value = this.stationId + "," + value;
    }
    const searchParms = new Search(searchBy, value).searchParms
    searchParms.orderBy = orderBy;
    searchParms.orderDesc = false;
    searchParms.use_AND_Operator = true;
    searchParms.mapColumnAndValue = true;
    searchParms.page = this.page;
    searchParms.perPage = this.itemsPerPage;
    
    return new HttpParams({ fromObject: searchParms });
  }

  openDeleteModal(template: TemplateRef<any>, location: LocationModel) {
    this.deleteModalRef = this.modalService.show(template);
    this.deleteLocation = location;
  }

  closeDeleteModal() {
    this.deleteModalRef.hide();
    this.deleteModalRef = null;
  }

  private removeStationFromList() {
    if (this.deleteLocation) {
      const index = this.locations.indexOf(this.deleteLocation);
      if (index > -1) {
        this.locations.splice(index, 1);
      }
    }
  }

  deleteStationFromModal() {
    
    /** 
    this.fdsnService.deleteStation(this.deleteLocation).subscribe(
      wasDeleted => {
        if (wasDeleted) {
          this.notificationService.showSuccessMessage("Station " + this.deleteLocation.name + " has been deleted.");
          this.removeStationFromList();
        } else {
          this.notificationService.showWarningMessage("Fail to delete station " + this.deleteLocation.name + ".");
        }
        this.deleteLocation = null;
        this.closeDeleteModal();
      },
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.error.message);
        this.closeDeleteModal();
      }
    )*/
  }

  pageChanged(event: PageChangedEvent) {
    this.page = event.page;
    this.searchLocation();
  }

  itemsPerPageChanged(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.page = 1;
    this.searchLocation();
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    this.searchLocation(e.item.id, "name", "id");
  }

  searchLocation(value="", orderBy="name", searchBy = "station_id, name"){
   
 
    this.fdsnService.searchLocations(this.buildQueryParams(value, orderBy, searchBy)).subscribe(
      data => {        
        this.totalItems = data.total;
        this.locations = data.result;
      },
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.message)
      }      
    )
  }
  
}
