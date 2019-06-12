import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { NotificationService } from '../../../services/notification/notification.service';
import { FdsnService } from '../../../services/fdsn/fdsn.service';
import { Station } from '../../../model/model.station';
import { AppValidador } from '../../../statics/form-validators';
import { DateUtil } from '../../../statics/date-util';
import { Equipments } from '../../../model/model.equipments';
import { Channel } from '../../../model/model.channel';

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
  dataloggers: Observable<Equipments[]>;
  sensors: Observable<Equipments[]>;
  gains: Observable<string[]>;
  sampleRates: Observable<string[]>;
  restrictEquipments = true;
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
      this.dataloggers = this.fdsnService.getDataloggers();
      this.sensors = this.fdsnService.getSensors();
  }

  ngOnInit() {}

  buildForms(){
    this.stationCreateDate = DateUtil.convertUTCStringToDate(this.station.creation_date);
    this.stationCreateDate.setHours(0);
    this.stationCreateDate.setMinutes(0);
    this.stationCreateDate.setSeconds(0);
    if (this.station.removal_date !== null) {
      this.stationRemovalDate = DateUtil.convertUTCStringToDate(this.station.removal_date);
      this.stationRemovalDate.setHours(23);
      this.stationRemovalDate.setMinutes(59);
      this.stationRemovalDate.setSeconds(59);
    } else {
      this.stationRemovalDate = null;
    }

    this.channelForm = this.formBuilder.group({
      name: ['', {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(3)], updateOn: 'change'}],
      latitude: [this.station.latitude, {validators: [Validators.required, Validators.min(-90), Validators.max(90), 
        Validators.pattern(new RegExp(/^-?\d+(\.\d{5,6})/))], updateOn: 'change'}],
      longitude: [this.station.longitude, {validators: [Validators.required, Validators.min(-180), Validators.max(180), 
        Validators.pattern(new RegExp(/^-?\d+(\.\d{5,6})/))], updateOn: 'change'}],
      elevation: [this.station.elevation, {validators: [Validators.required], updateOn: 'change'}],
      depth: [this.station.depth, {validators: [Validators.required], updateOn: 'change'}],
      datalogger:['', {validators: [Validators.required], updateOn: 'change'}],
      sensor:['', {validators: [Validators.required], updateOn: 'change'}],
      gain: ['', {validators: [Validators.required], updateOn: 'change'}],
      sampleRate:['', {validators: [Validators.required], updateOn: 'change'}],
      dlNo: ['', {validators: [Validators.required], updateOn: 'change'}],
      sensorNumber: ['', {validators: [Validators.required], updateOn: 'change'}],
      startTime: [this.stationCreateDate, {validators: [Validators.required, AppValidador.minDate(this.stationCreateDate), 
        AppValidador.maxDate(this.stationRemovalDate)], updateOn: 'change'}],
      stopTime: [this.stationRemovalDate, {validators: [Validators.required, AppValidador.minDate("startTime", true), 
        AppValidador.maxDate(this.stationRemovalDate)], updateOn: 'change'}],
      timepickerStop: [this.stationRemovalDate, {validators: [Validators.required], updateOn: 'change'}],
      timepickerStart: [this.stationCreateDate, {validators: [Validators.required], updateOn: 'change'}]
    });

    if (this.stationRemovalDate === null) {
      this.channelControl.startTime.clearValidators();
      this.channelControl.startTime.setValidators([Validators.required, AppValidador.minDate(this.stationCreateDate)]);
      this.channelControl.stopTime.clearValidators();
      this.channelControl.stopTime.setValidators([Validators.required, AppValidador.minDate("startTime")]);
    }
    
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
      newDate.setSeconds(date.getSeconds());
      this.channelControl.stopTime.setValue(newDate);
    }
  }

  private updateStartTime(date: Date){
    if (date !== null){
      const newDate = new Date(this.channelControl.startTime.value);
      newDate.setHours(date.getHours());
      newDate.setMinutes(date.getMinutes());
      newDate.setSeconds(date.getSeconds());
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

  onChangeDatalogger(datalogger: Equipments){
    this.gains = this.fdsnService.getGains(datalogger.manufactory, datalogger.name);
    this.channelControl.gain.setValue("");
    this.gains.subscribe(
      gains => {
        if (gains.length == 0) {
          this.restrictEquipments = false;
        } else {
          this.restrictEquipments = true;
        }
      }, 
      error => {
        console.log(error);
        this.restrictEquipments = false;
      }
    );
    
  }

  onChangeSensor(sensor: Equipments) {}

  onChangeGain(datalogger: Equipments, gain: string){
    this.sampleRates = this.fdsnService.getSampleRates(datalogger.manufactory, datalogger.name, gain);
    this.channelControl.sampleRate.setValue("");
  }

  onChangeSampleRate(sampleRate: string){}

  channelFormToChannel(): Channel {
    const channel = new Channel();
    channel.station_id = this.station.id;
    channel.name = this.channelControl.name.value.trim().toUpperCase();
    channel.latitude = this.channelControl.latitude.value;
    channel.longitude = this.channelControl.longitude.value;
    channel.elevation = this.channelControl.elevation.value;
    channel.depth = this.channelControl.depth.value;
    channel.start_time = DateUtil.convertDateToUTCStringWithoutShift(this.channelControl.startTime.value);
    channel.stop_time = DateUtil.convertDateToUTCStringWithoutShift(this.channelControl.stopTime.value);
    channel.equipments = []
    channel.equipments.push(this.channelControl.datalogger.value);
    channel.equipments.push(this.channelControl.sensor.value);
    channel.gain = this.channelControl.gain.value.trim();
    channel.sample_rate = this.channelControl.sampleRate.value.trim();
    channel.dl_no = this.channelControl.dlNo.value.trim();
    channel.sensor_number = this.channelControl.sensorNumber.value.trim();
    return channel;
  }

  onSubmitChannel(){
    
    // stop here if form is invalid   
    if (this.channelForm.invalid) {
      return;
    }  
    this.fdsnService.createChannel(this.channelFormToChannel()).subscribe(
      wasCreated => {
        if (wasCreated) {
          this.notificationService.showSuccessMessage("Channel was created.")
        } else {
          this.notificationService.showErrorMessage("Fail to create channel.");
        }
      }, 
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.error.message)
      }
    );
    
  }
}
