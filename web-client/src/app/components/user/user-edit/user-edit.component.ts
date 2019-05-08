import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { forkJoin } from 'rxjs';

import { NotificationService } from '../../../services/notification/notification.service';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../model/model.user';
import { Role } from '../../../model/model.role';
import { UserValidador } from '../../../statics/form-validators';
import { Right } from '../../../model/model.rights';
import { RoleRights } from '../../../model/model.role-rights';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  user: User
  userForm: FormGroup;
  submitted = false;
  roles: Role[] = []
  rights: Right[] = []
  roleRights: RoleRights[] = []

  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, 
    private notificationService: NotificationService, private userService: UserService) {
      this.route.params.subscribe(
        params => {
          if (params && params.id) {
            forkJoin(
              this.userService.get(params.id),
              this.userService.getRoles(),
              this.userService.getRights()
            ).subscribe(
              data => {
                this.user = data[0]
                this.roles = data[1]
                this.rights = data[2]
                this.mapRolesAndRights()
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

  mapRolesAndRights(){
    this.roles.forEach(role => {
      this.userService.roleRights(role.role_id).subscribe(
        right_ids => {
          const roleRight = new RoleRights()
          roleRight.role_id = role.role_id
          roleRight.right_ids = right_ids
          this.roleRights.push(roleRight)
          if (this.user.roles.includes(role.role_id)){
            role.selected = true
          }
          this.selectRightsByRole(role.role_id, role.selected)
        },
        error => {
          this.notificationService.showErrorMessage(error.message)
          console.log(error);
        }
      )
    })    
  }

  buildForm(user: User){
    const roleForm = {}
    for (const role of this.roles){
      if (this.user.roles.includes(role.role_id)){
        role.selected = true
      }
      roleForm[role.role_id] = ['', {validators: [UserValidador.validateRoles(this.roles)], updateOn: 'change'}]
    }

    const rightForm = {}
    for (const right of this.rights){
      this.selectUserRight(right)
      rightForm[right.right_id] = ['', {updateOn: 'change'}]
    }

    this.userForm = this.formBuilder.group({
      username: [this.user.username, {validators: [Validators.required], asyncValidators: [UserValidador.validateUsername(this.userService, 500, [this.user.username])], updateOn: 'change'}],
      firstName: [user.name, {validators: Validators.required, updateOn: 'change'}],
      lastName: [user.surname, {validators: Validators.required, updateOn: 'change'}],
      roles: this.formBuilder.group(roleForm),
      rights: this.formBuilder.group(rightForm)
    });
    
    for (const role of this.roles){
      this.selectRole(role)
    }

  }

  get f() { return this.userForm.controls }
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

  private selectUserRight(right: Right){
    if (this.user.rights.includes(right.right_id)){
      right.selected = true
    }
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
      this.selectUserRight(right)
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
    this.user.username = this.f.username.value
    this.user.name = this.f.firstName.value
    this.user.surname = this.f.lastName.value
    return this.user
  }

  updateRoles(user: User) {
    // Clean roles
    user.roles = []
    // Add selected
    this.roles.forEach(role => {
      if (role.selected){
        user.roles.push(role.role_id)
      }
    })
  }

  updateRights(user: User) {
    // Clean rights
    user.rights = []
    // Add selected
    this.rights.forEach(right => {
      if (right.selected){
        user.rights.push(right.right_id)
      }
    })
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.userForm.invalid) {
        return;
    }

    const user = this.formToUser();
    this.updateRoles(user)
    this.updateRights(user)
    this.userService.updateUser(user).subscribe(
      wasUpdate => {
        if (wasUpdate) {
          this.notificationService.showSuccessMessage("User was update.")
          this.router.navigate(["/user/users"])
        } else {
          this.notificationService.showErrorMessage("Fail to update user.")
        }
      },
      error => {
        console.log(error);
        this.notificationService.showErrorMessage(error.message)
      }
    );
  }

}
