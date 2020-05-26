import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';

import { NotificationService } from '../../../services/notification/notification.service';
import { FdsnService } from '../../../services/fdsn/fdsn.service';
import { Station } from '../../../model/model.station';
import { LocationModel } from '../../../model/model.location-model';
import { LocationForm } from '../../../forms/location-form';


@Component({
  selector: 'app-location-edit',
  templateUrl: './location-edit.component.html',
  styleUrls: ['./location-edit.component.css']
})
export class LocationEditComponent implements OnInit {

  location: LocationModel
  locationForm: LocationForm;
  locationFormGroup: FormGroup;
  station: Station 
  isLoaddingPage = true;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private notificationService: NotificationService, 
    private fdsnService: FdsnService, private modalService: BsModalService, private router: Router) {
      this.route.params.subscribe(
        params => {          
          if (params && params.locationId) {
            this.fdsnService.getLocationModel(params.locationId).subscribe(
              location => {
                if (location){
                  this.location = location;
                  this.fetchStation();
                } else {
                  this.notificationService.showErrorMessage("Can't find the location id " + params.channelId);
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
    this.fdsnService.getStation(this.location.station_id).subscribe(
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
    
    this.locationForm = new LocationForm(this.formBuilder, this.station, this.location);
    this.locationFormGroup = this.locationForm.form;
    
  }


  // convenience getter for easy access to form fields
  get locationControl() { return this.locationFormGroup.controls }

  onSubmitLocation(){
    // console.log(this.channelForm.channelFormToChannel());
    
    // stop here if form is invalid   
    if (this.locationFormGroup.invalid) {
      return;
    }  
    this.fdsnService.updateLocation(this.locationForm.locationFormToLocation()).subscribe(
      wasUpdate => {
        if (wasUpdate) {
          this.notificationService.showSuccessMessage("Location update.")
        } else {
          this.notificationService.showErrorMessage("Fail to update location.");
        }
      }, 
      error => {
        console.log(error);
        if (error.error.message) {
          this.notificationService.showErrorMessage(error.error.message)
        } else {
          this.notificationService.showErrorMessage(error.message)
        }
      }
    );
  }

}
