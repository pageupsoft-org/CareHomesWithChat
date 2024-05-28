export class WorkingHoursRequest {
    careHomeId: number;
    skip: number;
    top: number;
    paginate: boolean;
    // Filters Column
    userId: number;
    startDate: Date;
    endDate: Date;
    constructor() {
        this.paginate = true;
        this.startDate = new Date();
        this.endDate = new Date();
    }
}
