import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditFormEight } from '../shared/models/audit-form-eight';
import { AuditFormFourteen } from '../shared/models/audit-form-fourteen';
import { AuditFormNine } from '../shared/models/audit-form-nine';
import { AuditFormSeven } from '../shared/models/audit-form-seven';
import { AuditFormSixteen } from '../shared/models/audit-form-sixteen';
import { AuditFormTen } from '../shared/models/audit-form-ten';
import { AuditFormTwelve } from '../shared/models/audit-form-twelve';
import { AuditFormTwo } from '../shared/models/audit-form-two';
import { FunctionalChecklist } from '../shared/models/functional-checklist';
import { MedicationAudit } from '../shared/models/medication-audit';
import { MedicationStockRecord } from '../shared/models/medication-stock-record';
import { MySharedPathway } from '../shared/models/my-shared-pathway';
import { PatientAdmission } from '../shared/models/patient-admission';
import { PatientTransaction } from '../shared/models/patient-transaction';
import { ProgressNote } from '../shared/models/progress-note';
import { RecoveryStar } from '../shared/models/recovery-star';
import { RiskAssessment } from '../shared/models/risk-assessment';
import { WeeklyMedicationStockCheck } from '../shared/models/weekly-medication-stock-check';

@Injectable({
  providedIn: 'root'
})
export class SignOffService {

  private signOffUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public getPatientsForms(userId: number): Observable<Array<PatientAdmission>> {
    let url = this.signOffUrl + "Patients/GetPendingSignoff/" + userId;
    return this.http.post<Array<PatientAdmission>>(url, userId);
  }

  public getRiskAssessmentForms(userId: number): Observable<Array<RiskAssessment>> {
    let url = this.signOffUrl + "RiskAssessments/GetPendingSignoff/" + userId;
    return this.http.post<Array<RiskAssessment>>(url, userId);
  }

  public getSharedPathwaysForms(userId: number): Observable<Array<MySharedPathway>> {
    let url = this.signOffUrl + "SharedPathways/GetPendingSignoff/" + userId;
    return this.http.post<Array<MySharedPathway>>(url, userId);
  }

  public getRecoveryStarsForms(userId: number): Observable<Array<RecoveryStar>> {
    let url = this.signOffUrl + "RecoveryStars/GetPendingSignoff/" + userId;
    return this.http.post<Array<RecoveryStar>>(url, userId);
  }

  public getProgressNotesForms(userId: number): Observable<Array<ProgressNote>> {
    let url = this.signOffUrl + "ProgressNotes/GetPendingSignoff/" + userId;
    return this.http.post<Array<ProgressNote>>(url, userId);
  }

  public getMoveOnFunctionalForms(userId: number): Observable<Array<FunctionalChecklist>> {
    let url = this.signOffUrl + "MoveOnFunctionals/GetPendingSignoff/" + userId;
    return this.http.post<Array<FunctionalChecklist>>(url, userId);
  }

  public getPatientTransactionsForms(userId: number): Observable<Array<PatientTransaction>> {
    let url = this.signOffUrl + "PatientTransactions/GetPendingSignoff/" + userId;
    return this.http.post<Array<PatientTransaction>>(url, userId);
  }

  // audit forms
  public getForm13(userId: number): Observable<Array<MedicationAudit>> {
    let url = this.signOffUrl + "Form13s/GetPendingSignoff/" + userId;
    return this.http.post<Array<MedicationAudit>>(url, userId);
  }
  public getForm15(userId: number): Observable<Array<MedicationStockRecord>> {
    let url = this.signOffUrl + "Form15s/GetPendingSignoff/" + userId;
    return this.http.post<Array<MedicationStockRecord>>(url, userId);
  }
  public getForm17(userId: number): Observable<Array<WeeklyMedicationStockCheck>> {
    let url = this.signOffUrl + "Form17s/GetPendingSignoff/" + userId;
    return this.http.post<Array<WeeklyMedicationStockCheck>>(url, userId);
  }

  // Location audit forms 

  public getForm2(userId: number): Observable<Array<AuditFormTwo>> {
    let url = this.signOffUrl + "Form2s/GetPendingSignoff/" + userId;
    return this.http.post<Array<AuditFormTwo>>(url, userId);
  }
  public getForm7(userId: number): Observable<Array<AuditFormSeven>> {
    let url = this.signOffUrl + "Form7s/GetPendingSignoff/" + userId;
    return this.http.post<Array<AuditFormSeven>>(url, userId);
  }
  public getForm8(userId: number): Observable<Array<AuditFormEight>> {
    let url = this.signOffUrl + "Form8s/GetPendingSignoff/" + userId;
    return this.http.post<Array<AuditFormEight>>(url, userId);
  }

  public getForm9(userId: number): Observable<Array<AuditFormNine>> {
    let url = this.signOffUrl + "Form9s/GetPendingSignoff/" + userId;
    return this.http.post<Array<AuditFormNine>>(url, userId);
  }

  public getForm10(userId: number): Observable<Array<AuditFormTen>> {
    let url = this.signOffUrl + "Form10s/GetPendingSignoff/" + userId;
    return this.http.post<Array<AuditFormTen>>(url, userId);
  }

  public getForm12(userId: number): Observable<Array<AuditFormTwelve>> {
    let url = this.signOffUrl + "Form12s/GetPendingSignoff/" + userId;
    return this.http.post<Array<AuditFormTwelve>>(url, userId);
  }


  public getForm14(userId: number): Observable<Array<AuditFormFourteen>> {
    let url = this.signOffUrl + "Form14s/GetPendingSignoff/" + userId;
    return this.http.post<Array<AuditFormFourteen>>(url, userId);
  }

  public getForm11(userId: number): Observable<Array<AuditFormSixteen>> {
    let url = this.signOffUrl + "Form11s/GetPendingSignoff/" + userId;
    return this.http.post<Array<AuditFormSixteen>>(url, userId);
  }

  public getForm19(userId: number): Observable<Array<AuditFormSixteen>> {
    let url = this.signOffUrl + "Form19s/GetPendingSignoff/" + userId;
    return this.http.post<Array<AuditFormSixteen>>(url, userId);
  }

  public getForm20(userId: number): Observable<Array<AuditFormSixteen>> {
    let url = this.signOffUrl + "Form20s/GetPendingSignoff/" + userId;
    return this.http.post<Array<AuditFormSixteen>>(url, userId);
  }

  public getForm21(userId: number): Observable<Array<AuditFormSixteen>> {
    let url = this.signOffUrl + "Form21s/GetPendingSignoff/" + userId;
    return this.http.post<Array<AuditFormSixteen>>(url, userId);
  }

  public getForm16(userId: number): Observable<Array<AuditFormSixteen>> {
    let url = this.signOffUrl + "Form16s/GetPendingSignoff/" + userId;
    return this.http.post<Array<AuditFormSixteen>>(url, userId);
  }

}
