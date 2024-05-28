import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditFormSeven } from '../shared/models/audit-form-seven';

@Injectable({
  providedIn: 'root'
})
export class FormSevenService {

  private formSevenUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  public addForm(formSeven: AuditFormSeven): Observable<AuditFormSeven> {
    let url = this.formSevenUrl + "Form7";
    return this.http.post<AuditFormSeven>(url, formSeven);
  }

  public getForm(formSevenId: number): Observable<AuditFormSeven> {
    let url = this.formSevenUrl + "Form7/" + formSevenId;
    return this.http.get<AuditFormSeven>(url);
  }

  public updateForm(formSeven: AuditFormSeven): Observable<AuditFormSeven> {
    let url = this.formSevenUrl + "Form7/" + formSeven.id;
    return this.http.put<AuditFormSeven>(url, formSeven);
  }

  public getForms(locationId: number): Observable<Array<AuditFormSeven>> {
    let url = this.formSevenUrl + "Form7s/" + locationId;
    return this.http.get<Array<AuditFormSeven>>(url);
  }

  public deleteForm(formSevenId: number): Observable<boolean> {
    let url = this.formSevenUrl + "Form7/" + formSevenId;
    return this.http.delete<boolean>(url);
  }
}
