import { Form12Record } from "./form-twelve-record";
import { User } from "./user";

export class AuditFormTwelve {

    id: number;
    auditedBy: number;
    auditDate: Date;
    locationId: number;
    careHomeId: number;

    form12Records:Array<Form12Record>;

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
