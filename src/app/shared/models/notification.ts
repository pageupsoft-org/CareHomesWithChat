import { NotificationType } from "../enums/notification-type.enum";

export class Notification {
    id: number;
    title: string;
    message: string;
    body: string;
    userId: number;
    notificationType: NotificationType;
    createdTime: Date;
    isSeen: boolean;
}