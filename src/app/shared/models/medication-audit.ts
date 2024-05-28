import { RiskEntry } from "../enums/risk-entry.enum";
import { User } from "./user";

export class MedicationAudit {
    id: number;
    patientId: number;
    auditedBy: number;
    auditDate: Date

    medicationAdministrationRecord: RiskEntry;
    treatmentAttached: RiskEntry;
    startAndEndDate: RiskEntry;
    handwrittenMedicines: RiskEntry;
    medicationAdministeredSigned: RiskEntry;
    signedOnBack: RiskEntry;
    administeredReason: RiskEntry;
    dailyCounting: RiskEntry;
    nightCounting: RiskEntry;
    medicationReceivedDocument: RiskEntry;
    medicationsDisposed: RiskEntry;

    // individual medications

    expiryDateForPrompts: RiskEntry;
    openAndEndDate: RiskEntry;
    medicationsStored: RiskEntry;

    signoffBy: number;
    isSignedOff: boolean;

    locationId: number;
    careHomeId: number;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: number;
    auditor: User;
    signoffByName: string;
    locationName: string;


    constructor() {
        this.createdAt = new Date();
        this.auditDate = new Date();
        this.isSignedOff = false;

        this.medicationAdministrationRecord = RiskEntry.No;
        this.treatmentAttached = RiskEntry.No;
        this.startAndEndDate = RiskEntry.No;
        this.handwrittenMedicines = RiskEntry.No;
        this.medicationAdministeredSigned = RiskEntry.No;
        this.signedOnBack = RiskEntry.No;
        this.administeredReason = RiskEntry.No;
        this.dailyCounting = RiskEntry.No;
        this.nightCounting = RiskEntry.No;
        this.medicationReceivedDocument = RiskEntry.No;
        this.medicationsDisposed = RiskEntry.No;
        this.expiryDateForPrompts = RiskEntry.No;
        this.openAndEndDate = RiskEntry.No;
        this.medicationsStored = RiskEntry.No;
    }
}
