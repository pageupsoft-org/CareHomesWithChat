import { User } from './user';

export class AuditFormNineteen {
    id: number;
    auditedBy: number;
    auditDate: Date;
    locationId: number;
    careHomeId: number;
    form19Records: Array<FormNineteenRecords>;

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

class FormNineteenRecords {
    hazard: boolean;
    whatIsHazard: string;
    hazardIdentified: boolean;
    followUpAction: string;
    followUpDate: Date;
    actionedBy: number;
    comment: string;
    actionedByName: string;
}