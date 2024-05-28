import { User } from "./user";

export class UserTask {
    id: number;
    taskName: string;
    description: string;
    careHomeId: number;
    locationId: number;
    userId: number; //UserId
    remark: string;
    taskDate: Date;
    status: boolean;
    isActive: boolean;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: number;
    user: User;
    constructor() {
        this.isActive = true;
        this.status = true;
        this.createdAt = new Date();
        // this.taskDate = new Date();
    }
}
