import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WeeklyMedicationStockCheck } from '../shared/models/weekly-medication-stock-check';

@Injectable({
  providedIn: 'root'
})
export class FormSeventeenService {
  private formSeventeenUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public addForm(formSeventeen: WeeklyMedicationStockCheck): Observable<WeeklyMedicationStockCheck> {
    let url = this.formSeventeenUrl + "Form17";
    return this.http.post<WeeklyMedicationStockCheck>(url, formSeventeen);
  }

  public getForm(formSeventeenId: number): Observable<WeeklyMedicationStockCheck> {
    let url = this.formSeventeenUrl + "Form17/" + formSeventeenId;
    return this.http.get<WeeklyMedicationStockCheck>(url);
  }

  public updateForm(formSeventeen: WeeklyMedicationStockCheck): Observable<WeeklyMedicationStockCheck> {
    let url = this.formSeventeenUrl + "Form17/" + formSeventeen.id;
    return this.http.put<WeeklyMedicationStockCheck>(url, formSeventeen);
  }

  public getForms(patientId: number): Observable<Array<WeeklyMedicationStockCheck>> {
    let url = this.formSeventeenUrl + "Form17s/" + patientId;
    return this.http.get<Array<WeeklyMedicationStockCheck>>(url);
  }

  public deleteForm(formSeventeenId: number): Observable<boolean> {
    let url = this.formSeventeenUrl + "Form17/" + formSeventeenId;
    return this.http.delete<boolean>(url);
  }
}
