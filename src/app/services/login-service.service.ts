import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Login } from '../shared/models/login';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  private loginUrl = environment.baseUrl;
  errorData: {};
  public identityUser :any;

  constructor(private http: HttpClient) { }

  login(login: Login) {
    let url = this.loginUrl + "Identity/Login";
    return this.http.post<any>(url, login).pipe(map(user => {
      if (user && user.accessToken) {
        this.identityUser = user;  
        return this.identityUser
      }
    }), catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An errore:' + error.error.message);
    } else {
      console.error(error.statusText);
    }
    this.errorData = {
      errorTitle: 'Oops! Request for document failed',
      errorDesc: `Something bad happened. Please try again later. ${error}`
    };
    return throwError(this.errorData);
  }

  getToken(){
    return this.identityUser.accessToken
  }

  loggedIn(){
    return !!localStorage.getItem('')
  }
}
