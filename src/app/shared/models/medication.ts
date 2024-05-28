import { MedicationInfo } from "./medication-info";

export class Medication {
    id: number;
    patientId: number;
    depotType: string;
    dose: string;
    strength: string;
    frequency: string;
    prescriber: string;
    startDate: Date;
    endDate: Date;
    medicationInfos: Array<MedicationInfo>;
    createdBy: number;
    createdDate: Date;
    constructor() {
        this.createdDate = new Date();
    }
}


