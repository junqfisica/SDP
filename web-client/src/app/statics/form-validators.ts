import { Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

import { debounceTime, distinctUntilChanged, take, switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { of as observableOf } from 'rxjs';

import { Role } from '../model/model.role';
import { FdsnService } from '../services/fdsn/fdsn.service';
import { UserService } from '../services/user/user.service';


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

  static minDate(value : string | Date, isInclusive = false): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      
      let parentValue = null
      let minDate = null;
      if (typeof value === "string") {
        parentValue = AppValidador.parentControlsValue(control, value)
        minDate = new Date(parentValue)
      } else if (value instanceof Date) {
        parentValue = value;
        minDate = value;
      }

      const currentDate = new Date(control.value)
      if (control.value === null){
        return null;
      }
      const isMin = isInclusive ? currentDate <= minDate : currentDate < minDate;
      if (parentValue === null || (control.value !== undefined && isMin)) {
        return { 'minDate': true };
      }
      return null;
    };
  }

  static maxDate(value : string | Date, isInclusive = false): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      
      let parentValue = null
      let maxDate = null;
      if (typeof value === "string") {
        parentValue = AppValidador.parentControlsValue(control, value)
        maxDate = new Date(parentValue)
      } else if (value instanceof Date) {
        parentValue = value;
        maxDate = value;
      }

      const currentDate = new Date(control.value);
      
      if (control.value === null){
        return null;
      }
      const isMax = isInclusive ? currentDate >= maxDate : currentDate > maxDate;
      if (parentValue === null || (control.value !== undefined && isMax)) {
        return { 'maxDate': true };
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

export class FdsnValidador extends Validators {

  static validateNetworkId(fdsnService: FdsnService, time: number = 500, blacklist: string[] = []) {
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
          switchMap(() => fdsnService.isNetworkTaken(control.value.trim().toUpperCase())),
          map(networkIsTaken => {
            return networkIsTaken ? {'isTaken': true} : null
          })
        )
      }
    }
  }
  
}