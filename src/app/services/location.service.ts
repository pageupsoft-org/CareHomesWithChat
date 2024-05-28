import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Location } from '../shared/models/location';

@Injectable({
  providedIn: 'root'
})
export class LocationServices {
  private locationUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }


  public addLocation(location: Location): Observable<Location> {
    let url = this.locationUrl + "Location";
    return this.http.post<Location>(url, location);
  }

  public getLocation(locationId: number): Observable<Location> {
    let url = this.locationUrl + "Location/" + locationId;
    return this.http.get<Location>(url);
  }

  public updateLocation(location: Location): Observable<Location> {
    let url = this.locationUrl + "Location/" + location.id;
    return this.http.put<Location>(url, location);
  }

  public getLocations(careHomeId: number): Observable<Array<Location>> {
    let url = this.locationUrl + "Locations/" + careHomeId;
    return this.http.get<Array<Location>>(url);
  }
  public deleteLocation(locationId: number): Observable<boolean> {
    let url = this.locationUrl + "Location/" + locationId;
    return this.http.get<boolean>(url);
  }
}
