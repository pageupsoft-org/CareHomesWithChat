
import { Gender } from "../enums/gender.enum";
import { MaritalStatus } from "../enums/marital-status.enum";
import { NameTitle } from "../enums/name-title.enum";

export class PatientInfo {
    id: number;
    nameTitle: NameTitle;
    ForeName: string;
    middleName: string;
    surName: string;
    preferredName: string;
    serviceUserNo: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    postCode: string;
    dateOfBirth: Date;
    age: Number;
    gender: Gender;
    matrialStatus: MaritalStatus;
    ethnicOrigin:string;
    weight:Number;
    height:Number;
    religion:string;
    NINumber:string;
    NHSNumber:string;
    DWPNumber:string;
    telephoneNumber:string;
}
