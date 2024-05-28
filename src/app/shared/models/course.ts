export class Course {
    id: number;
    name: string;
    isMandatory: boolean;
    isActive: boolean;
    constructor() {
        this.isActive = true;
        this.isMandatory =false;
    }
}
