import { Time } from '@angular/common';
import { Consequences } from '../enums/consequences.enum';
import { IncidentOccurStage } from '../enums/incident-occur-stage.enum';
import { IncidentTypeFormTwo } from '../enums/incident-type-form-two.enum';
import { InjuriesType } from '../enums/injuries-type.enum';
import { MedicationIncidentCodes } from '../enums/medication-incident-codes.enum';
import { NatureOfActivity } from '../enums/nature-of-activityts.enum';
import { OtherFactors } from '../enums/other-factors.enum';
import { Status } from '../enums/status.enum';
import { ViolentIncidents } from '../enums/violent-incidents';
import { User } from './user';

export class AuditFormTwo {
  id: number;
  auditedBy: number;
  auditDate: Date;
  locationId: number;
  careHomeId: number;

  /// 1.  About the Person reporting the Incident

  fullName: string;
  address: string;
  postCode: string;
  telephoneNumber: string;
  signature: string;
  dateReported: Date;

  // Part A
  // 2. About the Person who had the Accident
  status: Status;
  accidentPersonName: string;
  accidentPersonAddress: string;
  accidentPersonPostCode: string;
  actionAtIncidentTime: string;
  accidentPersonDateOfBirth:Date;
  accidentPersonPhone:string;
  accidentPersonEmail:string;
  accidentPersonEmergencyName:string;
  accidentPersonEmergencyRelationship:string;
  accidentPersonEmergencyPhone:string;

  /// 3. About the Incident

  incidentDate: Date;
  incidentLocation: number;
  whatHappened: string;
  whatWasTheCause: string;
  isAnyInjuries: boolean;
  immediateActionTaken: string;
  timeOfIncident:Time;
  incidentLocationSpecificArea:string;

  /// 4. Details of Witness

  isAnyWitnesses: boolean;
  witnesses: Array<Witness>;

  ///5. Incident Type (Please tick one box only)
  incidentType: IncidentTypeFormTwo;
  otherIncidentSpecify: string;

  /// 6. Complete for Violent Incidents only (Please tick one box only)

  violentIncidents: ViolentIncidents;
  natureOfActivity: NatureOfActivity;
  otherNatureActivitySpecify: string;
  otherFactors: OtherFactors;

  // Details of third party/aggressor involved:

  thirdPartyName: string;
  thirdPartyAddress: string;
  thirdPartyPostCode: string;
  thirdPartyStatus: Status;

  /// 7. Injuries
  ///  Details of Injury:

  injuryDetails: string;
  injuryType: InjuriesType;
  injuryDetailsOtherSpecify: string;

  consequences: Consequences;
  consequencesOtherSpecify: string;

  specifyInformedPerson: string;

  /// 8. Medication Error: Details of Medication involved in the Incident
  nameOfDrug: string;
  incidentOccurStage: IncidentOccurStage;
  incidentOccurOtherSpecify: string;

  medicationIncidentCodes: MedicationIncidentCodes;
  medicationIncidentOtherSpecify: string;

  /// Part B – To be completed by Staff or Manager
  /// 11. Incidents reportable to CQC (Please ensure that notification to CQC is cc’d to {name of company} inbox)
  doesRegulation: boolean;
  cmhtInformed: boolean;
  ccgInformed: boolean;
  safeguardingAuthoritiesNotified: boolean;
  policeinvolved: boolean;
  incidentDocument: string;
  incidentDocumentFileName: string;
  incidentDocumentAsBase64: string;

  riskScore: number;

  /// Part C – To be completed by Manager
  /// 13. Manager / Team Actions

  immediateActionsTaken: string;
  plannedFutureActions: string;

  actionPlanDocument: string;
  actionPlanDocumentFileName: string;
  actionPlanDocumentAsBase64: string;

  // 14. External Reporting

  isRIDDORReportable: boolean;
  dateManagerCalled: Date;
  sendEmailUserIds: number[];

  signoffBy: number;
  isSignedOff: boolean;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: number;
  auditor: User;
  locationName: string;
  signoffByName: string;
  constructor() {
    this.isSignedOff = false;
  }
}

class Witness {
  id: number;
  form2Id: number;
  witnessFullName: string;
  witnessAddress: string;
  witnessPostCode: string;
  witnessTelephoneNumber: string;
  witnessStatus: Status;
  attachStatement: string;
}
