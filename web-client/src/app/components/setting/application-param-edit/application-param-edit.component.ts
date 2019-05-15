import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApplicationParamService } from '../../../services/setting/application-param.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { AppParams } from '../../../model/model.app-param';

@Component({
  selector: 'app-application-param-edit',
  templateUrl: './application-param-edit.component.html',
  styleUrls: ['./application-param-edit.component.css']
})
export class ApplicationParamEditComponent implements OnInit {

  param: AppParams = new AppParams();

  constructor(private route: ActivatedRoute, private notificationService: NotificationService, 
    private applicationParamService: ApplicationParamService) { 
      this.route.params.subscribe(
        params => {
          if (params && params.id) {
            this.applicationParamService.get(params.id).subscribe(
              data => {
                this.param = data
              },
              error => {
                console.log(error);
              }
            );
          }
        }
      );
    }

  ngOnInit() {
  }

  private isValidForm(): boolean{
    if (this.param.param_value && this.param.param_value.length > 0 &&
      this.param.label && this.param.label.length > 0) {
        this.param.param_value = this.param.param_value.trim();
        this.param.label = this.param.label.trim();
        return true
    }
    return false
  }

  updateApplicationParam(){
    if (this.isValidForm()) {
      this.applicationParamService.updateAppParam(this.param).subscribe(
        wasUpdated => {
          if (wasUpdated) {
            this.notificationService.showSuccessMessage("Update succeed.")
          } else {
            this.notificationService.showErrorMessage("Fail to update.")
          }

        },
        error => {
          this.notificationService.showErrorMessage(error.error.message);
          console.log(error);
        }
      );
      
    }

    
  }

}
