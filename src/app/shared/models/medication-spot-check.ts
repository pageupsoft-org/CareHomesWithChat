import { MedicationSpotCheckRecords } from "./medication-spot-check-records";
import { User } from "./user";

export class MedicationSpotCheck {
  id: number;
  patientId: number;
  auditedBy: number;
  auditDate: Date;
  //  medication
  // medicationAdministrationRecords: Array<MedicationAdministrationRecord>;
  // treatmentsAttached: Array<TreatmentAttached>;
  form15Records: Array<MedicationSpotCheckRecords>;
  signoffBy: number;
  isSignedOff: boolean;
  locationId: number;
  careHomeId: number;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: number;
  auditor:User;
  locationName:string;
  signoffByName:string;

  constructor() {
    this.isSignedOff = false;
    this.createdAt = new Date();
  }
}
