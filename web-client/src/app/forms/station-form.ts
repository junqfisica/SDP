import { FormGroup, FormBuilder, Validators} from '@angular/forms';

import { AppValidador } from '../statics/form-validators';
import { Station } from '../model/model.station';
import { DateUtil } from '../statics/date-util';

export class StationForm {

    private _form: FormGroup;
    private _currentStation: Station

    constructor (private formBuilder: FormBuilder, currentStation?: Station) {

        this._currentStation = currentStation;

        this._form = this.formBuilder.group({
            networkId: [null, {validators: [Validators.required]}],
            name: ['', {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(5)], updateOn: 'change'}],
            isPublicData: [true, {validators: [], updateOn: 'change'}],
            latitude: ['', {validators: [Validators.required, Validators.min(-90), Validators.max(90), 
              Validators.pattern(new RegExp(/^-?\d+(\.\d{5,6})/))], updateOn: 'change'}],
            longitude: ['', {validators: [Validators.required, Validators.min(-180), Validators.max(180), 
              Validators.pattern(new RegExp(/^-?\d+(\.\d{5,6})/))], updateOn: 'change'}],
            elevation: ['', {validators: [Validators.required], updateOn: 'change'}],
            depth: ['', {validators: [Validators.required], updateOn: 'change'}],
            createDate: [null, {validators: [Validators.required], updateOn: 'change'}],
            removeDate: [null, {validators: [AppValidador.minDate("createDate")], updateOn: 'change'}],
            site: ['', {validators: [], updateOn: 'change'}],
            geology: ['', {validators: [], updateOn: 'change'}],
            province: ['', {validators: [], updateOn: 'change'}],
            country: ['', {validators: [], updateOn: 'change'}]
        });

        this.setInitialValues(currentStation);

    }

    get form() {        
        return this._form;
    }

    get controls() {
        return this._form.controls;
    }

    private setInitialValues(station: Station) {

        if (station) {
            const createDate = DateUtil.convertUTCStringToDate(station.creation_date);
            const removeDate = station.removal_date ? DateUtil.convertUTCStringToDate(station.removal_date) : null;  
    
            this.controls.networkId.setValue(station.network_id);
            this.controls.name.setValue(station.name);
            this.controls.isPublicData.setValue(station.public_data);
            this.controls.latitude.setValue(station.latitude);
            this.controls.longitude.setValue(station.longitude);
            this.controls.elevation.setValue(station.elevation);
            this.controls.depth.setValue(station.depth);
            this.controls.createDate.setValue(createDate);
            this.controls.removeDate.setValue(removeDate);
            this.controls.site.setValue(station.site);
            this.controls.geology.setValue(station.geology);
            this.controls.province.setValue(station.province);
            this.controls.country.setValue(station.country);
        }
    }

    stationFormToStation(): Station {
        const st = new Station();
        st.id = this._currentStation ? this._currentStation.id : null;
        st.public_data = this.controls.isPublicData.value;
        st.network_id = this.controls.networkId.value;
        st.name = this.controls.name.value.trim().toUpperCase();
        st.latitude = this.controls.latitude.value;
        st.longitude = this.controls.longitude.value;
        st.elevation = this.controls.elevation.value;
        st.depth = this.controls.depth.value;
        st.province = this.controls.province.value;
        st.country = this.controls.country.value;
        st.site = this.controls.site.value;
        st.geology = this.controls.geology.value;
        st.creation_date = DateUtil.convertDateToUTCStringWithoutShift(this.controls.createDate.value);
        if (this.controls.removeDate.value) {
          st.removal_date = DateUtil.convertDateToUTCStringWithoutShift(this.controls.removeDate.value);
        } else {
          st.removal_date = null; 
        }
        return st;
    }
}