export class PatientTransaction {
    id: number;
    patientId: number;
    mode: string;
    amount: number;
    transactionDate: Date;
    completedBy: number;
    clientSignature: string;
    circulatedTo: string;
    signOffBy: number;
    isSignOff: boolean;
    additionalNote: string;
    constructor() {
        this.amount = 0;
        this.mode = 'D';
    }
}


