import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditFormNine } from '../shared/models/audit-form-nine';

@Injectable({
  providedIn: 'root'
})
export class FormNineService {

  private formNineUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  public addForm(formNine: any): Observable<AuditFormNine> {
    let url = this.formNineUrl + "Form9";
    return this.http.post<AuditFormNine>(url, formNine);
  }

  public getForm(formNineId: number): Observable<AuditFormNine> {
    let url = this.formNineUrl + "Form9/" + formNineId;
    return this.http.get<AuditFormNine>(url);
  }

  public updateForm(formNine: any): Observable<AuditFormNine> {
    let url = this.formNineUrl + "Form9/" + formNine.id;
    return this.http.put<AuditFormNine>(url, formNine);
  }

  public getForms(locationId: number): Observable<Array<AuditFormNine>> {
    let url = this.formNineUrl + "Form9s/" + locationId;
    return this.http.get<Array<AuditFormNine>>(url);
  }

  public deleteForm(formNineId: number): Observable<boolean> {
    let url = this.formNineUrl + "Form9/" + formNineId;
    return this.http.delete<boolean>(url);
  }
}
