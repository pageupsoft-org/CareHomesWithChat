import { User } from "./user";

export class Form12Record {
    id:number;
    windowRestrictorLocation:string;
    isApplicable:boolean;
    isRestrictorPresent:boolean;
    isRestrictorFunctional:boolean
    signOfDamage:boolean;
    isRestrictorDefective:boolean;
    isActionRequired:boolean;
    actionRequired:string;
    dateActionRequired:string;
    dateActionCompleted:Date;
    actionCompletedBy:number;
    user:User   //action Completed By
}