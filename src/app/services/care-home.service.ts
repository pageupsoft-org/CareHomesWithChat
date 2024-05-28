import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CareHome } from '../shared/models/care-home';
import { PageResult } from '../shared/models/PageResult';
import { RecordFilterParameter } from '../shared/models/RecordFilterParameter';

@Injectable({
  providedIn: 'root'
})
export class CareHomeService {
  private careHomeURL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public getAllCareHomes(records: RecordFilterParameter): Observable<PageResult<CareHome>> {
    let url = this.careHomeURL + "CareHomes";
    return this.http.post<PageResult<CareHome>>(url, records).pipe(map((res) => <PageResult<CareHome>>res));
  }

  public addCareHome(careHome: CareHome): Observable<CareHome> {
    let url = this.careHomeURL + "CareHome";
    return this.http.post<CareHome>(url, careHome);
  }

  public updateCareHome(careHome: CareHome): Observable<CareHome> {
    let url = this.careHomeURL + "CareHome/" + careHome.id;
    return this.http.put<CareHome>(url, careHome);
  }

  public deleteCareHome(careHomeId: number): Observable<boolean> {
    let url = this.careHomeURL + "CareHome/" + careHomeId;
    return this.http.delete<boolean>(url);
  }


  public getCareHome(careHomeId: number): Observable<CareHome> {
    let url = this.careHomeURL + "CareHome/" + careHomeId;
    return this.http.get<CareHome>(url);
  }

}
