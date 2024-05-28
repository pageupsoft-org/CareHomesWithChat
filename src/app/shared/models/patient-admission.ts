import { AdmissionStatus } from '../enums/admission-status.enum';
import { AppropriateService } from '../enums/appropriate-services.enum';
import { CovidScreening } from '../enums/covid-screening.enum';
import { EthnicOrigin } from '../enums/ethnicOrigin.enum';
import { Gender } from '../enums/gender.enum';
import { LegalStatus } from '../enums/legal-status.enum';
import { MaritalStatus } from '../enums/marital-status.enum';
import { MHAStatus } from '../enums/mha-status.enum';
import { NameTitle } from '../enums/name-title.enum';
import { PatientsRelationship } from '../enums/patient-relationship.enum';
import { ZoneCategory } from '../enums/zone-category.enum';
import { PatientCareCoordinator } from './patient-care-coordinator';
import { PatientDependents } from './patient-dependents';
import { PatientDocuments } from './patient-documents';

export class PatientAdmission {
  id: number;
  dateOfAdmission: Date;
  reasonForAdmission: string;
  referralDate: Date;
  sourceOfReferral: string;
  authority: string;
  dateOfLeaving: Date;
  responsibleClinician: string;
  responsiblePhychiatrist: string;
  locationId: number;
  // userId: Array<User>;
  legalStatus: LegalStatus;
  status: AdmissionStatus;
  mhaStatus: MHAStatus;

  // personal details

  title: NameTitle;
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  serviceUserNumber: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  postCode: string;
  dob: Date;
  age: number;
  gender: Gender;
  maritalStatus: MaritalStatus;
  ethnicOrigin: EthnicOrigin;
  weight: number;
  height: number;
  religion: string;
  niNumber: string;
  nhsNumber: string;
  dwpNumber: string;
  telePhone: string;

  careCoordinators: Array<PatientCareCoordinator>;
  zoningCategory: string;
  isActive: Boolean;

  // kin details

  kinName: string;
  kinAddress1: string;
  kinAddress2: string;
  kinAddress3: string;
  kinAddress4: string;
  kinAddress5: string;
  kinContact: string;
  kinRelationship: PatientsRelationship;

  nearestRelative: string;
  emergencyContact: string;

  // Medical records

  gpSurgeryName: string;
  gpAddress1: string;
  gpAddress2: string;
  gpAddress3: string;
  gpAddress4: string;
  gpPostCode: string;
  gpContactNo: string;
  typeOfFacility: string;
  diagnosis: string;
  isSafeGuard: Boolean;
  safeGuardDetail: string;
  isDOLs: Boolean;
  doLsDetails: string;
  isPowerOfAttorney: Boolean;
  powerOfAttorneyDetail: string;
  powerOfAttorneyContact: string;
  assessmentDate: Date;
  assessmentLocation: string;
  coviD19: CovidScreening;
  coviD19TestDate: Date;
  professionalConsulted: string;
  reportsConsulted: string;
  presentingProblem: string;
  personalHistory: string;
  pastMedicalHistory: string;
  drugAndAlcoholHistory: string;
  forensicHistory: string;
  currentMedication: string;
  allergies: string;
  mentalState: string;

  // provisional care

  myMentalHealth1: string;
  myMentalHealth2: string;
  medications1: string;
  medications2: string;
  nutrition1: string;
  nutrition2: string;
  physicalHealth1: string;
  physicalHealth2: string;
  behaviour1: string;
  behaviour2: string;
  mySafetyAndRisk1: string;
  mySafetyAndRisk2: string;
  personalHygiene1: string;
  personalHygiene2: string;
  myRelationship1: string;
  myRelationship2: string;
  activitiesOfDailyLiving1: string;
  activitiesOfDailyLiving2: string;
  myRecovery1: string;
  myRecovery2: string;

  cpaStatus: boolean;
  isObservation: string;
  observationDuration: string;
  furtherAction: string;
  createdBy: number;
  createdAt: Date;
  isSignOff: Boolean;
  signOffBy: number;

  appropriateService: AppropriateService;
  reasonForRejection: string;
  totalAmount: number;
  patientDependents: Array<PatientDependents> = [];
  patientDocuments: Array<PatientDocuments> = [];

  alertEndDate: Date;
  auditedBy: number;
  careHomeId: number;

  constructor() {
    // this.dateOfAdmission = new Date();
    this.status = AdmissionStatus.InProgress;
    this.mhaStatus = MHAStatus.CTO;
    this.legalStatus = LegalStatus.InFormal;
    this.gender = Gender.Male;
    this.ethnicOrigin = EthnicOrigin.White1;
    this.maritalStatus = MaritalStatus.Single;
    this.isActive = true;
    this.isPowerOfAttorney = false;
    this.isSafeGuard = false;
    this.isDOLs = false;
    this.coviD19 = CovidScreening.NotTested;
    this.title = NameTitle.Mr;
    this.isSignOff = false;
    this.cpaStatus = false;
    this.isObservation = 'false';
    this.observationDuration = null;
    // this.createdAt= ;
    this.createdAt = new Date();
    this.totalAmount = 0;
    this.alertEndDate = null;
    this.zoningCategory = ZoneCategory.Amber;
  }
}
