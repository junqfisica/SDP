import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { BsModalService } from 'ngx-bootstrap/modal';

import { NotificationService } from '../../../services/notification/notification.service';
import { FdsnService } from '../../../services/fdsn/fdsn.service';
import { Channel } from '../../../model/model.channel';
import { Station } from '../../../model/model.station';
import { DateUtil } from '../../../statics/date-util';
import { Equipments } from '../../../model/model.equipments';
import { AppValidador } from '../../../statics/form-validators';

@Component({
  selector: 'app-channel-edit',
  templateUrl: './channel-edit.component.html',
  styleUrls: ['./channel-edit.component.css']
})
export class ChannelEditComponent implements OnInit {

  channel: Channel
  channelForm: FormGroup;
  station: Station
  stationCreateDate: Date;
  stationRemovalDate: Date;
  dataloggers: Observable<Equipments[]>;
  sensors: Observable<Equipments[]>;
  gains: Observable<string[]>;
  sampleRates: Observable<string[]>;
  restrictEquipments = true;
  bsConfig = { dateInputFormat: 'DD.MM.YYYY', containerClass: 'theme-default' };
  isLoaddingPage = true;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private notificationService: NotificationService, 
    private fdsnService: FdsnService, private modalService: BsModalService, private router: Router) {
      this.dataloggers = this.fdsnService.getDataloggers();
      this.sensors = this.fdsnService.getSensors();
      this.route.params.subscribe(
        params => {          
          if (params && params.channelId) {
            this.fdsnService.getChannel(params.channelId).subscribe(
              channel => {
                if (channel){
                  this.channel = channel;
                  this.fetchStation();
                } else {
                  this.notificationService.showErrorMessage("Can't find the channel id " + params.channelId);
                  this.router.navigate(['/fdsn/stations']);
                }
              },
              error =>{
                console.log(error);
                this.notificationService.showErrorMessage(error.message);
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

  fetchStation(){
    this.fdsnService.getStation(this.channel.station_id).subscribe(
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

    const startTime = DateUtil.convertUTCStringToDate(this.channel.start_time);
    const stopTime = DateUtil.convertUTCStringToDate(this.channel.stop_time);

    this.channelForm = this.formBuilder.group({
      name: [this.channel.name, {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(3)], updateOn: 'change'}],
      latitude: [this.channel.latitude, {validators: [Validators.required, Validators.min(-90), Validators.max(90), 
        Validators.pattern(new RegExp(/^-?\d+(\.\d{5,6})/))], updateOn: 'change'}],
      longitude: [this.channel.longitude, {validators: [Validators.required, Validators.min(-180), Validators.max(180), 
        Validators.pattern(new RegExp(/^-?\d+(\.\d{5,6})/))], updateOn: 'change'}],
      elevation: [this.channel.elevation, {validators: [Validators.required], updateOn: 'change'}],
      depth: [this.channel.depth, {validators: [Validators.required], updateOn: 'change'}],
      datalogger:[this.datalogger, {validators: [Validators.required], updateOn: 'change'}],
      sensor:[this.sensor, {validators: [Validators.required], updateOn: 'change'}],
      gain: [this.channel.gain, {validators: [Validators.required], updateOn: 'change'}],
      sampleRate:[String(this.channel.sample_rate), {validators: [Validators.required], updateOn: 'change'}],
      dlNo: [this.channel.dl_no, {validators: [Validators.required], updateOn: 'change'}],
      sensorNumber: [this.channel.sensor_number, {validators: [Validators.required], updateOn: 'change'}],
      startTime: [startTime, {validators: [Validators.required, AppValidador.minDate(this.stationCreateDate), 
        AppValidador.maxDate(this.stationRemovalDate)], updateOn: 'change'}],
      stopTime: [stopTime, {validators: [Validators.required, AppValidador.minDate("startTime", true), 
        AppValidador.maxDate(this.stationRemovalDate)], updateOn: 'change'}],
      timepickerStop: [stopTime, {validators: [Validators.required], updateOn: 'change'}],
      timepickerStart: [startTime, {validators: [Validators.required], updateOn: 'change'}]
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

    this.onChangeDatalogger(this.datalogger);
    this.onChangeGain(this.datalogger, this.channel.gain);
    this.onChangeSampleRate(String(this.channel.sample_rate));
    
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

  get datalogger() {
    let dl: Equipments;
    this.channel.equipments.forEach( (eq) =>{ 
      if (eq.type === "Datalogger"){
        dl = eq;
        return;
      }
    });
    return dl;
  } 

  get sensor() {
    let sensor: Equipments;
    this.channel.equipments.forEach( (eq) =>{ 
      if (eq.type === "Sensor"){
        sensor = eq;
      }
    });
    return sensor;
  }

  onStartTimeChange(){
    setTimeout( () => { 
      this.channelControl.stopTime.updateValueAndValidity();
    }, 500 );
  }

  onChangeDatalogger(datalogger: Equipments){
    this.gains = this.fdsnService.getGains(datalogger.manufactory, datalogger.name);
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
    if (this.datalogger.name !== datalogger.name) {
      this.channelControl.gain.setValue("");
    }  
  }

  onChangeSensor(sensor: Equipments) {}

  onChangeGain(datalogger: Equipments, gain: string){
    this.sampleRates = this.fdsnService.getSampleRates(datalogger.manufactory, datalogger.name, gain);
    if (this.datalogger.name !== datalogger.name) {
      this.channelControl.sampleRate.setValue("");
    }
  }

  onChangeSampleRate(sampleRate: string){}

  channelFormToChannel(): Channel {
    const channel = new Channel();
    channel.id = this.channel.id;
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

    this.fdsnService.updateChannel(this.channelFormToChannel()).subscribe(
      wasUpdate => {
        if (wasUpdate) {
          this.notificationService.showSuccessMessage("Channel update.")
        } else {
          this.notificationService.showErrorMessage("Fail to update channel.");
        }
      }, 
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.error.message)
      }
    );
  }

}
