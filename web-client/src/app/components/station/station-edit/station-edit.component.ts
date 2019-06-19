import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { FdsnService } from '../../../services/fdsn/fdsn.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { DateUtil } from '../../../statics/date-util';
import { Station } from '../../../model/model.station';
import { AppValidador } from '../../../statics/form-validators';
import { Network } from '../../../model/model.network';
import { Channel } from '../../../model/model.channel';
import { StationForm } from '../../../forms/station-form';

@Component({
  selector: 'app-station-edit',
  templateUrl: './station-edit.component.html',
  styleUrls: ['./station-edit.component.css']
})
export class StationEditComponent implements OnInit {

  networks: Network[];
  stationForm: StationForm;
  stationFormGroup: FormGroup;
  station: Station;
  updateModalRef: BsModalRef | null;
  isLoaddingPage = true;
  minRemovelDate: Date;
  maxCreateDate: Date;
  bsConfig = { dateInputFormat: 'DD.MM.YYYY', containerClass: 'theme-default' };

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private notificationService: NotificationService, 
    private fdsnService: FdsnService, private modalService: BsModalService) {
    this.getNetworks();
    this.route.params.subscribe(
      params => {          
        if (params && params.stationId) {
          this.fdsnService.getStation(params.stationId).subscribe(
            station => {
              this.station = station;
              this.buildForms();
              this.isLoaddingPage = false;
            },
            error =>{
              console.log(error);
              this.notificationService.showErrorMessage(error.message);
              this.isLoaddingPage = false;
            }
          );
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
  }

  getNetworks() {
    this.fdsnService.getNetworks().subscribe(
      data => {
        this.networks = data;
      },
      error => {
        console.log(error);
        this.notificationService.showErrorMessage("Error trying to get networs");
      }
    );
  }

  getDate(dateStr: string) {
    return new Date(dateStr);
  }

  buildForms(){

    this.stationForm = new StationForm(this.formBuilder, this.station);
    this.stationFormGroup = this.stationForm.form;

    // Add minDate validator.
    this.minRemovelDate = this.getLatestChannelStopDate();
    if (this.minRemovelDate !== null){
      this.stationControl.removeDate.clearValidators();
      this.stationControl.removeDate.setValidators(AppValidador.minDate(this.minRemovelDate));
      this.stationControl.removeDate.updateValueAndValidity();
    }

    // Add maxDate validator.
    this.maxCreateDate = this.getFirstChannelStartDate();
    if (this.maxCreateDate !== null){
      this.stationControl.createDate.setValidators(AppValidador.maxDate(this.maxCreateDate));
      this.stationControl.createDate.updateValueAndValidity();
    }
  }

  // convenience getter for easy access to form fields
  get stationControl() { return this.stationFormGroup.controls }

  private getChannelOrderByDate(): Channel[] {
    const ch = this.station.channels.sort((a, b) => {
      if (DateUtil.convertUTCStringToDate(a.start_time) > DateUtil.convertUTCStringToDate(b.start_time)){
        return 1
      }
      return -1
    });
    return ch;
  }

  private getLatestChannelStopDate(): Date | null {
    const chs = this.getChannelOrderByDate();
    if (chs !== null && chs.length > 0){
      const ch = chs.pop();
      const stopDate = DateUtil.convertUTCStringToDate(ch.stop_time);
      stopDate.setHours(0);
      stopDate.setMinutes(0);
      stopDate.setSeconds(0);
      return stopDate;
    } else {
      return null;
    }
  }

  private getFirstChannelStartDate(): Date {
    const chs = this.getChannelOrderByDate();
    if (chs !== null && chs.length > 0){
      const ch = chs[0]
      const startDate = DateUtil.convertUTCStringToDate(ch.start_time);
      startDate.setHours(0);
      startDate.setMinutes(0);
      startDate.setSeconds(0);
      return startDate;
    } else {
      return null;
    }
  }

  onCreateDateChange($event){
    setTimeout( () => {
      this.stationControl.removeDate.updateValueAndValidity();
    }, 500 );
  }

  openUpdateModal(template: TemplateRef<any>) {
    this.updateModalRef = this.modalService.show(template);
  }

  closeUpdateModal() {
    if (this.updateModalRef) {
      this.updateModalRef.hide();
      this.updateModalRef = null;
    }
  }

  setLocation(latitude: number, longitude: number) {
    this.fdsnService.getLocation(latitude, longitude).subscribe(
      data => {
        if (data.country == null || data.province == null){
          this.notificationService.showWarningMessage("No continent found at location: " + latitude + "," + longitude);
        } 
        this.stationFormGroup.controls.province.setValue(data.province)
        this.stationFormGroup.controls.country.setValue(data.country)
      },
      error => {
        console.log(error);
        this.notificationService.showWarningMessage("Can't find location.");
      }
    );
  }

  onSubmitStation(){
    this.closeUpdateModal();
    const updatedStation = this.stationForm.stationFormToStation();
    // console.log(updatedStation);

    // stop here if form is invalid   
    if (this.stationFormGroup.invalid) {
      return;
    }

    this.fdsnService.updateStation(updatedStation).subscribe(
      upToDate => {
        if (upToDate) {
          this.notificationService.showSuccessMessage("Station was updated.")
        } else {
          this.notificationService.showErrorMessage("Fail to update station.")
        }
      },
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.error.message)
      }
    );
    
  }

}
