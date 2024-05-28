import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { RiskAssessment } from '../shared/models/risk-assessment';

@Injectable({
  providedIn: 'root'
})
export class RiskAssessmentService {
  private riskAssessmentUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  public addRiskAssessment(riskAssessment: RiskAssessment): Observable<RiskAssessment> {
    let url = this.riskAssessmentUrl + "RiskAssessment";
    return this.http.post<RiskAssessment>(url, riskAssessment);
  }

  public updateRiskAssessment(riskAssessment: RiskAssessment): Observable<RiskAssessment> {
    let url = this.riskAssessmentUrl + "RiskAssessment/" + riskAssessment.id;
    return this.http.put<RiskAssessment>(url, riskAssessment);
  }

  public deleteRiskAssessment(riskAssessmentId: number): Observable<boolean> {
    let url = this.riskAssessmentUrl + 'RiskAssessment/' + riskAssessmentId;
    return this.http.delete<boolean>(url);
  }

  public getRiskAssessments(riskAssessmentId: number): Observable<Array<RiskAssessment>> {
    let url = this.riskAssessmentUrl + 'RiskAssessment/GetByPatient/' + riskAssessmentId;
    return this.http.get<Array<RiskAssessment>>(url);
  }
  public getRiskAssessment(riskAssessmentId: number): Observable<RiskAssessment> {
    let url = this.riskAssessmentUrl + 'RiskAssessment/' + riskAssessmentId;
    return this.http.get<RiskAssessment>(url);
  }

  public getLatestRiskAssessment(patientId: number): Observable<RiskAssessment> {
    let url = this.riskAssessmentUrl + 'RiskAssessment/GetLatestAssessment/' + patientId;
    return this.http.get<RiskAssessment>(url);
  }
  public getPreviousAssessment(riskAssessmentId: number): Observable<RiskAssessment> {
    let url = this.riskAssessmentUrl + 'RiskAssessment/GetPreviousAssessment/' + riskAssessmentId;
    return this.http.get<RiskAssessment>(url);
  }
}
