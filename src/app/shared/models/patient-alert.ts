import { LocationAlert } from "./location-alerts";
import { PatientAdmission } from "./patient-admission";

export class PatientAlert {
    id: number;
    patientId: number;
    locationAlertId: number;
    startDate: Date;
    endDate: Date;
    locationId: number;
    careHomeId: number;
    status: boolean;
    createdBy: number;
    createdAt: Date;
    updatedBy: number;
    updatedAt: Date;
    patient:PatientAdmission;
    locationAlert : LocationAlert;
    constructor() {
        this.status = true;
    }
}
