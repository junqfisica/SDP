import { FormGroup, FormBuilder, Validators} from '@angular/forms';

import { AppValidador } from '../statics/form-validators';
import { Station } from '../model/model.station';
import { DateUtil } from '../statics/date-util';
import { Channel } from '../model/model.channel';
import { Equipments } from '../model/model.equipments';

export class ChannelForm {

    private _form: FormGroup;
    private _currentChannel: Channel;
    private _currentStation: Station;

    constructor (private formBuilder: FormBuilder, currentStation: Station, currentChannel?: Channel) {

        this._currentStation = currentStation;
        this._currentChannel = currentChannel;

        this._form = this.formBuilder.group({
            name: ['', {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(3)], updateOn: 'change'}],
            latitude: [currentStation.latitude, {validators: [Validators.required, Validators.min(-90), Validators.max(90), 
                Validators.pattern(new RegExp(/^-?\d+(\.\d{5,6})/))], updateOn: 'change'}],
            longitude: [currentStation.longitude, {validators: [Validators.required, Validators.min(-180), Validators.max(180), 
                Validators.pattern(new RegExp(/^-?\d+(\.\d{5,6})/))], updateOn: 'change'}],
            elevation: [currentStation.elevation, {validators: [Validators.required], updateOn: 'change'}],
            depth: [currentStation.depth, {validators: [Validators.required], updateOn: 'change'}],
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
            this.controls.startTime.clearValidators();
            this.controls.startTime.setValidators([Validators.required, AppValidador.minDate(this.stationCreateDate)]);
            this.controls.stopTime.clearValidators();
            this.controls.stopTime.setValidators([Validators.required, AppValidador.minDate("startTime")]);
        }

        this.setInitialValues(currentChannel);

    }

    get form() {        
        return this._form;
    }

    get controls() {
        return this._form.controls;
    }

    get stationCreateDate(): Date {
        const date = DateUtil.convertUTCStringToDate(this._currentStation.creation_date);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    }

    get stationRemovalDate(): Date | null{
        let date = null;
        if (this._currentStation.removal_date !== null) {
            date = DateUtil.convertUTCStringToDate(this._currentStation.removal_date);
            date.setHours(23);
            date.setMinutes(59);
            date.setSeconds(59);
        }
        return date;
    }

    private setInitialValues(channel: Channel) {

        if (channel) {
            const startTime = DateUtil.convertUTCStringToDate(channel.start_time);
            const stopTime = DateUtil.convertUTCStringToDate(channel.stop_time);

            this.controls.name.setValue(channel.name);
            this.controls.latitude.setValue(channel.latitude);
            this.controls.longitude.setValue(channel.longitude);
            this.controls.elevation.setValue(channel.elevation);
            this.controls.depth.setValue(channel.depth);
            this.controls.datalogger.setValue(this.datalogger);
            this.controls.sensor.setValue(this.sensor);
            this.controls.gain.setValue(channel.gain);
            this.controls.sampleRate.setValue(channel.sample_rate);
            this.controls.dlNo.setValue(channel.dl_no);
            this.controls.sensorNumber.setValue(channel.sensor_number);
            this.controls.startTime.setValue(startTime);
            this.controls.stopTime.setValue(stopTime);
            this.controls.timepickerStop.setValue(stopTime);
            this.controls.timepickerStart.setValue(startTime);
        }
    }

    channelFormToChannel(): Channel {
        const channel = new Channel();
        channel.id = this._currentChannel ? this._currentChannel.id : null;
        channel.station_id = this._currentStation.id;
        channel.name = this.controls.name.value.trim().toUpperCase();
        channel.latitude = this.controls.latitude.value;
        channel.longitude = this.controls.longitude.value;
        channel.elevation = this.controls.elevation.value;
        channel.depth = this.controls.depth.value;
        channel.start_time = DateUtil.convertDateToUTCStringWithoutShift(this.controls.startTime.value);
        channel.stop_time = DateUtil.convertDateToUTCStringWithoutShift(this.controls.stopTime.value);
        channel.equipments = []
        channel.equipments.push(this.controls.datalogger.value);
        channel.equipments.push(this.controls.sensor.value);
        channel.gain = this.controls.gain.value.trim();
        channel.sample_rate = this.controls.sampleRate.value.trim();
        channel.dl_no = this.controls.dlNo.value.trim();
        channel.sensor_number = this.controls.sensorNumber.value.trim();
        return channel;
    }

    get datalogger() {
        let dl: Equipments;
        if (this._currentChannel) {
            this._currentChannel.equipments.forEach( (eq) =>{ 
              if (eq.type === "Datalogger"){
                dl = eq;
                return;
              }
            });
        }
        return dl;
    } 
    
    get sensor() {
        let sensor: Equipments;
        if (this._currentChannel) {
            this._currentChannel.equipments.forEach( (eq) =>{ 
              if (eq.type === "Sensor"){
                sensor = eq;
              }
            });
        }
        return sensor;
    }
}