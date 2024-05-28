import { MedicationStockRecord } from "./medication-stock-record";
import { User } from "./user";

export class WeeklyMedicationStockCheck {
    id: number;
    patientId: number;
    auditDate: Date;
    auditedBy:number;

    medicationStockRecords: Array<MedicationStockRecord>;
    signoffBy: number;
    isSignedOff: boolean;
    locationId: number;
    careHomeId: number;
    createdBy: number;
    createdAt: Date;
    updatedBy: number;
    updatedAt: Date;
    auditor:User;
    locationName:string;
    signoffByName:User;
    constructor() {
        this.createdAt = new Date();
        this.isSignedOff = false;
    }
}


