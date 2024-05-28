import { ApplianceName } from "../enums/appliance-name.enum";
import { AreaName } from "../enums/area-name.enum";
import { FloorName } from "../enums/floor-name.enum";
import { User } from "./user";

export class AuditFormTen {

    id: number;
    auditedBy: number;
    auditDate: Date;
    locationId: number;
    careHomeId: number;

    floor: FloorName;
    area:AreaName;
    appliance:ApplianceName;
    comments:string;

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
