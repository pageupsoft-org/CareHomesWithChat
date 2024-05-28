export class MedicationSpotCheckRecords {
  id: number;
  form15Id: number;
  recordDateTime1: Date;
  action1: Boolean;
  recordDateTime2: Date;
  action2: Boolean;
  type: string;
  constructor() {
    this.action1 = true;
    this.action2 = true;
  }
}
