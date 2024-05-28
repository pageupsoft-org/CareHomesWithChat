import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MedicationAudit } from '../shared/models/medication-audit';

@Injectable({
  providedIn: 'root'
})
export class FormThirteenService {
  private formThirteenUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  public addForm(formThirteen: MedicationAudit): Observable<MedicationAudit> {
    let url = this.formThirteenUrl + "Form13";
    return this.http.post<MedicationAudit>(url, formThirteen);
  }

  public getForm(formThirteenId: number): Observable<MedicationAudit> {
    let url = this.formThirteenUrl + "Form13/" + formThirteenId;
    return this.http.get<MedicationAudit>(url);
  }

  public updateForm(formThirteen: MedicationAudit): Observable<MedicationAudit> {
    let url = this.formThirteenUrl + "Form13/" + formThirteen.id;
    return this.http.put<MedicationAudit>(url, formThirteen);
  }

  public getForms(patientId: number): Observable<Array<MedicationAudit>> {
    let url = this.formThirteenUrl + "Form13s/" + patientId;
    return this.http.get<Array<MedicationAudit>>(url);
  }

  public deleteForm(formThirteenId: number): Observable<boolean> {
    let url = this.formThirteenUrl + "Form13/" + formThirteenId;
    return this.http.delete<boolean>(url);
  }
}
