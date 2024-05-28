import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Medication } from '../shared/models/medication';

@Injectable({
  providedIn: 'root'
})
export class MedicationService {

  private medicationUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  public addMedication(medication: Medication): Observable<Medication> {
    let url = this.medicationUrl + "Medication";
    return this.http.post<Medication>(url, medication);
  }

  public getMedications(patientId: number): Observable<Array<Medication>> {
    let url = this.medicationUrl + "Medications/GetByPatient/" + patientId;
    return this.http.get<Array<Medication>>(url);
  }

  public getMedication(medicationId: number): Observable<Medication> {
    let url = this.medicationUrl + "Medication/" + medicationId;
    return this.http.get<Medication>(url);
  }

  public updateMedication(medication: Medication): Observable<Medication> {
    let url = this.medicationUrl + "Medication/" + medication.id;
    return this.http.put<Medication>(url, medication);
  }

  public removeMedication(medicationId: Number): Observable<boolean> {
    let url = this.medicationUrl + "Medication/" + medicationId;
    return this.http.delete<boolean>(url);
  }
}
