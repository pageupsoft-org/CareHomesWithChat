import { Criteria } from "./criteria";

export class PatientZoneCriteriaMapping {
    id: number;
    patientZoneLogId: number;
    locationCriteriaId: number;
    locationCriteria: Criteria;
}
