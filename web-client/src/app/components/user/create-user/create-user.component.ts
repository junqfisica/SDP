import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { forkJoin } from 'rxjs';

import { User } from '../../../model/model.user';
import { Role } from '../../../model/model.role';
import { UserService } from '../../../services/user/user.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { AppValidador, UserValidador } from '../../../statics/form-validators';
import { RoleRights } from '../../../model/model.role-rights';
import { Right } from '../../../model/model.rights';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  userForm: FormGroup;
  submitted = false;
  passwordMinLenght = AppValidador.passwordMinLenght
  roles: Role[] = []
  rights: Right[] = []
  roleRights: RoleRights[] = []

  constructor(private formBuilder: FormBuilder, private userService: UserService, private notificationService: NotificationService) { 
    forkJoin(
      this.userService.getRoles(),
      this.userService.getRights()
    ).subscribe(
      data => {
        this.roles = data[0]
        this.rights = data[1]
        this.mapRolesAndRights()
        this.buildForm()
      },
      error => {
        console.log(error)
        notificationService.showErrorMessage(error.error.message)
      }
    );
  }

  ngOnInit() {
    
  }

  private mapRolesAndRights(){
    this.roles.forEach(role => {
      this.userService.roleRights(role.role_id).subscribe(
        right_ids => {
          const roleRight = new RoleRights()
          roleRight.role_id = role.role_id
          roleRight.right_ids = right_ids
          this.roleRights.push(roleRight)
        },
        error => {
          this.notificationService.showErrorMessage(error.message)
          console.log(error);
        }
      )
    })    
  }

  buildForm(){
    const roleForm = {}
    for (const role of this.roles){
      roleForm[role.role_id] = ['', {validators: [UserValidador.validateRoles(this.roles)], updateOn: 'change'}]
    }

    const rightForm = {}
    for (const right of this.rights){
      rightForm[right.right_id] = ['', {updateOn: 'change'}]
    }

    this.userForm = this.formBuilder.group({
      username: [null, {validators: [Validators.required], asyncValidators: [UserValidador.validateUsername(this.userService)], updateOn: 'change'}],
      firstName: ['', {validators: Validators.required, updateOn: 'change'}],
      lastName: ['', {validators: Validators.required, updateOn: 'change'}],
      password: ['', {validators: [Validators.required, Validators.minLength(this.passwordMinLenght)], updateOn: 'change'}],
      confirmPassword: ['', {validators: [AppValidador.match("password")], updateOn: 'change'}],
      roles: this.formBuilder.group(roleForm),
      rights: this.formBuilder.group(rightForm)
    });

  }

  // convenience getter for easy access to form fields
  get f() { return this.userForm.controls }
  get roleControls() { return this.rolesForm.controls}
  get rolesForm (): FormGroup {return <FormGroup> this.userForm.get("roles")}
  get rightsForm (): FormGroup {return <FormGroup> this.userForm.get("rights")}

  private getRight(right_id): Right {
    let result = null
    this.rights.forEach( right => {
      if (right.right_id == right_id) {
        result = right
        return
      }
    })
    return result
  }

  private selectRightsByRole(role_id: string, select: boolean){
    
    let right_ids: string[] = []
    for (const rr of this.roleRights) {
      if (rr.role_id == role_id) {
        right_ids = rr.right_ids
        break
      } 
    }

    right_ids.forEach(right_id => {
      const right = this.getRight(right_id)
      right.selected = select
      if (right.selected){
        this.rightsForm.get(right_id).disable() 
      } else {
        this.rightsForm.get(right_id).enable() 
      }
    })
    
  }

  private selectRole(role: Role) {
    if (role.role_id == "ROLE_ADMIN" && role.selected) {
      this.roles.forEach(role => {
        if (role.role_id != "ROLE_ADMIN"){
          this.rolesForm.get(role.role_id).disable()
        }
        role.selected = true}
      )
    } else if (role.role_id == "ROLE_ADMIN" && !role.selected){
      this.roles.forEach(role =>  this.rolesForm.get(role.role_id).enable())
    }
  }

  onToogleRole(role: Role) {
    role.selected = !role.selected

    this.selectRightsByRole(role.role_id,role.selected)

    this.selectRole(role)

    // Force validation of roles to sync. 
    this.roles.forEach(role => {      
      this.rolesForm.get(role.role_id).updateValueAndValidity()
    })
    
  }

  onToogleRight(right: Right) {
    right.selected = !right.selected
  }

  private formToUser(): User{
    const user = new User()
    user.id = null
    user.token = null
    user.username = this.f.username.value
    user.name = this.f.firstName.value
    user.surname = this.f.lastName.value
    user.password = this.f.password.value
    return user
  }

  addRoles(user: User) {
    this.roles.forEach(role => {
      if (role.selected){
        user.roles.push(role.role_id)
      }
    })
  }

  addRights(user: User) {
    // Add selected
    this.rights.forEach(right => {
      if (right.selected){
        user.rights.push(right.right_id)
      }
    })
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
    this.addRoles(user)
    this.addRights(user)
    
    this.userService.createUser(user).subscribe(
      wasCreated => {
        if (wasCreated) {
          this.notificationService.showSuccessMessage("User " + user.username + " was created.")
        } else {
          console.log("Fail.")
          this.notificationService.showWarningMessage("Fail to create user. Check if this username already exists.")
        } 
      },
      error => {
        console.log(error)
        this.notificationService.showErrorMessage(error.error.message)
      } 
    );
  }

}
