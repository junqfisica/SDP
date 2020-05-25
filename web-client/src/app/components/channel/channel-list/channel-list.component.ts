import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Observable, forkJoin } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/';

import { FdsnService } from '../../../services/fdsn/fdsn.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { Search } from '../../../model/model.search';
import { ComponentUtils } from '../../component.utils';
import { Channel } from '../../../model/model.channel';
import { DateUtil } from '../../../statics/date-util';
import { Station } from '../../../model/model.station';
import { LocationModel } from 'src/app/model/model.location-model';

@Component({
  selector: 'app-channel-list',
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.css']
})
export class ChannelListComponent extends ComponentUtils implements OnInit {

  station: Station;
  location: LocationModel;
  stationId: string;
  locationId: string;
  deleteModalRef: BsModalRef | null;
  deleteChannel: Channel;
  channels: Channel[] = []
  page = 1;
  itemsPerPage = 10;
  totalItems = 0;
  dataSource: Observable<Channel>;
  searchValue: string;
  typeaheadLoading: boolean;
  isLoaddingPage = true;
  startTimeFilter: Date;
  stopTimeFilter: Date;
  bsConfig = { dateInputFormat: 'DD.MM.YYYY', containerClass: 'theme-default' };

  constructor(private route: ActivatedRoute, private fdsnService: FdsnService, private notificationService: NotificationService, 
    private modalService: BsModalService) {
    super(notificationService)
    this.route.params.subscribe(
      params => {          
        if (params && params.stationId) {
          forkJoin([this.fdsnService.getStation(params.stationId), this.fdsnService.getLocationModel(params.locationId)]).subscribe(
            results => {
              // results[0] is our character
              // results[1] is our character homeworld
              this.station = results[0];
              this.location = results[1];
              this.isLoaddingPage = false;
              this.searchChannels();
            },
            error =>{
              console.log(error);
              this.notificationService.showErrorMessage(error.message);
              this.isLoaddingPage = false;
            }
          );
          this.stationId = params.stationId;
          this.locationId = (params.locationId !== '0') ? params.locationId : "";
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
      mergeMap((term: string) => this.fdsnService.searchChannels(this.buildQueryParams(term.toUpperCase()))
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

  createDateTextQuery(startDate?: Date, stopDate?: Date) {
    if (startDate && stopDate){
      stopDate.setHours(23,59,59)
      startDate.setHours(0,0,0)
      return "stop_time <= " + "'" + DateUtil.convertDateToUTCStringWithoutShift(stopDate) + "'" + " and start_time >= " + "'" + 
      DateUtil.convertDateToUTCStringWithoutShift(startDate) + "'";
    } else if (startDate) {
      startDate.setHours(0,0,0)
      return "start_time >= " + "'" + DateUtil.convertDateToUTCStringWithoutShift(startDate) + "'";
    } else if (stopDate) {
      stopDate.setHours(23,59,59)
      return "stop_time <= " + "'" + DateUtil.convertDateToUTCStringWithoutShift(stopDate) + "'";
    } else {
      return null;
    }

  };

  buildQueryParams(value="", searchBy = "station_id, location_id, name", orderBy="name, start_time"): HttpParams {
    if (searchBy !== 'id') {
      value = this.stationId + "," + this.locationId + "," + value;
    }
    const searchParms = new Search(searchBy, value).searchParms
    searchParms.orderBy = orderBy;
    searchParms.orderDesc = false;
    searchParms.use_AND_Operator = true;
    searchParms.mapColumnAndValue = true;
    searchParms.page = this.page;
    searchParms.perPage = this.itemsPerPage;
    searchParms.TextualQuery = this.createDateTextQuery(this.startTimeFilter, this.stopTimeFilter);
    
    return new HttpParams({ fromObject: searchParms });
  }

  openDeleteModal(template: TemplateRef<any>, channel: Channel) {
    this.deleteModalRef = this.modalService.show(template);
    this.deleteChannel = channel;
  }

  closeDeleteModal() {
    this.deleteModalRef.hide();
    this.deleteModalRef = null;
  }

  private removeChannelFromList() {
    if (this.deleteChannel) {
      const index = this.channels.indexOf(this.deleteChannel);
      if (index > -1) {
        this.channels.splice(index, 1);
      }
    }
  }

  deleteChannelFromModal() {
    
    this.fdsnService.deleteChannel(this.deleteChannel).subscribe(
      wasDeleted => {
        if (wasDeleted) {
          this.notificationService.showSuccessMessage("Channel " + this.deleteChannel.name + " has been deleted.");
          this.removeChannelFromList();
        } else {
          this.notificationService.showWarningMessage("Fail to delete channel " + this.deleteChannel.name + ".");
        }
        this.deleteChannel = null;
        this.closeDeleteModal();
      },
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.error.message);
        this.closeDeleteModal();
      }
    )
  }

  dateTimeToUTC(dateTime: string){
    return DateUtil.convertUTCStringToDate(dateTime);
  }

  pageChanged(event: PageChangedEvent) {
    this.page = event.page;
    this.searchChannels();
  }

  itemsPerPageChanged(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.page = 1;
    this.searchChannels();
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    this.searchChannels(e.item.id, "id", "start_time");
  }

  searchChannels(value="", searchBy = "station_id, location_id, name", orderBy="name, start_time"){
    
    this.fdsnService.searchChannels(this.buildQueryParams(value, searchBy, orderBy)).subscribe(
      data => {        
        this.totalItems = data.total;
        this.channels = data.result;        
      },
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.message)
      }      
    )
  }
}
