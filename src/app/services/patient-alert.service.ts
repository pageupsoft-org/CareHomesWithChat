import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PatientAlert } from '../shared/models/patient-alert';

@Injectable({
  providedIn: 'root',
})
export class PatientAlertService {
  private patientAlertUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  public getPatientAlerts(patientId: number): Observable<Array<PatientAlert>> {
    let url = this.patientAlertUrl + 'PatientAlerts/' + patientId;
    return this.http.get<Array<PatientAlert>>(url);
  }

  public addPatientAlert(patientAlert: PatientAlert): Observable<PatientAlert> {
    let url = this.patientAlertUrl + 'PatientAlert';
    return this.http.post<PatientAlert>(url, patientAlert);
  }

  public getPatientAlert(patientAlertId: number): Observable<PatientAlert> {
    let url = this.patientAlertUrl + 'PatientAlert/' + patientAlertId;
    return this.http.get<PatientAlert>(url);
  }

  public updatePatientAlert(patientAlert: PatientAlert): Observable<PatientAlert> {
    let url = this.patientAlertUrl + 'PatientAlert/' + patientAlert.id;
    return this.http.put<PatientAlert>(url, patientAlert);
  }

  public deletePatientAlert(patientAlertId: number): Observable<boolean> {
    let url = this.patientAlertUrl + 'PatientAlert/' + patientAlertId;
    return this.http.delete<boolean>(url);
  }

  public getPatientByLocation(locationId: number): Observable<Array<PatientAlert>> {
    let url =
      this.patientAlertUrl + 'PatientAlerts/GetByLocation/' + locationId;
    return this.http.get<Array<PatientAlert>>(url);
  }
  
  public chartService1(locationId: number): Observable<any> {
    let url = this.patientAlertUrl + 'PatientAlert/ChartService1/' + locationId;
    return this.http.get<any>(url);
  }
}
