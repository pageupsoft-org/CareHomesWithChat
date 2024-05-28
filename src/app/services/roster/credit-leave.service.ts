import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreditLeave } from 'src/app/shared/models/leave-management/credit-leave';
import { PageResult } from 'src/app/shared/models/PageResult';
import { userLeavesFilter } from 'src/app/shared/models/user-leaves-filter';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreditLeaveService {


  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public getCreditedLeaves(records: userLeavesFilter): Observable<PageResult<CreditLeave>> {
    let url = this.baseUrl + "CreditLeaves/GetByQuery";
    return this.http.post<PageResult<CreditLeave>>(url, records);
  }

  public creditLeaves(creditLeaves: Array<CreditLeave>): Observable<Array<CreditLeave>> {
    let url = this.baseUrl + "CreditLeave/";
    return this.http.post<Array<CreditLeave>>(url, creditLeaves);
  }

  public getById(id: number): Observable<CreditLeave> {
    let url = this.baseUrl + "CreditLeave/" + id;
    return this.http.get<CreditLeave>(url);
  }

  public update(creditLeaves: Array<CreditLeave>): Observable<Array<CreditLeave>> {
    let url = this.baseUrl + "CreditLeave/";
    return this.http.put<Array<CreditLeave>>(url, creditLeaves);
  }

  public delete(id: number): Observable<boolean> {
    let url = this.baseUrl + "CreditLeave/" + id;
    return this.http.delete<boolean>(url);
  }

  public getByFinancialYear(yearId: number): Observable<Array<CreditLeave>> {
    let url = this.baseUrl + "CreditLeaves/GetToAdd/" + yearId;
    return this.http.get<Array<CreditLeave>>(url);
  }

  public getToUpdate(yearId: number): Observable<Array<CreditLeave>> {
    let url = this.baseUrl + "CreditLeaves/GetToUpdate/" + yearId;
    return this.http.get<Array<CreditLeave>>(url);
  }
}
