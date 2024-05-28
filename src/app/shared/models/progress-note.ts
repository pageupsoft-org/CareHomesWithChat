import { FormStatus } from "../enums/progress-note-form-status";

export class ProgressNote {
    id: number;
    patientId: number;
    noteDate: Date;
    shift: string;
    userId: number
    answer1: string;
    answer2: string;
    answer3: string;
    answer4: string;
    answer5: string;
    additionalNotes: string;
    circulatedTo: string;
    signOffBy: number;
    isSignOff: boolean;
    medicationCompliance: string;
    risksAndConcerns: string;
    healthAndHyginus: string;
    formStatus:number;
    formMessageLog:FormMessageLog;
    currentUserId:number;

    constructor() {
        this.isSignOff = false;
    }
}

export class FormMessageLog {
    id: number;
    entityName: string;
    message: string;
    tableKeyId: number;
    careHomeId: number;
    locationId: number;
    patientId: number;
    createdDate: string;
    updatedDate: string;
    createBy: number;
    updateBy: number;
  }
