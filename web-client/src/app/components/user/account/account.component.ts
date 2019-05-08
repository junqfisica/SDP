import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NotificationService } from '../../../services/notification/notification.service';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../model/model.user';
import { UserValidador, AppValidador } from '../../../statics/form-validators';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  user: User
  userForm: FormGroup;
  passwordMinLenght = AppValidador.passwordMinLenght
  changePassword = false
  submitted = false

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private appComponent: AppComponent,
    private notificationService: NotificationService, private userService: UserService) {
      this.route.params.subscribe(
        params => {
          if (params && params.username) {
            this.userService.getByUsername(params.username).subscribe(
              data => {
                this.user = data
                this.buildForm(this.user)
              },
              error => {
                this.notificationService.showErrorMessage(error.message)
                console.log(error);
              }
            )
          }
        },
        error => {
          console.log(error);
        }
      );
    }

  ngOnInit() {
  }

  buildForm(user: User){
    this.userForm = this.formBuilder.group({
      username: [this.user.username, {validators: [Validators.required], asyncValidators: [UserValidador.validateUsername(this.userService, 500, [this.user.username])], updateOn: 'change'}],
      firstName: [user.name, {validators: Validators.required, updateOn: 'change'}],
      lastName: [user.surname, {validators: Validators.required, updateOn: 'change'}],
      password: ['', {validators: [], updateOn: 'change'}],
      confirmPassword: ['', {validators: [], updateOn: 'change'}],
    });
  }

  onChangePassword(){
    this.changePassword = !this.changePassword
    if (this.changePassword) {
      this.f.password.setValidators([Validators.required, Validators.minLength(this.passwordMinLenght)])
      this.f.confirmPassword.setValidators([AppValidador.match("password")])
      this.f.password.updateValueAndValidity()
      this.f.confirmPassword.updateValueAndValidity()
    } else {
      this.f.password.clearValidators()
      this.f.confirmPassword.clearValidators()
    }
  }

  get f() { return this.userForm.controls }

  private formToUser(): User{
    this.user.username = this.f.username.value
    this.user.name = this.f.firstName.value
    this.user.surname = this.f.lastName.value
    if (this.changePassword) {
      this.user.password = this.f.password.value
    }
    return this.user
  }

  onSubmit() {
    this.submitted = true;
    
    // Validade confirmPassowrd before submit.
    this.f.confirmPassword.updateValueAndValidity()

    // stop here if form is invalid
    if (this.userForm.invalid) {
        return;
    }

    const user = this.formToUser();

    this.userService.selfUpdate(user).subscribe(
      updateUser => {
        if (updateUser){
          this.notificationService.showSuccessMessage("Profile was uptodate.")
          this.appComponent.syncUser(updateUser)
        } else {
          this.notificationService.showErrorMessage("Fail to uptodate profile.")
        }
      },
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.message)
      }
    );
    
  }

}
