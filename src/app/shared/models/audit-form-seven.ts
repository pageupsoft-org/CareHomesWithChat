import { RiskEntry } from "../enums/risk-entry.enum";
import { Debrief } from "./debrief";
import { PartAFormSeven } from "./partA-form-seven";
import { PartBFormSeven } from "./partB-form-seven";
import { User } from "./user";

export class AuditFormSeven {

    id: number;
    auditedBy: number;
    auditDate: Date;
    locationId: number;
    careHomeId: number;

    // part A
    staffs:Array<PartAFormSeven>;

    // part B
    serviceUsers:Array<PartBFormSeven>;

    // part C
    exerciseScenario: string;

    // part D
    alarmActivatedTime: number; //decimal 999.59
    alarmActivatedComment: string;

    staffResponseTime: number;
    staffResponseComment: string;

    verifiesEmergencyTime: number;
    verifiesEmergencyComment: string;

    emergencyServiceTime: number;
    emergencyServiceComment: string;

    evacuationBeginsTime: number;
    evacuationBeginsComment: string;

    checkAllAreasTime: number;
    checkAllAreasComment: string;

    arriveAssemblyAreaTime: number;
    arriveAssemblyAreaComment: string;

    staffCheckOccupantsTime: number;
    staffCheckOccupantsComment: string;

    reportEmergencyServicesTime: number;
    reportEmergencyServicesComment: string;

    exerciseCompletedTime: number;
    exerciseCompletedComment: string;

    totalEvacuationTime: number;

    // part E
    wasAlaramActivated: RiskEntry;
    wasAlaramActivatedComments: string;

    staffFollowAppropriateEmergencyProcedures: RiskEntry;
    staffFollowAppropriateEmergencyProceduresComments: string;

    wasEmergencyConfined: RiskEntry;
    wasEmergencyConfinedComments: string;

    emergencyServicesNotified: RiskEntry;
    emergencyServicesNotifiedComments: string;

    areasOfHouseSearched: RiskEntry;
    areasOfHouseSearchedComments: string;

    staffAppropriateIdentification: RiskEntry;
    staffAppropriateIdentificationComments: string;

    evacuationOfOccupants: RiskEntry;
    evacuationOfOccupantsComments: string;

    mobilityImpairedPersons: RiskEntry;
    mobilityImpairedPersonsComments: string;

    anyoneRefuseToFollow: RiskEntry;
    anyoneRefuseToFollowComments: string;

    appropriateEvacuationRoute: RiskEntry;
    appropriateEvacuationRouteComments: string;

    occupantsProceed: RiskEntry;
    occupantsProceedComments: string;

    occupantsAccounted: RiskEntry;
    occupantsAccountedComments: string;

    didAnyoneReenter: RiskEntry;
    didAnyoneReenterComments: string;

    didStaffPersonLiaise: RiskEntry;
    didStaffPersonLiaiseComments: string;

    emergencyServicesReceive: RiskEntry;
    emergencyServicesReceiveComments: string;

    // part F

    debriefs: Array<Debrief>;

    additionalComments: string;

    signoffBy: number;
    isSignedOff: boolean;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: number;
    auditor: User;
    locationName: string;
    signoffByName: string;
    constructor() {

    }
}
