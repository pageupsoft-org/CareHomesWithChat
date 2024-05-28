import { AdmissionStatus } from '../enums/admission-status.enum';

export class RecordFilterParameter {
  skip: number;
  top: number;
  searchString: string;
  paginate: boolean;
  status: AdmissionStatus;
  constructor() {
    this.paginate = false;
    this.status = AdmissionStatus.Active;
  }
}
