export class userLeavesFilter {
    careHomeId: number;
    skip: number;
    top: number;
    paginate: boolean;
    // Filters Column
    userId: number;
    financialYearId: number;
    startDate: Date;
    endDate: Date;
    constructor() {
        this.paginate = true;
        this.financialYearId = 0;
        this.startDate = new Date();
        this.endDate = new Date();
    }
}
