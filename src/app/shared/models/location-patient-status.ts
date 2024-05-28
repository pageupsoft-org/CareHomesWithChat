
export class LocationPatientStatus {
    locationId: number;
    active: number;
    progress: number;
    closed: number;
    locationName: string;
    constructor() {
        this.active = 0
        this.progress = 0
        this.closed = 0
    }
}