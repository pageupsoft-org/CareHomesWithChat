export class MedicationStockRecord {
    id: number;
    recordDateTime: Date;
    medicationAndStrength: string;
    expiryDate: Date;
    tablets: number;
    inhaler: number;
    liquid: number;
    depot: number;
    totalAmount: number;
    sign: number;
    counterSign: number;
    comments: string;
}