import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MedicationSpotCheck } from '../shared/models/medication-spot-check';

@Injectable({
  providedIn: 'root'
})
export class FormFifteenService {
  private formFifteenUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  public addForm(formFifteen: MedicationSpotCheck): Observable<MedicationSpotCheck> {
    let url = this.formFifteenUrl + "Form15";
    return this.http.post<MedicationSpotCheck>(url, formFifteen);
  }

  public getForm(formFifteenId: number): Observable<MedicationSpotCheck> {
    let url = this.formFifteenUrl + "Form15/" + formFifteenId;
    return this.http.get<MedicationSpotCheck>(url);
  }

  public updateForm(formFifteen: MedicationSpotCheck): Observable<MedicationSpotCheck> {
    let url = this.formFifteenUrl + "Form15/" + formFifteen.id;
    return this.http.put<MedicationSpotCheck>(url, formFifteen);
  }

  public getForms(patientId: number): Observable<Array<MedicationSpotCheck>> {
    let url = this.formFifteenUrl + "Form15s/" + patientId;
    return this.http.get<Array<MedicationSpotCheck>>(url);
  }

  public deleteForm(formFifteenId: number): Observable<boolean> {
    let url = this.formFifteenUrl + "Form15/" + formFifteenId;
    return this.http.delete<boolean>(url);
  }
}
