export class FinancialYear {
    id: number;
    financialYearName: string;
    careHomeId: number;
    isCurrentYear: boolean;

    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: number;
    createdBy: number;

    constructor() {
        this.isActive = true;
        this.createdAt = new Date();
    }
}