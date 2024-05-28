import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PatientTransaction } from '../shared/models/patient-transaction';

@Injectable({
  providedIn: 'root'
})
export class PatientTransactionService {
  private transactionUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  public addTransaction(transaction: any): Observable<any> {
    let url = this.transactionUrl + "PatientTransaction";
    return this.http.post<any>(url, transaction);
  }

  public getTransaction(transactionId: number): Observable<PatientTransaction> {
    let url = this.transactionUrl + "PatientTransaction/" + transactionId;
    return this.http.get<PatientTransaction>(url);
  }

  public updateTransaction(transaction: any): Observable<PatientTransaction> {
    let url = this.transactionUrl + "PatientTransaction/" + transaction.id;
    return this.http.put<PatientTransaction>(url, transaction);
  }

  public getTransactions(patientId: number): Observable<Array<PatientTransaction>> {
    let url = this.transactionUrl + "PatientTransaction/GetByPatient/" + patientId;
    return this.http.get<Array<PatientTransaction>>(url);
  }
  public deleteTransaction(transactionId: number): Observable<boolean> {
    let url = this.transactionUrl + "PatientTransaction/" + transactionId;
    return this.http.delete<boolean>(url);
  }
}
