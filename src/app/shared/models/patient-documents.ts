import { PatientAdmission } from "./patient-admission";

export class PatientDocuments {
    id: number;
    documentName: string;
    documentLocation: string;
    patientId: PatientAdmission;
    fileName: string;
    fileAsBase64 : string;
}

