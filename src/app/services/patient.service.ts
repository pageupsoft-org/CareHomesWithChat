import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PatientAdmission } from '../shared/models/patient-admission';
import { PageResult } from '../shared/models/PageResult';
import { RecordFilterParameter } from '../shared/models/RecordFilterParameter';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private patientUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public getAllPatients(records: RecordFilterParameter,careHomeId: number): Observable<PageResult<PatientAdmission>> {
    let url = this.patientUrl + 'Patients/' + careHomeId;
    return this.http.post<PageResult<PatientAdmission>>(url, records);
  }

  public addPatient(patient: PatientAdmission): Observable<PatientAdmission> {
    let url = this.patientUrl + 'Patient';
    return this.http.post<PatientAdmission>(url, patient);
  }

  public updatePatient(patient: PatientAdmission): Observable<PatientAdmission> {
    let url = this.patientUrl + 'Patient/' + patient.id;
    return this.http.put<PatientAdmission>(url, patient);
  }

  public deletePatient(patientId: number): Observable<boolean> {
    let url = this.patientUrl + 'Patient/' + patientId;
    return this.http.delete<boolean>(url);
  }

  public getPatient(patientId: number): Observable<PatientAdmission> {
    let url = this.patientUrl + 'Patient/' + patientId;
    return this.http.get<PatientAdmission>(url);
  }

  public getPatients(locationId: number): Observable<any> {
    let url = this.patientUrl + 'Patients/GetByLocation/' + locationId;
    return this.http.post<any>(url, locationId);
  }

  public getPatientsWithAlert(careHomeId: number): Observable<Array<PatientAdmission>> {
    let url = this.patientUrl + 'Patients/GetPatientsWithAlert/' + careHomeId;
    return this.http.get<Array<PatientAdmission>>(url);
  }

  public getPatientZoneCount(locationId: number): Observable<any> {
    let url = this.patientUrl + 'Patient/GetPatientZoneCount/' + locationId;
    return this.http.get<any>(url);
  }
}
