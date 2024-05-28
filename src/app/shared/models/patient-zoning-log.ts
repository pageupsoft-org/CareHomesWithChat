import { PatientZoneCriteriaMapping } from "./patient-zone-criteria-mapping";
import { PatientZoneActionMapping } from "./patient-zone-action-mapping";

export class PatientZoneLog {
    id: number;
    patientId: number;
    fromZone: string;
    toZone: string;
    locationCriterias: Array<PatientZoneCriteriaMapping>;
    locationActions: Array<PatientZoneActionMapping>;
    createdBy: number;
    createdAt: Date;
    constructor() {
        this.createdAt = new Date();
    }
}
