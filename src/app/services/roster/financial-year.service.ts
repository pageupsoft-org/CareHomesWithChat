import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinancialYear } from 'src/app/shared/models/leave-management/financial-year';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinancialYearService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public getFinancialYears(): Observable<Array<FinancialYear>> {
    let url = this.baseUrl + "GetFinancialYears/";
    return this.http.get<Array<FinancialYear>>(url);
  }

  public addFinancialYear(financialYear: FinancialYear): Observable<FinancialYear> {
    let url = this.baseUrl + "PostFinancialYear/";
    return this.http.post<FinancialYear>(url, financialYear);
  }

  public getFinancialYear(yearId: number): Observable<FinancialYear> {
    let url = this.baseUrl + "FinancialYear/" + yearId;
    return this.http.get<FinancialYear>(url);
  }

  public updateFinancialYear(financialYear: FinancialYear): Observable<FinancialYear> {
    let url = this.baseUrl + "FinancialYear/" + financialYear.id;
    return this.http.put<FinancialYear>(url, financialYear);
  }

  public deleteFinancialYear(yearId: number): Observable<boolean> {
    let url = this.baseUrl + "FinancialYear/" + yearId;
    return this.http.delete<boolean>(url);
  }

  public setFinancialYear(yearId: number): Observable<boolean> {
    let url = this.baseUrl + "SetCurrentFinanacialYear/" + yearId;
    return this.http.put<boolean>(url, yearId);
  }

}
