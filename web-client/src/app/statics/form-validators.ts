import { Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

import { debounceTime, distinctUntilChanged, take, switchMap, map } from 'rxjs/operators';

import { Role } from '../model/model.role';
import { UserService } from '../services/user/user.service';
import { Observable } from 'rxjs';
import { of as observableOf } from 'rxjs';


export class AppValidador extends Validators {

  public static passwordMinLenght = 6

  private static parentControlsValue(control: AbstractControl, controlKey : string) {
    if (control != undefined &&  control.parent != undefined && control.parent.controls != undefined ){
      const parentControls = control.parent.controls
      if (parentControls[controlKey] == undefined) {
        console.error("The key " + controlKey + " don't exists in this validator control.");
        return null
      }

      return parentControls[controlKey].value
    }

  }
  
  static match(controlKey : string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {

      const valueToMatch = AppValidador.parentControlsValue(control, controlKey)
      if (control.value !== undefined && control.value != valueToMatch) {
        return { 'match': true };
      }
      return null;
    };
  }
}

export class UserValidador extends Validators {

  static validateRoles (roles : Role[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      // console.log(control);
      
      for (const role of roles){
        if (role.selected) {
          return null
        }
      }
      return { 'notSelected': true }
    };
  }

  static validateUsername(userService: UserService, time: number = 500, blacklist: string[] = []) {
    return (control: AbstractControl): Observable<ValidationErrors|null> => {
      if (!control.valueChanges){
        return observableOf(null);
      } else {
        if (blacklist.includes(control.value)){
          return  observableOf(null)
        }
        return  control.valueChanges.pipe(
          debounceTime(time),
          distinctUntilChanged(),
          take(1),
          switchMap(() => userService.isUsernameTaken(control.value)),
          map(usernameIsTaken => {
            return usernameIsTaken ? {'isTaken': true} : null
          })
        )
      }
    }
  }
}