import { ZoneCategory } from "../enums/zone-category.enum";

export class Criteria {
    id: number;
    name: string;
    zoningCategory: ZoneCategory;
    locationId: number;
    careHomeId:number;
    isActive: boolean;
    constructor() {
        this.isActive = true;
        this.zoningCategory = ZoneCategory.Amber;
    }
}
