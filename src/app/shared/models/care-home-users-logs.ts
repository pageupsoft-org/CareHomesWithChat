export class CareHomeReportsFilter {
    skip: number;
    top: number;
    paginate: boolean;
    status: number;
    careHomeId: number;
    constructor() {
      this.paginate = true;
    }
  }
  