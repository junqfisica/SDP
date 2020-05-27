import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable, forkJoin } from 'rxjs';

import { BsModalService } from 'ngx-bootstrap/modal';

import { NotificationService } from '../../../services/notification/notification.service';
import { FdsnService } from '../../../services/fdsn/fdsn.service';
import { Channel } from '../../../model/model.channel';
import { Station } from '../../../model/model.station';
import { Equipments } from '../../../model/model.equipments';
import { LocationModel } from '../../../model/model.location-model';
import { ChannelForm } from '../../../forms/channel-form';

@Component({
  selector: 'app-channel-edit',
  templateUrl: './channel-edit.component.html',
  styleUrls: ['./channel-edit.component.css']
})
export class ChannelEditComponent implements OnInit {

  channel: Channel
  channelForm: ChannelForm;
  channelFormGroup: FormGroup;
  station: Station
  location: LocationModel
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
                  this.fetchStationAndLocation();
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

  fetchStationAndLocation(){
    forkJoin([this.fdsnService.getStation(this.channel.station_id), this.fdsnService.getLocationModel(this.channel.location_id)]).subscribe(
      results => {
        // results[0] is station.
        // results[1] is location.
        this.station = results[0];
        this.location = results[1];
        this.isLoaddingPage = false;
        this.buildForms();
      },
      error =>{
        console.log(error);
        this.notificationService.showErrorMessage(error.message);
        this.isLoaddingPage = false;
      }
    );
  }

  buildForms(){
    
    this.channelForm = new ChannelForm(this.formBuilder, this.station, this.location, this.channel);
    this.channelFormGroup = this.channelForm.form;
    
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

    this.onChangeDatalogger(this.channelForm.datalogger);
    this.onChangeGain(this.channelForm.datalogger, this.channel.gain);
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
  get channelControl() { return this.channelFormGroup.controls }

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
    if (this.channelForm.datalogger.name !== datalogger.name) {
      this.channelControl.gain.setValue("");
    }  
  }

  onChangeSensor(sensor: Equipments) {}

  onChangeGain(datalogger: Equipments, gain: string){
    this.sampleRates = this.fdsnService.getSampleRates(datalogger.manufactory, datalogger.name, gain);
    if (this.channelForm.datalogger.name !== datalogger.name) {
      this.channelControl.sampleRate.setValue("");
    }
  }

  onChangeSampleRate(sampleRate: string){}

  onSubmitChannel(){
    // console.log(this.channelForm.channelFormToChannel());
    
    // stop here if form is invalid   
    if (this.channelFormGroup.invalid) {
      return;
    }  

    this.fdsnService.updateChannel(this.channelForm.channelFormToChannel()).subscribe(
      wasUpdate => {
        if (wasUpdate) {
          this.notificationService.showSuccessMessage("Channel update.")
        } else {
          this.notificationService.showErrorMessage("Fail to update channel.");
        }
      }, 
      error => {
        console.log(error);
        if (error.error.message){
          this.notificationService.showErrorMessage(error.error.message)
        } else {
          this.notificationService.showErrorMessage(error.message)
        }
      }
    );
  }

}
