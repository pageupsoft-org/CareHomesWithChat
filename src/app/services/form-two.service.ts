import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditFormTwo } from '../shared/models/audit-form-two';

@Injectable({
  providedIn: 'root'
})
export class FormTwoService {
  private formTwoUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  public addForm(formTwo: AuditFormTwo): Observable<AuditFormTwo> {
    let url = this.formTwoUrl + "Form2";
    return this.http.post<AuditFormTwo>(url, formTwo);
  }

  public getForm(formTwoId: number): Observable<AuditFormTwo> {
    let url = this.formTwoUrl + "Form2/" + formTwoId;
    return this.http.get<AuditFormTwo>(url);
  }

  public updateForm(formTwo: AuditFormTwo): Observable<AuditFormTwo> {
    let url = this.formTwoUrl + "Form2/" + formTwo.id;
    return this.http.put<AuditFormTwo>(url, formTwo);
  }

  public getForms(locationId: number): Observable<AuditFormTwo[]> {
    let url = this.formTwoUrl + "Form2s/" + locationId;
    return this.http.get<AuditFormTwo[]>(url);
  }

  public deleteForm(formTwoId: number): Observable<boolean> {
    let url = this.formTwoUrl + "Form2/" + formTwoId;
    return this.http.delete<boolean>(url);
  }
}
