import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditFormNineteen } from '../shared/models/audit-form-nineteen';

@Injectable({
  providedIn: 'root'
})
export class FormNineteenService {
  
  private formNineteenUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  public addForm(formNine: any): Observable<AuditFormNineteen> {
    let url = this.formNineteenUrl + "Form19";
    return this.http.post<AuditFormNineteen>(url, formNine);
  }

  public getForm(formNineId: number): Observable<AuditFormNineteen> {
    let url = this.formNineteenUrl + "Form19/" + formNineId;
    return this.http.get<AuditFormNineteen>(url);
  }

  public updateForm(formNine: any): Observable<AuditFormNineteen> {
    let url = this.formNineteenUrl + "Form19/" + formNine.id;
    return this.http.put<AuditFormNineteen>(url, formNine);
  }

  public getForms(locationId: number): Observable<Array<AuditFormNineteen>> {
    let url = this.formNineteenUrl + "Form19s/" + locationId;
    return this.http.get<Array<AuditFormNineteen>>(url);
  }

  public deleteForm(formNineId: number): Observable<boolean> {
    let url = this.formNineteenUrl + "Form19/" + formNineId;
    return this.http.delete<boolean>(url);
  }
}
