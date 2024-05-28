import { RiskEntry } from "../enums/risk-entry.enum";
import { User } from "./user";

export class AuditFormTwenty {

    id: number;
    auditedBy: number;
    auditDate: Date;
    locationId: number;
    careHomeId: number;

    windowInstallationsMaintainResponse: RiskEntry;
    windowInstallationsMaintainAction: string;
    windowInstallationsMaintainDueDate: Date;
    windowInstallationsMaintainActionBy: number;

    restrictedToOpeningResponse: RiskEntry;
    restrictedToOpeningAction: string;
    restrictedToOpeningDueDate: Date;
    restrictedToOpeningActionBy: number;

    bottomEdgeOfOpenableWindowResponse: RiskEntry;
    bottomEdgeOfOpenableWindowAction: string;
    bottomEdgeOfOpenableWindowDueDate: Date;
    bottomEdgeOfOpenableWindowActionBy: number;

    avoidUnauthorisedAccessResponse: RiskEntry;
    avoidUnauthorisedAccessAction: string;
    avoidUnauthorisedAccessDueDate: Date;
    avoidUnauthorisedAccessActionBy: number;

    preventExcAmtsOfMovementResponse: RiskEntry;
    preventExcAmtsOfMovementAction: string;
    preventExcAmtsOfMovementDueDate: Date;
    preventExcAmtsOfMovementActionBy: number;

    suitableGlazingMasticResponse: RiskEntry;
    suitableGlazingMasticAction: string;
    suitableGlazingMasticDueDate: Date;
    suitableGlazingMasticActionBy: number;

    fittedWidOpeningRestrictorResponse: RiskEntry;
    fittedWidOpeningRestrictorAction: string;
    fittedWidOpeningRestrictorDueDate: Date;
    fittedWidOpeningRestrictorActionBy: number;

    robustToWithstandDamageResponse: RiskEntry;
    robustToWithstandDamageAction: string;
    robustToWithstandDamageDueDate: Date;
    robustToWithstandDamageActionBy: number;

    tamperProofFittingsResponse: RiskEntry;
    tamperProofFittingsAction: string;
    tamperProofFittingsDueDate: Date;
    tamperProofFittingsActionBy: number;

    fittedSufficientlyRobustResponse: RiskEntry;
    fittedSufficientlyRobustAction: string;
    fittedSufficientlyRobustDueDate: Date;
    fittedSufficientlyRobustActionBy: number;

    restrictedAccessToUpperFloorsResponse: RiskEntry;
    restrictedAccessToUpperFloorsAction: string;
    restrictedAccessToUpperFloorsDueDate: Date;
    restrictedAccessToUpperFloorsActionBy: number;

    climbOverBarrierResponse: RiskEntry;
    climbOverBarrierAction: string;
    climbOverBarrierDueDate: Date;
    climbOverBarrierActionBy: number;

    fittingsFunctioningEffectivelyResponse: RiskEntry;
    fittingsFunctioningEffectivelyAction: string;
    fittingsFunctioningEffectivelyDueDate: Date;
    fittingsFunctioningEffectivelyActionBy: number;

    providingAdequateTrainingResponse: RiskEntry;
    providingAdequateTrainingAction: string;
    providingAdequateTrainingDueDate: Date;
    providingAdequateTrainingActionBy: number;

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
        this.isSignedOff = false;
    }
}
