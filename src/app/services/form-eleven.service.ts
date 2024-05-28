import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditFormEleven } from '../shared/models/audit-form-eleven';

@Injectable({
  providedIn: 'root'
})
export class FormElevenService {

  private formElevenUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  public addForm(formEleven: AuditFormEleven): Observable<AuditFormEleven> {
    let url = this.formElevenUrl + "Form11";
    return this.http.post<AuditFormEleven>(url, formEleven);
  }

  public getForm(formElevenId: number): Observable<AuditFormEleven> {
    let url = this.formElevenUrl + "Form11/" + formElevenId;
    return this.http.get<AuditFormEleven>(url);
  }

  public updateForm(formEleven: AuditFormEleven): Observable<AuditFormEleven> {
    let url = this.formElevenUrl + "Form11/" + formEleven.id;
    return this.http.put<AuditFormEleven>(url, formEleven);
  }

  public getForms(locationId: number): Observable<Array<AuditFormEleven>> {
    let url = this.formElevenUrl + "Form11s/" + locationId;
    return this.http.get<Array<AuditFormEleven>>(url);
  }

  public deleteForm(formElevenId: number): Observable<boolean> {
    let url = this.formElevenUrl + "Form11/" + formElevenId;
    return this.http.delete<boolean>(url);
  }
}
