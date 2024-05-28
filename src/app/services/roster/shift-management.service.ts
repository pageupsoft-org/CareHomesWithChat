import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserShift } from 'src/app/shared/models/roster-management/user-shift';
import { Shift } from 'src/app/shared/models/roster-management/shift';
import { User } from 'src/app/shared/models/user';
import { environment } from 'src/environments/environment';
import { UserShifts } from 'src/app/shared/models/leave-management/user-shifts';
import { WorkingHoursRequest } from 'src/app/shared/models/working-hours-request';
import { PageResult } from 'src/app/shared/models/PageResult';
import { UsersWorkingHours } from 'src/app/shared/models/users-working-hours';

@Injectable({
  providedIn: 'root'
})
export class ShiftManagementService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public getShifts(locationId: number, start, userId: number): Observable<Array<Shift>> {
    let url: string;
    if (userId && userId != 0) {
      url = this.baseUrl + `Shift/GetShiftsByWeek/${locationId}/${start}?userId=${userId}`;
    } else {
      url = this.baseUrl + `Shift/GetShiftsByWeek/${locationId}/${start}`;
    }
    return this.http.get<Array<Shift>>(url);
  }

  public addShift(shift: Shift): Observable<Shift> {
    let url = this.baseUrl + "Shift/";
    return this.http.post<Shift>(url, shift);
  }

  public getShift(shiftId: number): Observable<Shift> {
    let url = this.baseUrl + `Shift/${shiftId}`;
    return this.http.get<Shift>(url);
  }

  public updateShift(shift: Shift): Observable<Shift> {
    let url = this.baseUrl + `Shift/${shift.id}`;
    return this.http.put<Shift>(url, shift);
  }

  public delete(shiftId: number): Observable<boolean> {
    let url = this.baseUrl + `Shift/${shiftId}`;
    return this.http.delete<boolean>(url);
  }


  // get shift users

  public getShiftUsers(event: Shift): Observable<Array<User>> {
    let url = this.baseUrl + `UserShift/Users`;
    return this.http.post<Array<User>>(url, event);
  }

  public assignUsers(userShift: UserShift): Observable<boolean> {
    let url = this.baseUrl + `UserShift`;
    return this.http.post<boolean>(url, userShift);
  }

  public updateAllotedUsers(userShift: UserShift): Observable<boolean> {
    let url = this.baseUrl + `UserShift`;
    return this.http.put<boolean>(url, userShift);
  }

  public getAllotedUsers(shiftId: number, careHomeId: number): Observable<UserShift> {
    let url = this.baseUrl + `UserShift/${shiftId}/${careHomeId}`;

    return this.http.get<UserShift>(url);
  }

  public getUserShifts(userShift: UserShifts): Observable<Array<UserShift>> {
    let url = this.baseUrl + `UserShifts`;
    return this.http.post<Array<UserShift>>(url, userShift);
  }

  public userShiftRemove(shiftId: number, userId: number): Observable<boolean> {
    let url = this.baseUrl + `UserShiftRemove/${shiftId}/${userId}`;
    return this.http.delete<boolean>(url);
  }

  public getUserWorkingHours(recordFilters: WorkingHoursRequest): Observable<PageResult<UsersWorkingHours>> {
    let url = this.baseUrl + "GetUserWorkingHours";
    return this.http.post<PageResult<UsersWorkingHours>>(url, recordFilters);
  }

  
}
