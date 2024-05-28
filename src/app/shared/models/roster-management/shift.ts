export class Shift {
    id: number;
    title: string;
    weekDays: Array<number>;
    startTime: Date;
    endTime: Date;
    startDate: Date;
    endDate: Date;
    locationId: number;
    careHomeId: number;
    financialYearId: number;
    color: string;  //only for front end
    createdAt: Date;
    updatedAt: Date;
    updatedBy: number;
    createdBy: number;
    constructor() {
        this.createdAt = new Date();
    }
}