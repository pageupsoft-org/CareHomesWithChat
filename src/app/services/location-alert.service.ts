import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocationAlert } from '../shared/models/location-alerts';

@Injectable({
  providedIn: 'root'
})
export class LocationAlertService {
  private locationAlertUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  public addAlert(action: LocationAlert): Observable<LocationAlert> {
    let url = this.locationAlertUrl + "LocationAlert";
    return this.http.post<LocationAlert>(url, action);
  }

  public getAlerts(locationId: number): Observable<Array<LocationAlert>> {
    let url = this.locationAlertUrl + "LocationAlerts/" + locationId;
    return this.http.get<Array<LocationAlert>>(url);
  }
  public getAlert(actionId: number): Observable<LocationAlert> {
    let url = this.locationAlertUrl + "LocationAlert/" + actionId;
    return this.http.get<LocationAlert>(url);
  }

  public updateAlert(action: any): Observable<LocationAlert> {
    let url = this.locationAlertUrl + "LocationAlert/" + action.id;
    return this.http.put<LocationAlert>(url, action);
  }

  public deleteAlert(actionId: number): Observable<boolean> {
    let url = this.locationAlertUrl + "LocationAlert/" + actionId;
    return this.http.delete<boolean>(url);
  }
}
