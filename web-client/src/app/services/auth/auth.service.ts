import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ServerUrl } from '../../statics/server-url';
import { User } from '../../model/model.user';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  login(user: User): Observable<User> {
    // creating base64 encoded String from user name and password
    // const base64Credential: string = btoa(user.username + ':' + user.password);

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        /*'Authorization':  'Basic ' + base64Credential,*/
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      })
    };
    const loginForm = 'username=' + user.username + '&password=' + user.password;
    return this.http.post<User>(ServerUrl.rootUrl + '/api/login', loginForm, httpOptions);
  }

}
