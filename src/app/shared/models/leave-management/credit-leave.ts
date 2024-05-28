export class CreditLeave {
    id: number;
    userId: number;
    financialYearId: number;
    lastYearBalance: number;
    leaveCount: number;

    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: number;
    createdBy: number;

    isCarryForward: boolean;
    careHomeId: number;
    leavesTaken: number;
    // extraFields: 
    userName: string;
    financialYearName: string;

    isSelected: boolean;  //this field in only for front end 
    constructor() {
        this.isActive = true;
        this.createdAt = new Date();
    }
}