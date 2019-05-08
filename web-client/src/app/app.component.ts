import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';

import { User } from './model/model.user';
import { NotificationService } from './services/notification/notification.service';
import { ComponentUtils } from './components/component.utils';
import { LocalStorage } from './statics/local-storage';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends ComponentUtils {

  title = 'MyApp';
  alerts: any[] = [];

  constructor(private notificationService: NotificationService, private router: Router) {
      super(notificationService);
      this.updateUser()
      this.notificationService.successMessage$.subscribe(
        message => {
          this.addAlerts("success", message, 5000)
        }
      );
      
      this.notificationService.warningMessage$.subscribe(
        message => {
          this.addAlerts("warning", message, 10000)
        }
      );

      this.notificationService.errorMessage$.subscribe(
        message => {
          this.addAlerts("danger", message, 15000)
        }
      );
  }

  private messageIsRepted(msg: string): boolean {
    
    let isRepted = false
    this.alerts.forEach(alert => {
      if (alert.msg == msg){
        isRepted = true
      } 
    })
    return isRepted
    
  }

  private addAlerts(type: string, msg: string, timeout: number){

    // Check if alert already has this message. Only add a new one if msg is new. 
    if (!this.messageIsRepted(msg)){
      this.alerts.push({
        type: type,
        msg: msg,
        timeout: timeout
      });
    }
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  public updateUser() {
    this.currentUser = LocalStorage.currentUser
  }

  public syncUser(user: User) {
    LocalStorage.removeCurrentUser()
    LocalStorage.saveCurrentUser(user)
    this.updateUser()
  }

  public logout() {
    this.currentUser = null
    LocalStorage.removeCurrentUser()
    this.notificationService.showSuccessMessage("You were logged out.")
    this.router.navigate(['/login']);
  }
}
