import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditFormEight } from '../shared/models/audit-form-eight';
import { AuditFormEleven } from '../shared/models/audit-form-eleven';
import { AuditFormFourteen } from '../shared/models/audit-form-fourteen';
import { AuditFormNine } from '../shared/models/audit-form-nine';
import { AuditFormNineteen } from '../shared/models/audit-form-nineteen';
import { AuditFormSeven } from '../shared/models/audit-form-seven';
import { AuditFormSixteen } from '../shared/models/audit-form-sixteen';
import { AuditFormTen } from '../shared/models/audit-form-ten';
import { AuditFormTwelve } from '../shared/models/audit-form-twelve';
import { AuditFormTwenty } from '../shared/models/audit-form-twenty';
import { AuditFormTwentyOne } from '../shared/models/audit-form-twentyone';
import { AuditFormTwo } from '../shared/models/audit-form-two';
import { CareHomeLimit } from '../shared/models/care-home-limit';
import { CareHomeReportsFilter } from '../shared/models/care-home-reports-filter';
import { CareHomeUserLog } from '../shared/models/care-home-user-log';
import { LocationPatientStatus } from '../shared/models/location-patient-status';
import { MedicationAudit } from '../shared/models/medication-audit';
import { MedicationSpotCheck } from '../shared/models/medication-spot-check';
import { MedicationStatistics } from '../shared/models/medication-statistics';
import { PageResult } from '../shared/models/PageResult';
import { PatientCarePlan } from '../shared/models/patient-care-plan';
import { PatientZonalCount } from '../shared/models/patient-zonal-count';
import { ReportStatistics } from '../shared/models/report-statistics';
import { PatientReportFilterParameter } from '../shared/models/service-user-report-filter-parameter';
import { UserLoggedInReport } from '../shared/models/user-logged-in';
import { WeeklyMedicationStockCheck } from '../shared/models/weekly-medication-stock-check';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private signOffUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public getPatientStatusCount(careHomeId: number, userId?: number): Observable<Array<LocationPatientStatus>> {
    let url: string;
    if (userId) {
      url = this.signOffUrl + "Location/GetPatientStatusCount/" + careHomeId + "?userId=" + userId;
    } else {
      url = this.signOffUrl + "Location/GetPatientStatusCount/" + careHomeId;
    }
    return this.http.get<Array<LocationPatientStatus>>(url);
  }

  public getPatientZonalCount(careHomeId: number, userId?: number): Observable<PatientZonalCount> {
    let url: string;
    if (userId) {
      url = this.signOffUrl + "Patient/GetPatientZonalCount/" + careHomeId + "?userId=" + userId;
    } else {
      url = this.signOffUrl + "Patient/GetPatientZonalCount/" + careHomeId;
    }
    return this.http.get<PatientZonalCount>(url);
  }

  // Panding Audit Form services

  public getPendingAuditForm2(userId: number): Observable<Array<AuditFormTwo>> {
    let url = this.signOffUrl + "Form2s/GetPendingAudit/" + userId;
    return this.http.post<Array<AuditFormTwo>>(url, userId);
  }

  public getPendingAuditForm7(userId: number): Observable<Array<AuditFormSeven>> {
    let url = this.signOffUrl + "Form7s/GetPendingAudit/" + userId;
    return this.http.post<Array<AuditFormSeven>>(url, userId);
  }

  public getPendingAuditForm8(userId: number): Observable<Array<AuditFormEight>> {
    let url = this.signOffUrl + "Form8s/GetPendingAudit/" + userId;
    return this.http.post<Array<AuditFormEight>>(url, userId);
  }

  public getPendingAuditForm9(userId: number): Observable<Array<AuditFormNine>> {
    let url = this.signOffUrl + "Form9s/GetPendingAudit/" + userId;
    return this.http.post<Array<AuditFormNine>>(url, userId);
  }

  public getPendingAuditForm10(userId: number): Observable<Array<AuditFormTen>> {
    let url = this.signOffUrl + "Form10s/GetPendingAudit/" + userId;
    return this.http.post<Array<AuditFormTen>>(url, userId);
  }

  public getPendingAuditForm12(userId: number): Observable<Array<AuditFormTwelve>> {
    let url = this.signOffUrl + "Form12s/GetPendingAudit/" + userId;
    return this.http.post<Array<AuditFormTwelve>>(url, userId);
  }

  public getPendingAuditForm13(userId: number): Observable<Array<MedicationAudit>> {
    let url = this.signOffUrl + "Form13s/GetPendingAudit/" + userId;
    return this.http.post<Array<MedicationAudit>>(url, userId);
  }

  public getPendingAuditForm14(userId: number): Observable<Array<AuditFormFourteen>> {
    let url = this.signOffUrl + "Form14s/GetPendingAudit/" + userId;
    return this.http.post<Array<AuditFormFourteen>>(url, userId);
  }

  public getPendingAuditForm15(userId: number): Observable<Array<MedicationSpotCheck>> {
    let url = this.signOffUrl + "Form15s/GetPendingAudit/" + userId;
    return this.http.post<Array<MedicationSpotCheck>>(url, userId);
  }

  public getPendingAuditForm16(userId: number): Observable<Array<AuditFormSixteen>> {
    let url = this.signOffUrl + "Form16s/GetPendingAudit/" + userId;
    return this.http.post<Array<AuditFormSixteen>>(url, userId);
  }

  public getPendingAuditForm17(userId: number): Observable<Array<WeeklyMedicationStockCheck>> {
    let url = this.signOffUrl + "Form17s/GetPendingAudit/" + userId;
    return this.http.post<Array<WeeklyMedicationStockCheck>>(url, userId);
  }

  public getPendingAuditForm11(userId: number): Observable<Array<AuditFormEleven>> {
    let url = this.signOffUrl + "Form11s/GetPendingAudit/" + userId;
    return this.http.post<Array<AuditFormEleven>>(url, userId);
  }

  public getPendingAuditForm19(userId: number): Observable<Array<AuditFormNineteen>> {
    let url = this.signOffUrl + "Form19s/GetPendingAudit/" + userId;
    return this.http.post<Array<AuditFormNineteen>>(url, userId);
  }

  public getPendingAuditForm20(userId: number): Observable<Array<AuditFormTwenty>> {
    let url = this.signOffUrl + "Form20s/GetPendingAudit/" + userId;
    return this.http.post<Array<AuditFormTwenty>>(url, userId);
  }

  public getPendingAuditForm21(userId: number): Observable<Array<AuditFormTwentyOne>> {
    let url = this.signOffUrl + "Form21s/GetPendingAudit/" + userId;
    return this.http.post<Array<AuditFormTwentyOne>>(url, userId);
  }


  public serviceUserStatistics(careHomeId: number, userId?: number): Observable<Array<ReportStatistics>> {
    let url: string;
    if (userId) {
      url = this.signOffUrl + "Audit/serviceUserStatistics/" + careHomeId + "?userId=" + userId;
    } else {
      url = this.signOffUrl + "Audit/serviceUserStatistics/" + careHomeId;
    }
    return this.http.get<Array<ReportStatistics>>(url);
  }

  public locationStatistics(careHomeId: number, userId?: number): Observable<Array<ReportStatistics>> {
    let url: string;
    if (userId) {
      url = this.signOffUrl + "Audit/locationStatistics/" + careHomeId + "?userId=" + userId;
    } else {
      url = this.signOffUrl + "Audit/locationStatistics/" + careHomeId;
    }
    return this.http.get<Array<ReportStatistics>>(url);
  }

  public getUpcomingRiskAssessments(careHomeId: number, userId?: number): Observable<Array<ReportStatistics>> {
    let url: string;
    if (userId) {
      url = this.signOffUrl + "RiskAssessments/GetUpcomingRiskAssessments/" + careHomeId + "?userId=" + userId;
    } else {
      url = this.signOffUrl + "RiskAssessments/GetUpcomingRiskAssessments/" + careHomeId;
    }
    return this.http.get<Array<ReportStatistics>>(url);
  }

  public activePatientLog(careHomeId: number, userId?: number): Observable<Array<any>> {
    let url: string;
    if (userId) {
      url = this.signOffUrl + "Locations/ActivePatientLog/" + careHomeId + "?userId=" + userId;
    } else {
      url = this.signOffUrl + "Locations/ActivePatientLog/" + careHomeId;
    }
    return this.http.get<Array<any>>(url);
  }

  public upcomingCarePlan(careHomeId: number, userId?: number): Observable<Array<ReportStatistics>> {
    let url: string;
    if (userId) {
      url = this.signOffUrl + "Audit/UpcomingCarePlan/" + careHomeId + "?userId=" + userId;
    } else {
      url = this.signOffUrl + "Audit/UpcomingCarePlan/" + careHomeId;
    }
    return this.http.get<Array<ReportStatistics>>(url);
  }

  public upcomingMedication(careHomeId: number, userId?: number): Observable<Array<MedicationStatistics>> {
    let url: string;
    if (userId) {
      url = this.signOffUrl + "UpcomingMedication/" + careHomeId + "?userId=" + userId;
    } else {
      url = this.signOffUrl + "UpcomingMedication/" + careHomeId;
    }
    return this.http.get<Array<MedicationStatistics>>(url);
  }

  public getLongestActiveCases(careHomeId: number, userId?: number): Observable<Array<any>> {
    let url: string;
    if (userId) {
      url = this.signOffUrl + "Patient/GetLongestActiveCases/" + careHomeId + "?userId=" + userId;
    } else {
      url = this.signOffUrl + "Patient/GetLongestActiveCases/" + careHomeId;
    }
    return this.http.get<Array<any>>(url);
  }

  public completedCarePlan(carePlanFilter: PatientReportFilterParameter): Observable<PageResult<PatientCarePlan>> {
    let url = this.signOffUrl + "Audit/FilterCarePlan";
    return this.http.post<PageResult<PatientCarePlan>>(url, carePlanFilter);
  }

  public completedRiskAssessments(carePlanFilter: PatientReportFilterParameter): Observable<PageResult<PatientCarePlan>> {
    let url = this.signOffUrl + "RiskAssessments/GetCompletedRiskAssessments";
    return this.http.post<PageResult<PatientCarePlan>>(url, carePlanFilter);
  }

  public updateLogByUsers(careHomeId: number, userId?: number): Observable<Array<any>> {
    let url: string;
    if (userId) {
      url = this.signOffUrl + "UpdateLogByUser/" + careHomeId + "?userId=" + userId;
    } else {
      url = this.signOffUrl + "UpdateLogByUser/" + careHomeId;
    }
    return this.http.get<Array<any>>(url);
  }

  public userLoginLog(careHomeId: number, userId?: number): Observable<Array<UserLoggedInReport>> {
    let url = this.signOffUrl + "LoginLog/" + careHomeId;
    return this.http.get<Array<UserLoggedInReport>>(url);
  }

  public patientStatusAverage(careHomeId: number, userId?: number): Observable<any> {
    let url: string;
    if (userId) {
      url = this.signOffUrl + "Patients/StatusAverage/" + careHomeId + "?userId=" + userId;
    } else {
      url = this.signOffUrl + "Patients/StatusAverage/" + careHomeId;
    }
    return this.http.get<any>(url);
  }

  public getCareHomeLimits(filterRecords: CareHomeReportsFilter): Observable<PageResult<CareHomeLimit>> {
    let url = this.signOffUrl + "CareHomes/Getlimit/";
    return this.http.post<PageResult<CareHomeLimit>>(url, filterRecords);
  }

  // location wise user count
  public getCareHomeUsers(recordFilters: CareHomeReportsFilter): Observable<PageResult<CareHomeUserLog>> {
    let url = this.signOffUrl + "CareHome/UserLogs";
    return this.http.post<PageResult<CareHomeUserLog>>(url, recordFilters);
  }

  // careHome wise user count
  public getUserCountCareHome(recordFilters: CareHomeReportsFilter): Observable<PageResult<CareHomeUserLog>> {
    let url = this.signOffUrl + "CareHomes/GetUserCount";
    return this.http.post<PageResult<CareHomeUserLog>>(url, recordFilters);
  }

  // get expired course users
  public getUserCourses(careHomeId: number): Observable<Array<any>> {
    let url = this.signOffUrl + `ExpiredCourses/${careHomeId}`;
    return this.http.get<Array<any>>(url);
  }

}
