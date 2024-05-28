import { ActionsToBeTaken } from "../enums/actions-to-taken.enum"
import { CPAStatus } from "../enums/cpa-status.enum"
import { FurtherActions } from "../enums/further-actions.enum"
import { LegalStatusRisk } from "../enums/legal-status-risk.enum"
import { PersonsAtRisk } from "../enums/persons-risk.enum"
import { SeriousIncident } from "../enums/serious-incident.enum"
import { RiskAction } from "./risk-action.enum"
import { RiskEntry } from "../enums/risk-entry.enum"

export class RiskAssessment {
    /// <summary>
    /// Section 1
    /// </summary>
    id: number
    patientId: number
    otherAgenciesInvolved: string
    otherAgenciesInvolvedSpecification: string
    assessmentType: string
    cpaStatus: CPAStatus
    legalStatus: LegalStatusRisk
    isAssessed: Boolean
    riskBehaviourEvidence: Boolean
    pastSeriousIncident: SeriousIncident
    riskOfVioleance: number
    riskOfSuicide: number
    riskDeliberateSelfHarm: number
    riskSevereSelfNeglect: number
    accidentalSelfHarm: number
    abuseExploitationByOthers: number
    riskPhysicalCondition: number
    highRiskOfRelapse: Boolean
    potentialRisk: PersonsAtRisk
    isDependentChild: Boolean
    potentialRiskSpecification: string
    futherAction: FurtherActions
    additionalNote1: string
    /// <summary>
    /// Section 2
    /// </summary>
    earlyWarningSign: RiskEntry
    earlyWarningSignNote: string
    ideaHarmingOthers: RiskEntry
    ideaHarmingOthersNote: string
    ideaSelfHarm: RiskEntry
    ideaSelfHarmNote: string
    delusions: RiskEntry
    delusionsNote: string
    commandHallucinations: RiskEntry
    commandHallucinationsNote: string
    morbidJealousy: RiskEntry
    morbidJealousyNote: string
    impulsivity: RiskEntry
    impulsivityNote: string

    pysicalHarm: RiskEntry
    physicalHarmNote: string
    intimidation: RiskEntry
    intimidationNote: string
    preparationHarmingOthers: RiskEntry
    preparationHarmingOthersNote: string
    evidenceOfTargeting: RiskEntry
    evidenceOfTargetingNote: string
    childProtectionIssue: RiskEntry
    childProtectionIssueNote: string
    suicideAttempts: RiskEntry
    suicideAttemptsNote: string
    plansToCommitSuicide: RiskEntry
    plansToCommitSuicideNote: string
    deliberateSelfHarm: RiskEntry
    deliberateSelfHarmNote: string
    domesticRisk: RiskEntry
    domesticRiskNote: string
    drugAlcoholAbuse: RiskEntry
    drugAlcoholAbuseNote: string
    fireSetting: RiskEntry
    fireSettingNote: string
    damageToProperty: RiskEntry
    damageToPropertyNote: string
    recklessUnsafeBehaviour: RiskEntry
    recklessUnsafeBehaviourNote: string
    severeSelfNeglect: RiskEntry
    severeSelfNeglectNote: string
    absconding: RiskEntry
    abscondingNote: string
    wandering: RiskEntry
    wanderingNote: string

    discontinuationMedication: RiskEntry
    discontinuationMedicationNote: string
    failureToAttendAppointment: RiskEntry
    failureToAttendAppointmentNote: string
    unplannedDisengagmentFromService: RiskEntry
    unplannedDisengagmentFromServiceNote: string
    compulsoryAdmission: RiskEntry
    compulsoryAdmissionNote: string
    intensiveCareWard: RiskEntry
    intensiveCareWardNote: string

    convictionViolentOffences: RiskEntry
    convictionViolentOffencesNote: string
    convictionSexualOffences: RiskEntry
    convictionSexualOffencesNote: string
    admissionToSpecialHospital: RiskEntry
    admissionToSpecialHospitalNote: string
    admissionToSecureUnit: RiskEntry
    admissionToSecureUnitNote: string
    restrictionOrder: RiskEntry
    restrictionOrderNote: string
    supervisedDischarge: RiskEntry
    supervisedDischargeNote: string
    conditionalDischarge: RiskEntry
    conditionalDischargeNote: string
    otherInvolvementRisk: RiskEntry
    otherInvolvementRiskNote: string

    familyHistoryOfSuicide: RiskEntry
    familyHistoryOfSuicideNote: string
    physicalProblems: RiskEntry
    physicalProblemsNote: string
    recentSevereStress: RiskEntry
    recentSevereStressNote: string
    lackOfEmployment: RiskEntry
    lackOfEmploymentNote: string
    financialDifficulties: RiskEntry
    financialDifficultiesNote: string
    concernExpressedByOthers: RiskEntry
    concernExpressedByOthersNote: string
    recurrenceOfCircumstances: RiskEntry
    recurrenceOfCircumstancesNote: string
    abuseByOthers: RiskEntry
    abuseByOthersNote: string
    socialIsolation: RiskEntry
    socialIsolationNote: string
    homelessness: RiskEntry
    homelessnessNote: string
    otherRiskFactors: string
    additionalNote2: string
    /// <summary>
    /// Section 3
    /// </summary>
    summaryOfMainRisks: string
    actionToReduceRisk: RiskAction
    actionToReduceRiskDesc: string
    isUserAwareOfRisks: RiskAction
    userAwareOfRisksDesc: string
    isFamilyAwareOfRisks: RiskAction
    isFamilyAwareOfRisksDesc: string
    protectiveFactor: string
    /// <summary>
    /// Section 4
    /// </summary>
    areasOfConcern: string
    actionsToBeTaken: ActionsToBeTaken
    actionToBeTakenSpecification: string
    informationSource: string
    informationSourceSpecification: string

    locationId: number;
    careHomeId: number;


    completedBy: number
    completedDate: Date
    nextReviewDate: Date
    circulatedTo: string
    signOffBy: number
    isSignOff: boolean
    userName: string;
    constructor() {
        this.isSignOff = false;
        this.completedDate = new Date();
        this.isDependentChild = false;
        this.highRiskOfRelapse = false;
        this.cpaStatus = CPAStatus.NotApplicable;
        this.legalStatus = LegalStatusRisk.None;
        this.isAssessed = true;
        this.potentialRisk = PersonsAtRisk.None;
        this.riskBehaviourEvidence = false;
        this.pastSeriousIncident = SeriousIncident.No;
        this.earlyWarningSign = RiskEntry.No;
        this.ideaHarmingOthers = RiskEntry.No;
        this.ideaSelfHarm = RiskEntry.No;
        this.delusions = RiskEntry.No;
        this.commandHallucinations = RiskEntry.No;
        this.morbidJealousy = RiskEntry.No;
        this.impulsivity = RiskEntry.No;
        this.riskOfVioleance = 0;
        this.riskOfSuicide = 0;
        this.riskDeliberateSelfHarm = 0;
        this.riskSevereSelfNeglect = 0;
        this.accidentalSelfHarm = 0;
        this.abuseExploitationByOthers = 0;
        this.riskPhysicalCondition = 0;
        this.futherAction = FurtherActions.None;

        this.pysicalHarm = RiskEntry.NotKnown;
        this.intimidation = RiskEntry.NotKnown;
        this.preparationHarmingOthers = RiskEntry.NotKnown;
        this.evidenceOfTargeting = RiskEntry.NotKnown;
        this.childProtectionIssue = RiskEntry.NotKnown;
        this.suicideAttempts = RiskEntry.NotKnown;
        this.plansToCommitSuicide = RiskEntry.NotKnown;
        this.deliberateSelfHarm = RiskEntry.NotKnown;
        this.domesticRisk = RiskEntry.NotKnown;
        this.drugAlcoholAbuse = RiskEntry.NotKnown;
        this.fireSetting = RiskEntry.NotKnown;
        this.damageToProperty = RiskEntry.NotKnown;
        this.recklessUnsafeBehaviour = RiskEntry.NotKnown;
        this.severeSelfNeglect = RiskEntry.NotKnown;
        this.absconding = RiskEntry.NotKnown;
        this.wandering = RiskEntry.NotKnown;
        this.discontinuationMedication = RiskEntry.NotKnown;
        this.failureToAttendAppointment = RiskEntry.NotKnown;
        this.unplannedDisengagmentFromService = RiskEntry.NotKnown;
        this.compulsoryAdmission = RiskEntry.NotKnown;
        this.intensiveCareWard = RiskEntry.NotKnown;
        this.convictionViolentOffences = RiskEntry.NotKnown;
        this.convictionSexualOffences = RiskEntry.NotKnown;
        this.admissionToSpecialHospital = RiskEntry.NotKnown;
        this.admissionToSecureUnit = RiskEntry.NotKnown;
        this.restrictionOrder = RiskEntry.NotKnown;
        this.supervisedDischarge = RiskEntry.NotKnown;
        this.conditionalDischarge = RiskEntry.NotKnown;
        this.otherInvolvementRisk = RiskEntry.NotKnown;
        this.familyHistoryOfSuicide = RiskEntry.NotKnown;
        this.physicalProblems = RiskEntry.NotKnown;
        this.recentSevereStress = RiskEntry.NotKnown;
        this.lackOfEmployment = RiskEntry.NotKnown;
        this.financialDifficulties = RiskEntry.NotKnown;
        this.concernExpressedByOthers = RiskEntry.NotKnown;
        this.recurrenceOfCircumstances = RiskEntry.NotKnown;
        this.abuseByOthers = RiskEntry.NotKnown;
        this.socialIsolation = RiskEntry.NotKnown;
        this.homelessness = RiskEntry.NotKnown;
        this.actionsToBeTaken = 0;
        this.actionToReduceRisk = RiskAction.Unclear;
        this.isUserAwareOfRisks = RiskAction.Unclear;
        this.isFamilyAwareOfRisks = RiskAction.Unclear;

        // this.otherAgenciesInvolved = OtherAgencies.Other;
    }
}
