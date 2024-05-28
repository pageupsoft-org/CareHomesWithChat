import { LeaveStatus } from "../../enums/leave-status";
import { LeaveType } from "../../enums/leave-type.enum";

export class UserLeave {
    id: number;
    userId: number;
    leaveType: LeaveType;
    isHalfDay: boolean;
    totalLeaveCount: number;
    startDate: Date;
    endDate: Date;
    reason: string;

    status: LeaveStatus;
    careHomeId: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: number;
    createdBy: number;
    // extraFields: 
    userName: string;
    financialYearName: string;
    shiftIds: Array<number>;
    constructor() {
        this.isActive = true;
        this.isHalfDay = true;
        this.createdAt = new Date();
        this.status = LeaveStatus.Approverd;
    }
}