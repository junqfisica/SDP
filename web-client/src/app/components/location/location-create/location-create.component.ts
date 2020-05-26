import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NotificationService } from '../../../services/notification/notification.service';
import { FdsnService } from '../../../services/fdsn/fdsn.service';
import { Station } from '../../../model/model.station';
import { LocationForm } from '../../../forms/location-form';

@Component({
  selector: 'app-location-create',
  templateUrl: './location-create.component.html',
  styleUrls: ['./location-create.component.css']
})
export class LocationCreateComponent implements OnInit {

  station: Station
  locationForm: LocationForm;
  locationFormGroup: FormGroup;
  isLoaddingPage = true;
 
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

    this.locationForm = new LocationForm(this.formBuilder, this.station);
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
    
    this.fdsnService.createLocation(this.locationForm.locationFormToLocation()).subscribe(
      wasCreated => {
        if (wasCreated) {
          this.notificationService.showSuccessMessage("Location was created.")
        } else {
          this.notificationService.showErrorMessage("Fail to create location.");
        }
      }, 
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.error.message)
      }
    );
    
  }

}
