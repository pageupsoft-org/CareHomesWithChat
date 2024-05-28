import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditFormFourteen } from '../shared/models/audit-form-fourteen';

@Injectable({
  providedIn: 'root'
})
export class FormFourteenService {

  private formFourteenUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public addForm(formEght: AuditFormFourteen): Observable<AuditFormFourteen> {
    let url = this.formFourteenUrl + "Form14";
    return this.http.post<AuditFormFourteen>(url, formEght);
  }

  public getForm(formFourteenId: number): Observable<AuditFormFourteen> {
    let url = this.formFourteenUrl + "Form14/" + formFourteenId;
    return this.http.get<AuditFormFourteen>(url);
  }

  public updateForm(formEght: any): Observable<AuditFormFourteen> {
    let url = this.formFourteenUrl + "Form14/" + formEght.id;
    return this.http.put<AuditFormFourteen>(url, formEght);
  }

  public getForms(locationId: number): Observable<Array<AuditFormFourteen>> {
    let url = this.formFourteenUrl + "Form14s/" + locationId;
    return this.http.get<Array<AuditFormFourteen>>(url);
  }

  public deleteForm(formFourteenId: number): Observable<boolean> {
    let url = this.formFourteenUrl + "Form14/" + formFourteenId;
    return this.http.delete<boolean>(url);
  }
}
