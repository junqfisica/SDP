import { FormGroup, FormBuilder, Validators} from '@angular/forms';

import { LocationModel } from '../model/model.location-model';
import { Station } from '../model/model.station';

export class LocationForm {

    private _form: FormGroup;
    private _currentLocation: LocationModel
    private _currentStation: Station

    constructor (private formBuilder: FormBuilder, currentStation: Station, currentLocation?: LocationModel) {

        this._currentLocation = currentLocation;
        this._currentStation = currentStation;

        this._form = this.formBuilder.group({
            name: ['', {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(5)], updateOn: 'change'}],
            latitude: [currentStation.latitude, {validators: [Validators.required, Validators.min(-90), Validators.max(90), 
              Validators.pattern(new RegExp(/^-?\d+(\.\d{5,6})/))], updateOn: 'change'}],
            longitude: [currentStation.longitude, {validators: [Validators.required, Validators.min(-180), Validators.max(180), 
              Validators.pattern(new RegExp(/^-?\d+(\.\d{5,6})/))], updateOn: 'change'}],
            elevation: [currentStation.elevation, {validators: [Validators.required], updateOn: 'change'}],
            depth: [currentStation.depth, {validators: [Validators.required], updateOn: 'change'}]
        });

        this.setInitialValues(currentLocation);

    }

    get form() {        
        return this._form;
    }

    get controls() {
        return this._form.controls;
    }

    private setInitialValues(location: LocationModel) {

        if (location) {
            this.controls.name.setValue(location.name);
            this.controls.latitude.setValue(location.latitude);
            this.controls.longitude.setValue(location.longitude);
            this.controls.elevation.setValue(location.elevation);
            this.controls.depth.setValue(location.depth);
        }
    }

    locationFormToLocation(): LocationModel {
        const loc = new LocationModel();
        loc.id = this._currentLocation ? this._currentLocation.id : null;
        loc.station_id = this._currentStation.id;
        loc.name = this.controls.name.value.trim().toUpperCase();
        loc.latitude = this.controls.latitude.value;
        loc.longitude = this.controls.longitude.value;
        loc.elevation = this.controls.elevation.value;
        loc.depth = this.controls.depth.value;
        return loc;
    }
}