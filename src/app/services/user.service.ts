import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/user';
import { Observable } from 'rxjs';
import { ChangePassword } from '../shared/models/change-password';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  public addUser(patient: User): Observable<User> {
    let url = this.userUrl + "User";
    return this.http.post<User>(url, patient);
  }

  public changePassword(changePassword: ChangePassword): Observable<ChangePassword> {
    let url = this.userUrl + "User/UpdatePassword";
    return this.http.post<ChangePassword>(url, changePassword);
  }

  public getUsers(careHomeId: number): Observable<Array<User>> {
    let url = this.userUrl + "Users/" + careHomeId;
    return this.http.get<Array<User>>(url);
  }

  public getUser(userId: number): Observable<User> {
    let url = this.userUrl + "User/" + userId;
    return this.http.get<User>(url);
  }

  public updateUser(user: User): Observable<User> {
    let url = this.userUrl + "User/" + user.id;
    return this.http.put<User>(url, user);
  }

  public changeUserStatus(userId: number, userStatus: number): Observable<boolean> {
    let url = this.userUrl + "Users/StatusChange/" + userId + "/" + userStatus;
    return this.http.put<boolean>(url, null);
  }

  public deleteUser(userId: number): Observable<boolean> {
    let url = this.userUrl + 'User/' + userId;
    return this.http.delete<boolean>(url);
  }

  public getPendingSignoff(userId: number): Observable<Array<any>> {
    let url = this.userUrl + 'User/GetPendingSignoff/' + userId;
    return this.http.get<Array<any>>(url);
  }

  public getByLocation(locationId: number, careHomeId?: number): Observable<Array<User>> {
    let url;
    if (careHomeId) {
      url = this.userUrl + "Users/GetByLocation/" + locationId + '?careHomeId=' + careHomeId;
    } else {
      url = this.userUrl + "Users/GetByLocation/" + locationId;
    }
    return this.http.get<Array<User>>(url);
  }

  public getUserCount(careHomeId: number, userId?: number): Observable<number> {
    let url;
    if (userId) {
      url = this.userUrl + "Users/GetUserCount/" + careHomeId + "?userId=" + userId;
    }
    else {
      url = this.userUrl + "Users/GetUserCount/" + careHomeId;
    }
    return this.http.get<number>(url);
  }

  public getUsersList(careHomeId: number, userId?: number): Observable<Array<User>> {
    let url;
    if (userId) {
      url = `${this.userUrl}Users/GetUserList/${careHomeId}?userId=${userId}`;
    }
    else {
      url = `${this.userUrl}Users/GetUserList/${careHomeId}`;
    }
    return this.http.get<Array<User>>(url);
  }

}


