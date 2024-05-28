import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Login } from '../shared/models/login';
// import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  private loginUrl = environment.baseUrl;
  public identity: any;
  errorData: {};

  constructor(private http: HttpClient) { }

  login(login: Login): Observable<Login> {
    let url = this.loginUrl + "Identity/Login";
    return this.http.post<Login>(url, login);
    // .pipe(map(user => {
    //   if (user && user.accessToken) {
    //     localStorage.setItem('_identity', JSON.stringify(user));
    //     localStorage.setItem('_accessToken', user.accessToken);
    //     localStorage.setItem('_userType', user.role);
    //     this.identity = user;
 
    //     return this.identity;
    //   }
    // }), catchError(this.handleError)
    // );
  }

  public loggedIn() {
    // return this.identity.accessToken;
    return !!localStorage.getItem('_accessToken');
  }

  public getRole(){
    return (localStorage.getItem('_identity')) ? JSON.parse(localStorage.getItem('_identity')).role : ''
  }

  // private handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     console.error('An errore:' + error);
  //   } else {
  //     console.error(error.error);
  //   }
  //   this.errorData = {
  //     errorTitle: 'Oops! Request for document failed',
  //     errorDesc: 'Something bad happened. Please try again later.',
  //     errorMsg:error.error
  //   };
  //   return throwError(this.errorData);
  // }

  getToken() {
    // return this.identity.accessToken;
    return localStorage.getItem('_accessToken');
  }

  getUserType() {
    // return this.identity.userType;
    return Number(localStorage.getItem('_userType'));
  }

  public forgotPassword(email): Observable<any> {
    let url = this.loginUrl + "Identity/ForgetPassword";
    return this.http.post<any>(url, email);
  }
}
