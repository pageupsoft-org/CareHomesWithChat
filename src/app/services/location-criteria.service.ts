import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Criteria } from '../shared/models/criteria';

@Injectable({
  providedIn: 'root'
})
export class LocationCriteriaService {
  private locationCriteriaUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  public addCriteria(criteria: Criteria): Observable<Criteria> {
    let url = this.locationCriteriaUrl + "LocationCriteria";
    return this.http.post<Criteria>(url, criteria);
  }

  public getCriterias(locationId: number): Observable<Array<Criteria>> {
    let url = this.locationCriteriaUrl + "GetLocationCriterias/" + locationId;
    return this.http.get<Array<Criteria>>(url);
  }
  public getCriteria(criteriaId: number): Observable<Criteria> {
    let url = this.locationCriteriaUrl + "LocationCriteria/" + criteriaId;
    return this.http.get<Criteria>(url);
  }

  public updateCriteria(criteria: Criteria): Observable<Criteria> {
    let url = this.locationCriteriaUrl + "LocationCriteria/" + criteria.id;
    return this.http.put<Criteria>(url, criteria);
  }

  public deleteCriteria(criteriaId: number): Observable<boolean> {
    let url = this.locationCriteriaUrl + "LocationCriteria/" + criteriaId;
    return this.http.delete<boolean>(url);
  }
}
