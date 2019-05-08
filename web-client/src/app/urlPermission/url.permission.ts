import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { LocalStorage } from '../statics/local-storage';

@Injectable()
export class LoginPermission implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (LocalStorage.currentUser) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}

@Injectable()
export class AdminPermission implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (LocalStorage.currentUser && LocalStorage.currentUser.roles.includes("ROLE_ADMIN")) {
      return true;
    }

    // Don't have admin role.
    console.log("You don't have permission to access this page.");
    this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}

@Injectable()
export class RightPermission implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
    if (!route.data["rights"]) {
      console.error("You must provide a data['rights'] to use RightPermission. i.e: data: {rights: ['RIGHT_USER_CREATE']}");
      return false;
    }
    const rights: string[] = route.data["rights"]

    for (const right of rights ) {
      if (LocalStorage.currentUser && LocalStorage.currentUser.rights.includes(right)) {
        return true;
      }
    }
    // Don't have rights.
    console.log("You don't have permission to access this page.");
    this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}

@Injectable()
export class SameUserPermission implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (LocalStorage.currentUser) {
      if (route.params.id && route.params.id == LocalStorage.currentUser.id) {
        return true;
      } else if (route.params.username && route.params.username == LocalStorage.currentUser.username){
        return true;
      } else {
        // Not the same user.
        console.log("You don't have permission to access this page.");
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
        return false;
      }
    }
  }
}