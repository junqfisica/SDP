import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
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

@Component({
  selector: 'app-channel-list',
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.css']
})
export class ChannelListComponent extends ComponentUtils implements OnInit {

  station: Station;
  stationId: string;
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

  constructor(private route: ActivatedRoute, private fdsnService: FdsnService, private notificationService: NotificationService, 
    private modalService: BsModalService) {
    super(notificationService)
    this.route.params.subscribe(
      params => {          
        if (params && params.stationId) {
          this.fdsnService.getStation(params.stationId).subscribe(
            station => {
              this.station = station;
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

  buildQueryParams(value="", orderBy="name, start_time", searchBy = "station_id, name"): HttpParams {
    if (searchBy !== 'id') {
      value = this.stationId + "," + value;
    }
    const searchParms = new Search(searchBy, value).searchParms
    searchParms.orderBy = orderBy
    searchParms.orderDesc = false;
    searchParms.use_AND_Operator = true;
    searchParms.mapColumnAndValue = true;
    searchParms.page = this.page
    searchParms.perPage = this.itemsPerPage

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
    this.searchChannels(e.item.id, "start_time", "id");
  }

  searchChannels(value="", orderBy="name, start_time", searchBy = "station_id, name"){
    
    this.fdsnService.searchChannels(this.buildQueryParams(value, orderBy, searchBy)).subscribe(
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
