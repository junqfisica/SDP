import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../model/model.user';
import { AuthService } from '../../services/auth/auth.service';
import { NotificationService } from '../../services/notification/notification.service';
import { LocalStorage } from '../../statics/local-storage';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User = new User();
  constructor(private authService: AuthService, private notificationService: NotificationService, 
    private router: Router, private appComponent: AppComponent) {

      // If user is logged redirect to home.
      if (LocalStorage.currentUser) {
        this.redirectToHome();
      }
  }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.user).subscribe(
      user => {
        if (user) {
          this.notificationService.showSuccessMessage("Logged in as " + user.username)
          LocalStorage.saveCurrentUser(user)
          this.redirectToHome();
        } else {
          this.notificationService.showErrorMessage("Username or password don't match, try again.")
        }
      },
      error => {
        this.notificationService.showErrorMessage(error.message)
        console.log(error);
      }
    );
  }

  private redirectToHome(){
    this.router.navigate(['/']);
    this.appComponent.updateUser();
  }

}
