import { User } from './user';

export class AuditFormEleven {
    id: number;
    auditedBy: number;
    auditDate: Date;
    locationId: number;
    careHomeId: number;
    form11Records: Array<FormElevenRecords>;
    signoffBy: number;
    isSignedOff: boolean;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: number;
    generalComment: string;
    auditor: User;
    locationName: string;
    signoffByName: string;
    constructor() {
        this.isSignedOff = false;
    }
}

class FormElevenRecords {
    infectionControlTitle: string;
    yesNo: boolean;
    actionRequiredState: string;
    actionRequired: boolean;
    targetDate: Date;
    actionedBy: number;
    completedDate: Date;
    actionedByName: string;
    section: string;
}