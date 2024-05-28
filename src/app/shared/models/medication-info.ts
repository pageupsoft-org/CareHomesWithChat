export class MedicationInfo {
    id: number;
    dueDate: Date;
    dateGiven: Date;
    locationAdministered: string;
    userId: number;
    isFinished: Boolean
    constructor() {
        this.isFinished = false;
    }
}