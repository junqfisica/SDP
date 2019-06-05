import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NotificationService } from '../../../../services/notification/notification.service';
import { Network } from '../../../../model/model.network';
import { FdsnService } from '../../../../services/fdsn/fdsn.service';
import { FdsnValidador, AppValidador } from '../../../../statics/form-validators';
import { EquipmentType as EquipmentType } from '../../../../model/model.equipmentTypes';
import { Equipments } from '../../../../model/model.equipments';
import { Station } from '../../../../model/model.station';
import { DateUtil } from '../../../../statics/date-util';

@Component({
  selector: 'app-fdsn-create',
  templateUrl: './fdsn-create.component.html',
  styleUrls: ['./fdsn-create.component.css']
})
export class FdsnCreateComponent implements OnInit {

  isNetworkCollapsed = true;
  isEquipmentsCollapsed = true;
  isStationCollapsed = true;
  networkForm: FormGroup;
  equipmentForm: FormGroup;
  stationForm: FormGroup;
  networks: Network[];
  equipmentType: EquipmentType[] = []
  nrlManufactures: string[] = [] 
  nrlInstruments: string[] = []
  nrlSensorExtraInfo: string[] = []
  bsConfig = { dateInputFormat: 'DD.MM.YYYY', containerClass: 'theme-default' };

  constructor(private formBuilder: FormBuilder, private notificationService: NotificationService, private fdsnService: FdsnService) {
    this.fdsnService.getEquipmentTypes().subscribe(
      types => {
        this.equipmentType = types;        
      },
      error => {
        console.log(error);
      }

    );
    this.getNetworks(); 
    this.buildForms();
  }

  ngOnInit() {
  }

  getDate(dateStr: string) {
    return new Date(dateStr);
  }

  buildForms(){

    this.networkForm = this.formBuilder.group({
      networkId: [null, {validators: [Validators.required, Validators.minLength(2), Validators.maxLength(2)], 
        asyncValidators: [FdsnValidador.validateNetworkId(this.fdsnService)], updateOn: 'change'}],
      description: ['', {validators: [], updateOn: 'change'}]
    });

    this.equipmentForm = this.formBuilder.group({
      equipmentType: ['', {validators: [Validators.required], updateOn: 'change'}],
      equipmentName: ['', {validators: [Validators.required]}],
      equipmentManufactory: ['', {validators: [Validators.required]}],
      description: ['', {validators: [], updateOn: 'change'}],
      isRestrict: [true, {validators: [], updateOn: 'change'}]
    });

    this.stationForm = this.formBuilder.group({
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

  }

  fetchNRLManufactures(instrumentType: string){
    this.fdsnService.getNRLManufacturers(instrumentType).subscribe(
      manufactores => {
        this.nrlManufactures = manufactores;                
      },
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.error.message)
      }
    );
  }

  fetchNRLInstruments(instrumentType: string, manufactore: string){
    this.fdsnService.getNRLInstrument(instrumentType, manufactore).subscribe(
      instruments => {
        this.nrlInstruments = instruments;                
      },
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.error.message)
      }
    );
  }

  // convenience getter for easy access to form fields
  get networkControl() { return this.networkForm.controls }
  get equipmentControl() { return this.equipmentForm.controls }
  get stationControl() { return this.stationForm.controls }

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

  onCreateDateChange($event){
    setTimeout( () => {
      this.stationControl.removeDate.updateValueAndValidity();
    }, 500 );
  }

  onClickEquipmentRestriction(isRestrict: boolean){
    if (isRestrict) {
      this.equipmentControl.equipmentManufactory.setValidators(Validators.required);
    } else {
      this.equipmentControl.equipmentManufactory.clearValidators();
    }
    this.clearEquipmentNameAndManufacture();
    this.clearEquipDescription();
    this.equipmentControl.equipmentManufactory.updateValueAndValidity();
  }
  
  networkFormToNetwork(): Network {
    const network = new Network();
    network.id = this.networkControl.networkId.value.trim().toUpperCase();
    network.description = this.networkControl.description.value.trim();
    return network;
  }

  equipmentFormToEquipments(): Equipments {
    const eq = new Equipments();
    eq.id = null;
    eq.type = this.equipmentControl.equipmentType.value;
    eq.description = this.equipmentControl.description.value.trim();
    if (this.equipmentControl.isRestrict.value) {
      eq.name = this.equipmentControl.equipmentName.value;
      eq.manufactory = this.equipmentControl.equipmentManufactory.value;
    } else {
      eq.name = this.equipmentControl.equipmentName.value.trim().toUpperCase();
      let manufactory = this.equipmentControl.equipmentManufactory.value
      if (manufactory.length == 0){
        manufactory = "Unknown"
      }
      // captalize manufacture.
      manufactory = manufactory.charAt(0).toUpperCase() + manufactory.slice(1)
      eq.manufactory = manufactory;
    }
    return eq;
  }

  private clearEquipmentNameAndManufacture() {
    this.equipmentControl.equipmentManufactory.setValue("");
    this.equipmentControl.equipmentName.setValue("");
  }

  private clearEquipDescription(){
    this.nrlSensorExtraInfo = [];
    this.equipmentControl.description.setValue("");
    this.equipmentControl.description.clearValidators();
    this.equipmentControl.description.updateValueAndValidity();
  }

  onChangeEquipmentType(value: string) {
    this.fetchNRLManufactures(value);
    this.clearEquipmentNameAndManufacture();
    this.clearEquipDescription();
    this.nrlInstruments = [];
  }

  onChangeEquipmentManufactory(type: string, manufactore: string) {
    this.fetchNRLInstruments(type, manufactore);
    this.equipmentControl.equipmentName.setValue("");
    this.clearEquipDescription();
  }

  onChangeEquipmentName(type: string, manufactore: string, name: string){
    this.nrlSensorExtraInfo = [];
    if (type === 'Sensor') {
      this.equipmentControl.description.setValidators([Validators.required]);
      this.equipmentControl.description.updateValueAndValidity();
      this.fdsnService.getSensorExtraInfo(manufactore, name).subscribe(
        info => {
          this.nrlSensorExtraInfo = info;
          if (info.length == 0) {            
            this.clearEquipDescription();
          }
        },
        error => {
          console.log(error);
          this.nrlSensorExtraInfo = [];
          this.clearEquipDescription();
        }
      );
    }
  }

  stationFormToStation(): Station {
    const st = new Station();
    st.public_data = this.stationControl.isPublicData.value;
    st.network_id = this.stationControl.networkId.value;
    st.name = this.stationControl.name.value.trim().toUpperCase();
    st.latitude = this.stationControl.latitude.value;
    st.longitude = this.stationControl.longitude.value;
    st.elevation = this.stationControl.elevation.value;
    st.depth = this.stationControl.depth.value;
    st.province = this.stationControl.province.value;
    st.country = this.stationControl.country.value;
    st.site = this.stationControl.site.value;
    st.geology = this.stationControl.geology.value;
    st.creation_date = DateUtil.convertDateToUTCStringWithoutShift(this.stationControl.createDate.value);
    if (this.stationControl.removeDate.value) {
      st.removal_date = DateUtil.convertDateToUTCStringWithoutShift(this.stationControl.removeDate.value);
    } else {
      st.removal_date = null; 
    }
    return st;
  }

  setLocation(latitude: number, longitude: number) {
    this.fdsnService.getLocation(latitude, longitude).subscribe(
      data => {
        if (data.country == null || data.province == null){
          this.notificationService.showWarningMessage("No continent found at location: " + latitude + "," + longitude);
        } 
        this.stationForm.controls.province.setValue(data.province)
        this.stationForm.controls.country.setValue(data.country)
      },
      error => {
        console.log(error);
        this.notificationService.showWarningMessage("Can't find location.");
      }
    );
  }
  
  onSubmitNetwork(){
    
    // stop here if form is invalid   
    if (this.networkForm.invalid) {
        return;
    }
    this.fdsnService.createNetwork(this.networkFormToNetwork()).subscribe(
      saved => {
        if (saved) {
          this.notificationService.showSuccessMessage("Network was created.")
          this.getNetworks();
        } else {
          this.notificationService.showErrorMessage("Fail to create network.")
        }
      },
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.error.message);
      }
    );
    
  }

  onSubmitEquipment() {
    
    // stop here if form is invalid   
    if (this.equipmentForm.invalid) {
      return;
    }    
 
    this.fdsnService.createEquipment(this.equipmentFormToEquipments()).subscribe(
      saved => {
        if (saved) {
          this.notificationService.showSuccessMessage("The new equipment was created.")
        } else {
          this.notificationService.showErrorMessage("Fail to create equipment. It probably already exists.")
        }
      },
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.error.message);
      }
    );
    
  }

  onSubmitStation(){
    // console.log(this.stationFormToStation());
    // console.log(this.stationControl);

    // stop here if form is invalid   
    if (this.stationForm.invalid) {
      return;
    }

    this.fdsnService.createStation(this.stationFormToStation()).subscribe(
      saved => {
        if (saved) {
          this.notificationService.showSuccessMessage("The new station was created.")
        } else {
          this.notificationService.showErrorMessage("Fail to create station.")
        }
      },
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.error.message);
      }
    );
  }
}
