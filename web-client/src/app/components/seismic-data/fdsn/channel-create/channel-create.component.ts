import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { NotificationService } from '../../../../services/notification/notification.service';
import { FdsnService } from '../../../../services/fdsn/fdsn.service';
import { Station } from '../../../../model/model.station';
import { AppValidador } from '../../../../statics/form-validators';
import { DateUtil } from '../../../../statics/date-util';

@Component({
  selector: 'app-channel-create',
  templateUrl: './channel-create.component.html',
  styleUrls: ['./channel-create.component.css']
})
export class ChannelCreateComponent implements OnInit {

  station: Station
  channelForm: FormGroup;
  isLoaddingPage = true;
  stationCreateDate: Date;
  stationRemovalDate: Date;
  bsConfig = { dateInputFormat: 'DD.MM.YYYY', containerClass: 'theme-default' };

  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, 
    private notificationService: NotificationService, private fdsnService: FdsnService) {
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

  ngOnInit() {}

  buildForms(){
    this.stationCreateDate = DateUtil.convertUTCStringToDate(this.station.creation_date);
    this.stationCreateDate.setHours(0);
    this.stationCreateDate.setMinutes(0);
    this.stationRemovalDate = DateUtil.convertUTCStringToDate(this.station.removal_date);
    this.stationRemovalDate.setHours(23);
    this.stationRemovalDate.setMinutes(59);
    this.stationRemovalDate.setSeconds(59);

    const rt = new Date(this.station.removal_date);
    rt.setHours(23);
    rt.setMinutes(59);

    this.channelForm = this.formBuilder.group({
      stationId: [this.station.id, {validators: [Validators.required]}],
      name: ['', {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(3)], updateOn: 'change'}],
      latitude: [this.station.latitude, {validators: [Validators.required, Validators.min(-90), Validators.max(90), 
        Validators.pattern(new RegExp(/^-?\d+(\.\d{5,6})/))], updateOn: 'change'}],
      longitude: [this.station.longitude, {validators: [Validators.required, Validators.min(-180), Validators.max(180), 
        Validators.pattern(new RegExp(/^-?\d+(\.\d{5,6})/))], updateOn: 'change'}],
      elevation: [this.station.elevation, {validators: [Validators.required], updateOn: 'change'}],
      depth: [this.station.depth, {validators: [Validators.required], updateOn: 'change'}],
      gain: ['', {validators: [Validators.required], updateOn: 'change'}],
      sampleRate:['', {validators: [Validators.required], updateOn: 'change'}],
      dlNo: ['', {validators: [Validators.required], updateOn: 'change'}],
      sensorNumber: ['', {validators: [Validators.required], updateOn: 'change'}],
      startTime: [this.stationCreateDate, {validators: [Validators.required, AppValidador.minDate(this.stationCreateDate), 
        AppValidador.maxDate(this.stationRemovalDate)], updateOn: 'change'}],
      stopTime: [this.stationRemovalDate, {validators: [AppValidador.minDate("startTime"), 
        AppValidador.maxDate(this.stationRemovalDate)], updateOn: 'change'}],
      timepickerStop: [this.stationRemovalDate, {validators: [Validators.required], updateOn: 'change'}],
      timepickerStart: [this.stationCreateDate, {validators: [Validators.required], updateOn: 'change'}]
    });
    
    // Call everytime the timepicker stoptime is changed.
    const timepickerStopObs: Observable<Date> = this.channelControl.timepickerStop.valueChanges;
    timepickerStopObs.subscribe(
      date => {
        if (date !== null) {
         this.updateStopTime(date);
        }
      }
    );

    // Call everytime the timepicker starttime is changed.
    const timepickerStartObs: Observable<Date> = this.channelControl.timepickerStart.valueChanges;
    timepickerStartObs.subscribe(
      date => {
        this.updateStartTime(date);
      }
    );
  }

  private updateStopTime(date: Date){
    if (date !== null){
      const newDate = new Date(this.channelControl.stopTime.value);
      newDate.setHours(date.getHours());
      newDate.setMinutes(date.getMinutes());
      this.channelControl.stopTime.setValue(newDate);
    }
  }

  private updateStartTime(date: Date){
    if (date !== null){
      const newDate = new Date(this.channelControl.startTime.value);
      newDate.setHours(date.getHours());
      newDate.setMinutes(date.getMinutes());
      this.channelControl.startTime.setValue(newDate);
    }
  }


  // convenience getter for easy access to form fields
  get channelControl() { return this.channelForm.controls }

  onStartTimeChange(){
    setTimeout( () => { 
      this.channelControl.stopTime.updateValueAndValidity();
    }, 500 );
  }

  onSubmitChannel(){
    const time = DateUtil.convertDateToUTCStringWithoutShift(this.channelControl.stopTime.value)
    console.log(time);
    
    console.log("Save channel");
    
  }
}
