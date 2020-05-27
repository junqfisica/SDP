import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable, forkJoin } from 'rxjs';

import { NotificationService } from '../../../services/notification/notification.service';
import { FdsnService } from '../../../services/fdsn/fdsn.service';
import { Station } from '../../../model/model.station';
import { Equipments } from '../../../model/model.equipments';
import { LocationModel } from '../../../model/model.location-model';
import { ChannelForm } from '../../../forms/channel-form';

@Component({
  selector: 'app-channel-create',
  templateUrl: './channel-create.component.html',
  styleUrls: ['./channel-create.component.css']
})
export class ChannelCreateComponent implements OnInit {

  station: Station;
  location: LocationModel;
  channelForm: ChannelForm;
  channelFormGroup: FormGroup;
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
          if (params && params.stationId && params.locationId) {
            forkJoin([this.fdsnService.getStation(params.stationId), this.fdsnService.getLocationModel(params.locationId)]).subscribe(
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

    this.channelForm = new ChannelForm(this.formBuilder, this.station, this.location);
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

  onSubmitChannel(){
    // console.log(this.channelForm.channelFormToChannel());
    
    // stop here if form is invalid   
    if (this.channelFormGroup.invalid) {
      return;
    }  
    this.fdsnService.createChannel(this.channelForm.channelFormToChannel()).subscribe(
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
