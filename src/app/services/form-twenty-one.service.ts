import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditFormTwentyOne } from '../shared/models/audit-form-twentyone';

@Injectable({
  providedIn: 'root'
})
export class FormTwentyOneService {
  private form21Url = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public addForm(form21: AuditFormTwentyOne): Observable<AuditFormTwentyOne> {
    let url = this.form21Url + "Form21";
    return this.http.post<AuditFormTwentyOne>(url, form21);
  }

  public getForm(form21Id: number): Observable<AuditFormTwentyOne> {
    let url = this.form21Url + "Form21/" + form21Id;
    return this.http.get<AuditFormTwentyOne>(url);
  }

  public updateForm(form21: AuditFormTwentyOne): Observable<AuditFormTwentyOne> {
    let url = this.form21Url + "Form21/" + form21.id;
    return this.http.put<AuditFormTwentyOne>(url, form21);
  }

  public getForms(locationId: number): Observable<Array<AuditFormTwentyOne>> {
    let url = this.form21Url + "Form21s/" + locationId;
    return this.http.get<Array<AuditFormTwentyOne>>(url);
  }

  public deleteForm(form21Id: number): Observable<boolean> {
    let url = this.form21Url + "Form21/" + form21Id;
    return this.http.delete<boolean>(url);
  }
}
