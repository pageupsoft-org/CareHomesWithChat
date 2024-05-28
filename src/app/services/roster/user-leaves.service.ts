import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserLeave } from 'src/app/shared/models/leave-management/user-leave';
import { PageResult } from 'src/app/shared/models/PageResult';
import { userLeavesFilter } from 'src/app/shared/models/user-leaves-filter';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserLeavesService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public getUserLeaves(recored: userLeavesFilter): Observable<PageResult<UserLeave>> {
    let url = this.baseUrl + "UserLeave/QueryLeaves/";
    return this.http.post<PageResult<UserLeave>>(url, recored);
  }

  public applyUserLeave(userLeave: UserLeave): Observable<UserLeave> {
    let url = this.baseUrl + "UserLeave/";
    return this.http.post<UserLeave>(url, userLeave);
  }

  public getUserLeave(leaveId: number): Observable<UserLeave> {
    let url = this.baseUrl + "UserLeave/" + leaveId;
    return this.http.get<UserLeave>(url);
  }

  public updateUserLeave(userLeave: UserLeave): Observable<UserLeave> {
    let url = this.baseUrl + "UserLeave/Update";
    return this.http.put<UserLeave>(url, userLeave);
  }

  public delete(leaveId: number): Observable<boolean> {
    let url = this.baseUrl + "UserLeave/Delete?userLeaveId=" + leaveId;
    return this.http.delete<boolean>(url);
  }
}
