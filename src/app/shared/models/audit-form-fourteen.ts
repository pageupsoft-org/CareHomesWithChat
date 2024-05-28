import { RiskEntry } from "../enums/risk-entry.enum";
import { User } from "./user";

export class AuditFormFourteen {

    id: number;
    auditedBy: number;
    auditDate: Date;
    locationId: number;
    careHomeId: number;
    patientId: number;
  
    // Controlled Drugs (CD
    allCounterSignature:RiskEntry;
    administeredCounterSignature:RiskEntry;
    controlledDrugExpiryDate:RiskEntry;
    
    // Emergency Drugs

    emergencyDrugExpiryDate:RiskEntry;
    emergencyDrugRecording:RiskEntry;

    // treatment/MedicationRoom(s)
    isRoomClean:RiskEntry;
    isCupboardsClean:RiskEntry;
    
    // Area Of Audit

    roomTemperatureMaintained:RiskEntry;
    isClinicalFridgeClean:RiskEntry;
    clinicalFridgeTemperatureMaintained:RiskEntry;
    wasteBagsAvailable:RiskEntry;
    sharpBoxAvailable:RiskEntry;
    updatedBNFAvailable:RiskEntry;
    updatedDrugAlert:RiskEntry;
    updatedSignatoryList:RiskEntry;

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
