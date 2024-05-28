import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditFormSixteen } from '../shared/models/audit-form-sixteen';

@Injectable({ providedIn: 'root' })

export class FormSixteenService {
  private formSixteenUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public addForm(formSixteen: AuditFormSixteen): Observable<AuditFormSixteen> {
    let url = this.formSixteenUrl + "Form16";
    return this.http.post<AuditFormSixteen>(url, formSixteen);
  }

  public getForm(formSixteenId: number): Observable<AuditFormSixteen> {
    let url = this.formSixteenUrl + "Form16/" + formSixteenId;
    return this.http.get<AuditFormSixteen>(url);
  }

  public updateForm(formSixteen: AuditFormSixteen): Observable<AuditFormSixteen> {
    let url = this.formSixteenUrl + "Form16/" + formSixteen.id;
    return this.http.put<AuditFormSixteen>(url, formSixteen);
  }

  public getForms(patientId: number): Observable<Array<AuditFormSixteen>> {
    let url = this.formSixteenUrl + "Form16s/" + patientId;
    return this.http.get<Array<AuditFormSixteen>>(url);
  }

  public deleteForm(formSixteenId: number): Observable<boolean> {
    let url = this.formSixteenUrl + "Form16/" + formSixteenId;
    return this.http.delete<boolean>(url);
  }
}
