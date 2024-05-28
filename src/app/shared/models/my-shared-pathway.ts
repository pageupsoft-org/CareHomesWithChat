import { PlansAndProgresses } from "./plan-and-progress";
import { SummaryOutcomePlans } from "./summary-outcome-plans";

export class MySharedPathway {
    id: number;
    patientId: number;
    sectionANote: string;
    sectionADisagreementNote: string;
    positiveStepsTowardsRecoveryScore: number;
    positiveStepsTowardsRecoveryTeamScore: number;
    positiveStepsTowardsRecoveryDiff: number;
    independentAndManagingSelfCareScore: number;
    independentAndManagingSelfCareTeamScore: number;
    independentAndManagingSelfCareDiff: number;
    wellControlledSymptomsScore: number;
    wellControlledSymptomsTeamScore: number;
    wellControlledSymptomsDiff: number;
    thinkBeforeActScore: number;
    thinkBeforeActTeamScore: number;
    thinkBeforeActDiff: number;
    takeMedicationResponsiblyScore: number;
    takeMedicationResponsiblyTeamScore: number;
    takeMedicationResponsiblyDiff: number;
    copingStrategiesScore: number;
    copingStrategiesTeamScore: number;
    copingStrategiesDiff: number;

    // section B

    sectionBNote: string;
    sectionBDisagreementNote: string;
    goodAttitudeTowardsPeopleScore: number;
    goodAttitudeTowardsPeopleTeamScore: number;
    goodAttitudeTowardsPeopleDiff: number;
    canManageMyRiskToOthersScore: number;
    canManageMyRiskToOthersTeamScore: number;
    canManageMyRiskToOthersDiff: number;
    canManageMySetbacksScore: number;
    canManageMySetbacksTeamScore: number;
    canManageMySetbacksDiff: number;
    unsupervisedSettingsScore: number;
    unsupervisedSettingsTeamScore: number;
    unsupervisedSettingsDiff: number;
    willingToWorkWithTheTeamScore: number;
    willingToWorkWithTheTeamTeamScore: number;
    willingToWorkWithTheTeamDiff: number;
    successfullyCompletedTreatmentProgrammeScore: number;
    successfullyCompletedTreatmentProgrammeTeamScore: number;
    successfullyCompletedTreatmentProgrammeDiff: number;
    consistentlyCompliedWithCarePlansScore: number;
    consistentlyCompliedWithCarePlansTeamScore: number;
    consistentlyCompliedWithCarePlansDiff: number;

    // section C

    sectionCNote: string;
    sectionCDisagreementNote: string;
    mentalHealthProblemFactorsScore: number;
    mentalHealthProblemFactorsTeamScore: number;
    mentalHealthProblemFactorsDiff: number;
    mentalHealthProblemAffectLifeSkillsScore: number;
    mentalHealthProblemAffectLifeSkillsTeamScore: number;
    mentalHealthProblemAffectLifeSkillsDiff: number;
    factorsIncreaseOrDecreaseRiskScore: number;
    factorsIncreaseOrDecreaseRiskTeamScore: number;
    factorsIncreaseOrDecreaseRiskDiff: number;
    livingConditionsAffectRiskScore: number;
    livingConditionsAffectRiskTeamScore: number;
    livingConditionsAffectRiskDiff: number;
    peopleAffectedByMyBehavioursScore: number;
    peopleAffectedByMyBehavioursTeamScore: number;
    peopleAffectedByMyBehavioursDiff: number;
    agreeWithTreatmentPlanOfferedScore: number;
    agreeWithTreatmentPlanOfferedTeamScore: number;
    agreeWithTreatmentPlanOfferedDiff: number;
    benefitedFromTheTreatmentsScore: number;
    benefitedFromTheTreatmentsTeamScore: number;
    benefitedFromTheTreatmentsDiff: number;

    // section D

    sectionDNote: string;
    sectionDDisagreementNote: string;
    completedTheTreatmentProgrammeScore: number;
    completedTheTreatmentProgrammeTeamScore: number;
    completedTheTreatmentProgrammeDiff: number;
    managedToStopDrugAlcoholUseScoreScore: number;
    managedToStopDrugAlcoholUseScoreTeamScore: number;
    managedToStopDrugAlcoholUseScoreDiff: number;
    relapsePreventionPlanScore: number;
    relapsePreventionPlanTeamScore: number;
    relapsePreventionPlanDiff: number;
    notUsingDrugsAlcoholWhenLeftUnsupervisedScore: number;
    notUsingDrugsAlcoholWhenLeftUnsupervisedTeamScore: number;
    notUsingDrugsAlcoholWhenLeftUnsupervisedDiff: number;
    cooperateWithDrugAlcoholScreensScore: number;
    cooperateWithDrugAlcoholScreensTeamScore: number;
    cooperateWithDrugAlcoholScreensDiff: number;

    // section E

    sectionENote: string;
    sectionEDisagreementNote: string;
    planAboutMyFutureCareScore: number;
    planAboutMyFutureCareTeamScore: number;
    planAboutMyFutureCareDiff: number;
    planAboutMyPlacementScore: number;
    planAboutMyPlacementTeamScore: number;
    planAboutMyPlacementDiff: number;
    planAboutMySupportNetworksScore: number;
    planAboutMySupportNetworksTeamScore: number;
    planAboutMySupportNetworksDiff: number;
    willComplyWithTreatmentPlansScore: number;
    willComplyWithTreatmentPlansTeamScore: number;
    willComplyWithTreatmentPlansDiff: number;
    stressesIWillFaceOutsideHospitalScore: number;
    stressesIWillFaceOutsideHospitalTeamScore: number;
    stressesIWillFaceOutsideHospitalDiff: number;

    // section F

    sectionFNote: string;
    sectionFDisagreementNote: string;
    managingMySelfCareScore: number;
    managingMySelfCareTeamScore: number;
    managingMySelfCareDiff: number;
    physicalHealthProblemsAreWellManagedScore: number;
    physicalHealthProblemsAreWellManagedTeamScore: number;
    physicalHealthProblemsAreWellManagedDiff: number;
    notSufferingFromAnySideEffectsScore: number;
    notSufferingFromAnySideEffectsTeamScore: number;
    notSufferingFromAnySideEffectsDiff: number;
    physicalHealthWillBeCheckedScore: number;
    physicalHealthWillBeCheckedTeamScore: number;
    physicalHealthWillBeCheckedDiff: number;

    // section G

    sectionGNote: string;
    sectionGDisagreementNote: string;
    skillsToGetOnWithPeopleScore: number;
    skillsToGetOnWithPeopleTeamScore: number;
    skillsToGetOnWithPeopleDiff: number;
    wellBalancedWeeklyRoutineScore: number;
    wellBalancedWeeklyRoutineTeamScore: number;
    wellBalancedWeeklyRoutineDiff: number;
    consistentlyManageDailyLivingSkillsScore: number;
    consistentlyManageDailyLivingSkillsTeamScore: number;
    consistentlyManageDailyLivingSkillsDiff: number;
    rangeOfInterestsScore: number;
    rangeOfInterestsTeamScore: number;
    rangeOfInterestsDiff: number;

    // section H

    sectionHNote: string;
    sectionHDisagreementNote: string;
    positiveTherapeuticRelationshipWithClinicalTeamScore: number;
    positiveTherapeuticRelationshipWithClinicalTeamTeamScore: number;
    positiveTherapeuticRelationshipWithClinicalTeamDiff: number;
    beenAbleToGetOnWithOtherServiceUsersScore: number;
    beenAbleToGetOnWithOtherServiceUsersTeamScore: number;
    beenAbleToGetOnWithOtherServiceUsersDiff: number;
    familyRelationshipsFreeFromConflictScore: number;
    familyRelationshipsFreeFromConflictTeamScore: number;
    familyRelationshipsFreeFromConflictDiff: number;
    shownProblemOfSexualNatureScore: number;
    shownProblemOfSexualNatureTeamScore: number;
    shownProblemOfSexualNatureDiff: number;

    // section I

    outcomesNeedToAchievedNote: string;
    whatINeedToDoNote: string;
    mainPersonWorkingWithMe: string;
    timescale: Date
    completedBy: number;
    completedDate: Date;
    nextReviewDate: Date;
    clientSignature: string;
    circulatedTo: string;
    signOffBy: number;
    isSignOff: boolean;

    locationId: number;
    careHomeId: number;
  
    plansAndProgresses: Array<PlansAndProgresses>;

    summaryOutcomePlans:Array<SummaryOutcomePlans>;
    userName: string;
    
    constructor() {
        this.completedDate = new Date();
        this.timescale = new Date();
        this.nextReviewDate = new Date(new Date().setMonth(new Date().getMonth() + 6));
        this.isSignOff = false;
        this.plansAndProgresses = [];
        this.summaryOutcomePlans = [];
        // section A
        this.positiveStepsTowardsRecoveryScore = 1;
        this.positiveStepsTowardsRecoveryTeamScore = 1;
        this.independentAndManagingSelfCareScore = 1;
        this.independentAndManagingSelfCareTeamScore = 1;
        this.wellControlledSymptomsScore = 1;
        this.wellControlledSymptomsTeamScore = 1;
        this.thinkBeforeActScore = 1;
        this.thinkBeforeActTeamScore = 1;
        this.takeMedicationResponsiblyScore = 1;
        this.takeMedicationResponsiblyTeamScore = 1;
        this.copingStrategiesScore = 1;
        this.copingStrategiesTeamScore = 1;
        // section B
        this.goodAttitudeTowardsPeopleScore = 1;
        this.goodAttitudeTowardsPeopleTeamScore = 1;
        this.canManageMyRiskToOthersScore = 1;
        this.canManageMyRiskToOthersTeamScore = 1;
        this.canManageMySetbacksScore = 1;
        this.canManageMySetbacksTeamScore = 1;
        this.unsupervisedSettingsScore = 1;
        this.unsupervisedSettingsTeamScore = 1;
        this.willingToWorkWithTheTeamScore = 1;
        this.willingToWorkWithTheTeamTeamScore = 1;
        this.successfullyCompletedTreatmentProgrammeScore = 1;
        this.successfullyCompletedTreatmentProgrammeTeamScore = 1;
        this.consistentlyCompliedWithCarePlansScore = 1;
        this.consistentlyCompliedWithCarePlansTeamScore = 1;
        // section C
        this.mentalHealthProblemFactorsScore = 1;
        this.mentalHealthProblemFactorsTeamScore = 1;
        this.mentalHealthProblemAffectLifeSkillsScore = 1;
        this.mentalHealthProblemAffectLifeSkillsTeamScore = 1;
        this.factorsIncreaseOrDecreaseRiskScore = 1;
        this.factorsIncreaseOrDecreaseRiskTeamScore = 1;
        this.livingConditionsAffectRiskScore = 1;
        this.livingConditionsAffectRiskTeamScore = 1;
        this.peopleAffectedByMyBehavioursScore = 1;
        this.peopleAffectedByMyBehavioursTeamScore = 1;
        this.agreeWithTreatmentPlanOfferedScore = 1;
        this.agreeWithTreatmentPlanOfferedTeamScore = 1;
        this.benefitedFromTheTreatmentsScore = 1;
        this.benefitedFromTheTreatmentsTeamScore = 1;
        // section D
        this.completedTheTreatmentProgrammeScore = 1;
        this.completedTheTreatmentProgrammeTeamScore = 1;
        this.managedToStopDrugAlcoholUseScoreScore = 1;
        this.managedToStopDrugAlcoholUseScoreTeamScore = 1;
        this.relapsePreventionPlanScore = 1;
        this.relapsePreventionPlanTeamScore = 1;
        this.notUsingDrugsAlcoholWhenLeftUnsupervisedScore = 1;
        this.notUsingDrugsAlcoholWhenLeftUnsupervisedTeamScore = 1;
        this.cooperateWithDrugAlcoholScreensScore = 1;
        this.cooperateWithDrugAlcoholScreensTeamScore = 1;
        // section E
        this.planAboutMyFutureCareScore = 1;
        this.planAboutMyFutureCareTeamScore = 1;
        this.planAboutMyPlacementScore = 1;
        this.planAboutMyPlacementTeamScore = 1;
        this.planAboutMySupportNetworksScore = 1;
        this.planAboutMySupportNetworksTeamScore = 1;
        this.willComplyWithTreatmentPlansScore = 1;
        this.willComplyWithTreatmentPlansTeamScore = 1;
        this.stressesIWillFaceOutsideHospitalScore = 1;
        this.stressesIWillFaceOutsideHospitalTeamScore = 1;
        // section F
        this.managingMySelfCareScore = 1;
        this.managingMySelfCareTeamScore = 1;
        this.physicalHealthProblemsAreWellManagedScore = 1;
        this.physicalHealthProblemsAreWellManagedTeamScore = 1;
        this.notSufferingFromAnySideEffectsScore = 1;
        this.notSufferingFromAnySideEffectsTeamScore = 1;
        this.physicalHealthWillBeCheckedScore = 1;
        this.physicalHealthWillBeCheckedTeamScore = 1;
        // section G
        this.skillsToGetOnWithPeopleScore = 1;
        this.skillsToGetOnWithPeopleTeamScore = 1;
        this.wellBalancedWeeklyRoutineScore = 1;
        this.wellBalancedWeeklyRoutineTeamScore = 1;
        this.consistentlyManageDailyLivingSkillsScore = 1;
        this.consistentlyManageDailyLivingSkillsTeamScore = 1;
        this.rangeOfInterestsScore = 1;
        this.rangeOfInterestsTeamScore = 1;
        // section  H
        this.positiveTherapeuticRelationshipWithClinicalTeamScore = 1;
        this.positiveTherapeuticRelationshipWithClinicalTeamTeamScore = 1;
        this.beenAbleToGetOnWithOtherServiceUsersScore = 1;
        this.beenAbleToGetOnWithOtherServiceUsersTeamScore = 1;
        this.familyRelationshipsFreeFromConflictScore = 1;
        this.familyRelationshipsFreeFromConflictTeamScore = 1;
        this.shownProblemOfSexualNatureScore = 1;
        this.shownProblemOfSexualNatureTeamScore = 1;
    }
}