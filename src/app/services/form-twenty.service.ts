import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditFormTwenty } from '../shared/models/audit-form-twenty';

@Injectable({
  providedIn: 'root'
})
export class FormTwentyService {

  private formTwentyUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  public addForm(formTwenty: AuditFormTwenty): Observable<AuditFormTwenty> {
    let url = this.formTwentyUrl + "Form20";
    return this.http.post<AuditFormTwenty>(url, formTwenty);
  }

  public getForm(formTwentyId: number): Observable<AuditFormTwenty> {
    let url = this.formTwentyUrl + "Form20/" + formTwentyId;
    return this.http.get<AuditFormTwenty>(url);
  }

  public updateForm(formTwenty: AuditFormTwenty): Observable<AuditFormTwenty> {
    let url = this.formTwentyUrl + "Form20/" + formTwenty.id;
    return this.http.put<AuditFormTwenty>(url, formTwenty);
  }

  public getForms(locationId: number): Observable<AuditFormTwenty[]> {
    let url = this.formTwentyUrl + "Form20s/" + locationId;
    return this.http.get<AuditFormTwenty[]>(url);
  }

  public deleteForm(formTwentyId: number): Observable<boolean> {
    let url = this.formTwentyUrl + "Form20/" + formTwentyId;
    return this.http.delete<boolean>(url);
  }
}
