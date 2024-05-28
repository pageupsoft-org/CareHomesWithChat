import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocationAction } from '../shared/models/location-action';

@Injectable({
  providedIn: 'root'
})
export class LocationActionService {
  private locationActionUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  public addAction(action: any): Observable<LocationAction> {
    let url = this.locationActionUrl + "LocationAction";
    return this.http.post<LocationAction>(url, action);
  }

  public getActions(locationId: number): Observable<Array<LocationAction>> {
    let url = this.locationActionUrl + "LocationActions/" + locationId;
    return this.http.get<Array<LocationAction>>(url);
  }
  public getAction(actionId: number): Observable<LocationAction> {
    let url = this.locationActionUrl + "LocationAction/" + actionId;
    return this.http.get<LocationAction>(url);
  }

  public updateAction(action: any): Observable<LocationAction> {
    let url = this.locationActionUrl + "LocationAction/" + action.id;
    return this.http.put<LocationAction>(url, action);
  }

  public deleteAction(actionId: number): Observable<boolean> {
    let url = this.locationActionUrl + "LocationAction/" + actionId;
    return this.http.delete<boolean>(url);
  }
}
