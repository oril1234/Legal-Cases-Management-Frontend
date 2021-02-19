import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { LoginRequestPayload } from '../login/login-request.payload';
import { LoginResponse } from '../login/login-response.payload';
import { map, tap } from 'rxjs/operators';
import {Roles} from '../../_models/roles.enum';
import { environment } from "../../../environments/environment";
import jwt_decode from 'jwt-decode';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Person } from 'src/app/_models/person';

let BASE_URL:string = "http://localhost:9090";





if (environment.production) {
  // Amazon AWS Backend
  BASE_URL = "http://oglegal.us-east-1.elasticbeanstalk.com"
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();
/*
  refreshTokenPayload = {
    refreshToken: this.getRefreshToken(),
    username: this.getUserName()
  }
*/



roles = new BehaviorSubject<Roles>(Roles.SUPERVISOR);

  constructor(private httpClient: HttpClient) {
  }

  changeRole(role:Roles)
  {
    this.roles.next(role);
  }




  login(loginRequestPayload: LoginRequestPayload): Observable<boolean> {
    return this.httpClient.post<LoginResponse>(BASE_URL + "/authenticate",
      loginRequestPayload).pipe(map(data => {
        
        localStorage.setItem('authenticationToken', data.token);
        return true;
      }));
  }

  //Gertting the role of the user
  getRole(userName:number)
  {
    return this.httpClient.get<string[]>(BASE_URL + `/api/v1/person/role/${userName}`);
  }

  getPerson(userName:number)
  {
    return this.httpClient.get<Person>(BASE_URL + `/api/v1/person/${userName}`);
  }


  getJwtToken() {
    return localStorage.getItem('authenticationToken');
  }
/*
  refreshToken() {
    return this.httpClient.post<LoginResponse>(BASE_URL + "/api/auth/refresh/token",
      this.refreshTokenPayload)
      .pipe(tap(response => {
        this.localStorage.clear('authenticationToken');
        this.localStorage.clear('expiresAt');
        this.localStorage.store('authenticationToken',
         // response.authenticationToken);
        this.localStorage.store('expiresAt', response.expiresAt);
      }));
  }
  */
/*
  logout() {
    this.httpClient.post(BASE_URL + "/api/auth/logout", this.refreshTokenPayload,
      { responseType: 'text' })
      .subscribe(data => {
        console.log(data);
      }, error => {
        throwError(error);
      })
    this.localStorage.clear('authenticationToken');
    this.localStorage.clear('username');
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('expiresAt');
  }
*/
  getUserName() {
    return localStorage.getItem('username');
  }
  /*
  getRefreshToken() {
    return this.localStorage.retrieve('refreshToken');
  }
*/
  isLoggedIn(): boolean {
    let token=this.getJwtToken();
   if(token == null)
    return false;
   const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;

      return (Math.floor((new Date).getTime() / 1000)) < expiry;
  }
}
