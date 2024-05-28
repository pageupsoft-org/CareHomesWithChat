export class PatientReportFilterParameter {
    careHomeId: number;
    userId: number;
    skip: number;
    top: number;
    paginate: boolean;
    patientId: number;
    startDate: Date;
    endDate: Date;
    constructor() {
        this.paginate = false;
        this.patientId = null;
        this.startDate = new Date();
        this.endDate = new Date();
    }
}
