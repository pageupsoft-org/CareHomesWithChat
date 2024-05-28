import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditFormTen } from '../shared/models/audit-form-ten';

@Injectable({
  providedIn: 'root'
})
export class FormTenService {

  private formTenUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  public addForm(formTen: AuditFormTen): Observable<AuditFormTen> {
    let url = this.formTenUrl + "Form10";
    return this.http.post<AuditFormTen>(url, formTen);
  }

  public getForm(formTenId: number): Observable<AuditFormTen> {
    let url = this.formTenUrl + "Form10/" + formTenId;
    return this.http.get<AuditFormTen>(url);
  }

  public updateForm(formTen: AuditFormTen): Observable<AuditFormTen> {
    let url = this.formTenUrl + "Form10/" + formTen.id;
    return this.http.put<AuditFormTen>(url, formTen);
  }

  public getForms(locationId: number): Observable<Array<AuditFormTen>> {
    let url = this.formTenUrl + "Form10s/" + locationId;
    return this.http.get<Array<AuditFormTen>>(url);
  }

  public deleteForm(formTenId: number): Observable<boolean> {
    let url = this.formTenUrl + "Form10/" + formTenId;
    return this.http.delete<boolean>(url);
  }
}
