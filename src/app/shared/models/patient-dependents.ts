import { PatientsRelationship } from "../enums/patient-relationship.enum"
import { PatientAdmission } from "./patient-admission";

export class PatientDependents {
    id: number;
    dependentName: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    address5: string;
    dependentRelationship: PatientsRelationship;
    patientId: PatientAdmission;
    isActive: Boolean;
    constructor() {
        this.isActive = true;
    }
}

