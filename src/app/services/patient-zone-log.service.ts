import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PatientZoneLog } from '../shared/models/patient-zoning-log';

@Injectable({
  providedIn: 'root',
})
export class PatientZoneLogService {
  private zoneLogUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public getPatientLogs(patientId: number): Observable<Array<PatientZoneLog>> {
    let url = this.zoneLogUrl + 'PatientZoneLogs/' + patientId;
    return this.http.get<Array<PatientZoneLog>>(url);
  }

  public getZoneLog(zoneLogId: number): Observable<PatientZoneLog> {
    let url = this.zoneLogUrl + 'PatientZoneLog/' + zoneLogId;
    return this.http.get<PatientZoneLog>(url);
  }

  public addZoneLog(zoneLog: PatientZoneLog): Observable<PatientZoneLog> {
    let url = this.zoneLogUrl + 'PatientZoneLog';
    return this.http.post<PatientZoneLog>(url, zoneLog);
  }

  public deleteZoneLog(zoneLogId: number): Observable<boolean> {
    let url = this.zoneLogUrl + 'PatientZoneLog/' + zoneLogId;
    return this.http.delete<boolean>(url);
  }

  public getLatestLog(patientId: number): Observable<PatientZoneLog> {
    let url = this.zoneLogUrl + 'PatientZoneLog/Latest/' + patientId;
    return this.http.get<PatientZoneLog>(url);
  }
}
