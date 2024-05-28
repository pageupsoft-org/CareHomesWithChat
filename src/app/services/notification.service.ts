import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Notification } from '../shared/models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public getUserNotification(userId: number): Observable<Array<Notification>> {
    let url = this.notificationUrl + 'Notifications/' + userId;
    return this.http.get<Array<Notification>>(url);
  }

  public setIsSeen(userId: number): Observable<boolean> {
    let url = this.notificationUrl + 'Notification/SetIsSeen/' + userId;
    return this.http.post<boolean>(url,userId);
  }

  public setSeenById(notificationId: number): Observable<boolean> {
    let url = this.notificationUrl + 'Notification/SetIsSeenById/' + notificationId;
    return this.http.post<boolean>(url,notificationId);
  }
}
