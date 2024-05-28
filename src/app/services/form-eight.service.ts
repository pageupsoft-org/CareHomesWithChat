import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditFormEight } from '../shared/models/audit-form-eight';

@Injectable({
  providedIn: 'root'
})
export class FormEightService {

  private formEightUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public addForm(formEght: any): Observable<AuditFormEight> {
    let url = this.formEightUrl + "Form8";
    return this.http.post<AuditFormEight>(url, formEght);
  }

  public getForm(formEightId: number): Observable<AuditFormEight> {
    let url = this.formEightUrl + "Form8/" + formEightId;
    return this.http.get<AuditFormEight>(url);
  }

  public updateForm(formEght: any): Observable<AuditFormEight> {
    let url = this.formEightUrl + "Form8/" + formEght.id;
    return this.http.put<AuditFormEight>(url, formEght);
  }

  public getForms(locationId: number): Observable<Array<AuditFormEight>> {
    let url = this.formEightUrl + "Form8s/" + locationId;
    return this.http.get<Array<AuditFormEight>>(url);
  }

  public deleteForm(formEightId: number): Observable<boolean> {
    let url = this.formEightUrl + "Form8/" + formEightId;
    return this.http.delete<boolean>(url);
  }
}
