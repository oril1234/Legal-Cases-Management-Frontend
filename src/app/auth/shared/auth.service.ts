import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { LoginRequestPayload } from '../login/login-request.payload';
import { LoginResponse } from '../login/login-response.payload';
import { map, tap } from 'rxjs/operators';
import {Roles} from '../../_models/roles.enum';

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


role = new BehaviorSubject<Roles>(Roles.SUPERVISOR);

  constructor(private httpClient: HttpClient) {
  }




  login(loginRequestPayload: LoginRequestPayload): Observable<boolean> {
    return this.httpClient.post<LoginResponse>('http://localhost:9090/authenticate',
      loginRequestPayload).pipe(map(data => {

        localStorage.setItem('authenticationToken', data.token);

        return true;
      }));
  }

  getJwtToken() {
    return localStorage.getItem('authenticationToken');
  }
/*
  refreshToken() {
    return this.httpClient.post<LoginResponse>('http://localhost:8080/api/auth/refresh/token',
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
    this.httpClient.post('http://localhost:8080/api/auth/logout', this.refreshTokenPayload,
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
    return this.getJwtToken() != null;
  }
}
