import { Shift } from "./shift";

export class UserShift {
    id: number;
    shiftId: number;
    userIds: Array<number>;
    locationId: number;
    careHomeId: number;
    isActive: boolean;
    isAbsent: boolean;

    shift:Shift;
    locationName:string;
    constructor() {
        this.isActive = true;
        this.isAbsent = false;
    }
}