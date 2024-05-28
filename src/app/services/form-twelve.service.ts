import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditFormTwelve } from '../shared/models/audit-form-twelve';

@Injectable({
  providedIn: 'root'
})
export class FormTwelveService {

  private formTwelveUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  public addForm(formTwelve: AuditFormTwelve): Observable<AuditFormTwelve> {
    let url = this.formTwelveUrl + "Form12";
    return this.http.post<AuditFormTwelve>(url, formTwelve);
  }

  public getForm(formTwelveId: number): Observable<AuditFormTwelve> {
    let url = this.formTwelveUrl + "Form12/" + formTwelveId;
    return this.http.get<AuditFormTwelve>(url);
  }

  public updateForm(formTwelve: AuditFormTwelve): Observable<AuditFormTwelve> {
    let url = this.formTwelveUrl + "Form12/" + formTwelve.id;
    return this.http.put<AuditFormTwelve>(url, formTwelve);
  }

  public getForms(patientId: number): Observable<Array<AuditFormTwelve>> {
    let url = this.formTwelveUrl + "Form12s/" + patientId;
    return this.http.get<Array<AuditFormTwelve>>(url);
  }

  public deleteForm(formTwelveId: number): Observable<boolean> {
    let url = this.formTwelveUrl + "Form12/" + formTwelveId;
    return this.http.delete<boolean>(url);
  }
}
