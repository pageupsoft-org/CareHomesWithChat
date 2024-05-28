import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MySharedPathwayService } from 'src/app/services/my-shared-pathway.service';
import { UpdateLogService } from 'src/app/services/update-log.service';
import { UserService } from 'src/app/services/user.service';
import { CirculatedTo } from 'src/app/shared/enums/circulated-to.enum';
import { MySharedPathway } from 'src/app/shared/models/my-shared-pathway';
import { UpdateLog } from 'src/app/shared/models/update-log';
import { User } from 'src/app/shared/models/user';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-updated-pathwaylog',
  templateUrl: './updated-pathwaylog.component.html',
  styleUrls: ['./updated-pathwaylog.component.scss']
})
export class UpdatedPathwaylogComponent implements OnInit {
  @Input() previousValues: any;
  @Output() showAllLogs: EventEmitter<any> = new EventEmitter<any>();

  public circulatedToEnum = CirculatedTo;
  public circulatedToArray: Array<any> = [];
  public circulateTo: Array<number> = [];
  public usersList: User[] = [];
  public mySharedPathway;
  public tabIndex: number;
  public active: number;
  public lastPathwayDetails: MySharedPathway;
  public todayDate: Date;
  public logList: Array<UpdateLog> = [];
  public showLogDetail: boolean = false;


  constructor(private userService: UserService, private sharedPathwayService: MySharedPathwayService) { }

  ngOnInit(): void {
    this.onTabChange(1);
    this.circulatedToArray = this.getCirculatedTo();
    this.getUsers();

    if (this.previousValues) {

      this.setValues();
    }
  }

  public setValues() {

    this.mySharedPathway = this.previousValues;
    this.mySharedPathway.CirculatedTo.split('|').forEach(element => {
      this.circulateTo.push(Number(element));
    });
  }

  public getUserName(userId: number) {
    if (userId) {
      let name;
      // return this.usersList.filter(x => x.id == userId);
      name = this.usersList.find(x => x.id == userId);
      if (name.firstName == null && name.lastName == null)
        return name.email + "(Admin)";
      else
        return ((name.firstName)?name.firstName:'') + " " + ((name.lastName)?name.lastName:'');
    }
  }


  public goBack() {
    this.showAllLogs.emit();
  }

  private getCirculatedTo() {
    return EnumConverter.ConvertEnumToArray(this.circulatedToEnum);
  }

  private getUsers() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe(response => {
      if (response) {
        this.usersList = response;
      }
    }, err => {
      console.error("could not fetch users ::" + err.error);
    })
  }

  public onTabChange(index) {
    this.tabIndex = index;
    this.active = index;
  }

  getCirculateToString(circulatedToString: string) {
    let newString = [];
    circulatedToString.split('|').forEach(element => {
      this.circulatedToArray.forEach((el) => {
        if (el.value == element) {
          newString.push(el.key);
        }
      });
    });
    return newString.join();

  }

  public previousTotalSectionA() {
    if (this.lastPathwayDetails)
      return this.lastPathwayDetails.positiveStepsTowardsRecoveryScore + this.lastPathwayDetails.independentAndManagingSelfCareScore + this.lastPathwayDetails.wellControlledSymptomsScore + this.lastPathwayDetails.thinkBeforeActScore + this.lastPathwayDetails.takeMedicationResponsiblyScore + this.lastPathwayDetails.copingStrategiesScore;
  }

  public previousTeamTotalSectionA() {
    if (this.lastPathwayDetails)
      return this.lastPathwayDetails.positiveStepsTowardsRecoveryTeamScore + this.lastPathwayDetails.independentAndManagingSelfCareTeamScore + this.lastPathwayDetails.wellControlledSymptomsTeamScore + this.lastPathwayDetails.thinkBeforeActTeamScore + this.lastPathwayDetails.takeMedicationResponsiblyTeamScore + this.lastPathwayDetails.copingStrategiesTeamScore;
  }

  public currentTotalSectionA() {
    if (this.mySharedPathway)
      return this.mySharedPathway.PositiveStepsTowardsRecoveryScore + this.mySharedPathway.IndependentAndManagingSelfCareScore + this.mySharedPathway.WellControlledSymptomsScore + this.mySharedPathway.ThinkBeforeActScore + this.mySharedPathway.TakeMedicationResponsiblyScore + this.mySharedPathway.CopingStrategiesScore
  }

  public currentTeamTotalSectionA() {
    if (this.mySharedPathway)
      return this.mySharedPathway.PositiveStepsTowardsRecoveryTeamScore + this.mySharedPathway.IndependentAndManagingSelfCareTeamScore + this.mySharedPathway.WellControlledSymptomsTeamScore + this.mySharedPathway.ThinkBeforeActTeamScore + this.mySharedPathway.TakeMedicationResponsiblyTeamScore + this.mySharedPathway.CopingStrategiesTeamScore
  }

  public getDifferenceSectionA() {

    this.mySharedPathway.PositiveStepsTowardsRecoveryDiff = this.mySharedPathway.PositiveStepsTowardsRecoveryScore - this.mySharedPathway.PositiveStepsTowardsRecoveryTeamScore;

    this.mySharedPathway.IndependentAndManagingSelfCareDiff = this.mySharedPathway.IndependentAndManagingSelfCareScore - this.mySharedPathway.IndependentAndManagingSelfCareTeamScore;

    this.mySharedPathway.WellControlledSymptomsDiff = this.mySharedPathway.WellControlledSymptomsScore - this.mySharedPathway.WellControlledSymptomsTeamScore;

    this.mySharedPathway.ThinkBeforeActDiff = this.mySharedPathway.ThinkBeforeActScore - this.mySharedPathway.ThinkBeforeActTeamScore;

    this.mySharedPathway.TakeMedicationResponsiblyDiff = this.mySharedPathway.TakeMedicationResponsiblyScore - this.mySharedPathway.TakeMedicationResponsiblyTeamScore;

    this.mySharedPathway.CopingStrategiesDiff = this.mySharedPathway.CopingStrategiesScore - this.mySharedPathway.CopingStrategiesTeamScore;


    return (this.mySharedPathway.PositiveStepsTowardsRecoveryDiff +
      this.mySharedPathway.IndependentAndManagingSelfCareDiff +
      this.mySharedPathway.WellControlledSymptomsDiff +
      this.mySharedPathway.ThinkBeforeActDiff +
      this.mySharedPathway.TakeMedicationResponsiblyDiff +
      this.mySharedPathway.CopingStrategiesDiff);
  }

  //  section B
  public previousTotalSectionB() {
    if (this.lastPathwayDetails)
      return this.lastPathwayDetails.goodAttitudeTowardsPeopleScore + this.lastPathwayDetails.canManageMyRiskToOthersScore + this.lastPathwayDetails.canManageMySetbacksScore + this.lastPathwayDetails.unsupervisedSettingsScore + this.lastPathwayDetails.willingToWorkWithTheTeamScore + this.lastPathwayDetails.successfullyCompletedTreatmentProgrammeScore + this.lastPathwayDetails.consistentlyCompliedWithCarePlansScore;
  }

  public previousTeamTotalSectionB() {
    if (this.lastPathwayDetails)
      return this.lastPathwayDetails.goodAttitudeTowardsPeopleTeamScore + this.lastPathwayDetails.canManageMyRiskToOthersTeamScore + this.lastPathwayDetails.canManageMySetbacksTeamScore + this.lastPathwayDetails.unsupervisedSettingsTeamScore + this.lastPathwayDetails.willingToWorkWithTheTeamTeamScore + this.lastPathwayDetails.successfullyCompletedTreatmentProgrammeTeamScore + this.lastPathwayDetails.consistentlyCompliedWithCarePlansTeamScore;
  }

  public currentTotalSectionB() {
    if (this.mySharedPathway)
      return this.mySharedPathway.GoodAttitudeTowardsPeopleScore + this.mySharedPathway.CanManageMyRiskToOthersScore + this.mySharedPathway.CanManageMySetbacksScore + this.mySharedPathway.UnsupervisedSettingsScore + this.mySharedPathway.WillingToWorkWithTheTeamScore + this.mySharedPathway.SuccessfullyCompletedTreatmentProgrammeScore + this.mySharedPathway.ConsistentlyCompliedWithCarePlansScore;
  }

  public currentTeamTotalSectionB() {
    if (this.mySharedPathway)
      return this.mySharedPathway.GoodAttitudeTowardsPeopleTeamScore + this.mySharedPathway.CanManageMyRiskToOthersTeamScore + this.mySharedPathway.CanManageMySetbacksTeamScore + this.mySharedPathway.UnsupervisedSettingsTeamScore + this.mySharedPathway.WillingToWorkWithTheTeamTeamScore + this.mySharedPathway.SuccessfullyCompletedTreatmentProgrammeTeamScore + this.mySharedPathway.ConsistentlyCompliedWithCarePlansTeamScore;
  }

  public getDifferenceSectionB() {
    this.mySharedPathway.GoodAttitudeTowardsPeopleDiff = this.mySharedPathway.GoodAttitudeTowardsPeopleScore - this.mySharedPathway.GoodAttitudeTowardsPeopleTeamScore

    this.mySharedPathway.CanManageMyRiskToOthersDiff = this.mySharedPathway.CanManageMyRiskToOthersScore - this.mySharedPathway.CanManageMyRiskToOthersTeamScore

    this.mySharedPathway.CanManageMySetbacksDiff = this.mySharedPathway.CanManageMySetbacksScore - this.mySharedPathway.CanManageMySetbacksTeamScore

    this.mySharedPathway.UnsupervisedSettingsDiff = this.mySharedPathway.UnsupervisedSettingsScore - this.mySharedPathway.UnsupervisedSettingsTeamScore

    this.mySharedPathway.WillingToWorkWithTheTeamDiff = this.mySharedPathway.WillingToWorkWithTheTeamScore - this.mySharedPathway.WillingToWorkWithTheTeamTeamScore

    this.mySharedPathway.SuccessfullyCompletedTreatmentProgrammeDiff = this.mySharedPathway.SuccessfullyCompletedTreatmentProgrammeScore - this.mySharedPathway.SuccessfullyCompletedTreatmentProgrammeTeamScore

    this.mySharedPathway.ConsistentlyCompliedWithCarePlansDiff = this.mySharedPathway.ConsistentlyCompliedWithCarePlansScore - this.mySharedPathway.ConsistentlyCompliedWithCarePlansTeamScore;

    return (this.mySharedPathway.GoodAttitudeTowardsPeopleDiff +
      this.mySharedPathway.CanManageMyRiskToOthersDiff +
      this.mySharedPathway.CanManageMySetbacksDiff +
      this.mySharedPathway.UnsupervisedSettingsDiff +
      this.mySharedPathway.WillingToWorkWithTheTeamDiff +
      this.mySharedPathway.SuccessfullyCompletedTreatmentProgrammeDiff +
      this.mySharedPathway.ConsistentlyCompliedWithCarePlansDiff);
  }
  // section C

  public previousTotalSectionC() {
    if (this.lastPathwayDetails)
      return this.lastPathwayDetails.mentalHealthProblemFactorsScore + this.lastPathwayDetails.mentalHealthProblemAffectLifeSkillsScore + this.lastPathwayDetails.factorsIncreaseOrDecreaseRiskScore + this.lastPathwayDetails.livingConditionsAffectRiskScore + this.lastPathwayDetails.peopleAffectedByMyBehavioursScore + this.lastPathwayDetails.agreeWithTreatmentPlanOfferedScore + this.lastPathwayDetails.benefitedFromTheTreatmentsScore;
  }

  public previousTeamTotalSectionC() {
    if (this.lastPathwayDetails)
      return this.lastPathwayDetails.mentalHealthProblemFactorsTeamScore + this.lastPathwayDetails.mentalHealthProblemAffectLifeSkillsTeamScore + this.lastPathwayDetails.factorsIncreaseOrDecreaseRiskTeamScore + this.lastPathwayDetails.livingConditionsAffectRiskTeamScore + this.lastPathwayDetails.peopleAffectedByMyBehavioursTeamScore + this.lastPathwayDetails.agreeWithTreatmentPlanOfferedTeamScore + this.lastPathwayDetails.benefitedFromTheTreatmentsTeamScore;
  }

  public currentTotalSectionC() {
    if (this.mySharedPathway)
      return this.mySharedPathway.MentalHealthProblemFactorsScore + this.mySharedPathway.MentalHealthProblemAffectLifeSkillsScore + this.mySharedPathway.FactorsIncreaseOrDecreaseRiskScore + this.mySharedPathway.LivingConditionsAffectRiskScore + this.mySharedPathway.PeopleAffectedByMyBehavioursScore + this.mySharedPathway.AgreeWithTreatmentPlanOfferedScore + this.mySharedPathway.BenefitedFromTheTreatmentsScore;
  }

  public currentTeamTotalSectionC() {
    if (this.mySharedPathway)
      return this.mySharedPathway.MentalHealthProblemFactorsTeamScore + this.mySharedPathway.MentalHealthProblemAffectLifeSkillsTeamScore + this.mySharedPathway.FactorsIncreaseOrDecreaseRiskTeamScore + this.mySharedPathway.LivingConditionsAffectRiskTeamScore + this.mySharedPathway.PeopleAffectedByMyBehavioursTeamScore + this.mySharedPathway.AgreeWithTreatmentPlanOfferedTeamScore + this.mySharedPathway.BenefitedFromTheTreatmentsTeamScore;
  }

  public getDifferenceSectionC() {
    this.mySharedPathway.MentalHealthProblemFactorsDiff = this.mySharedPathway.MentalHealthProblemFactorsScore - this.mySharedPathway.MentalHealthProblemFactorsTeamScore;

    this.mySharedPathway.MentalHealthProblemAffectLifeSkillsDiff = this.mySharedPathway.MentalHealthProblemAffectLifeSkillsScore - this.mySharedPathway.MentalHealthProblemAffectLifeSkillsTeamScore;

    this.mySharedPathway.FactorsIncreaseOrDecreaseRiskDiff = this.mySharedPathway.FactorsIncreaseOrDecreaseRiskScore - this.mySharedPathway.FactorsIncreaseOrDecreaseRiskTeamScore;

    this.mySharedPathway.LivingConditionsAffectRiskDiff = this.mySharedPathway.LivingConditionsAffectRiskScore - this.mySharedPathway.LivingConditionsAffectRiskTeamScore;

    this.mySharedPathway.PeopleAffectedByMyBehavioursDiff = this.mySharedPathway.PeopleAffectedByMyBehavioursScore - this.mySharedPathway.PeopleAffectedByMyBehavioursTeamScore;

    this.mySharedPathway.AgreeWithTreatmentPlanOfferedDiff = this.mySharedPathway.AgreeWithTreatmentPlanOfferedScore - this.mySharedPathway.AgreeWithTreatmentPlanOfferedTeamScore;

    this.mySharedPathway.BenefitedFromTheTreatmentsDiff = this.mySharedPathway.BenefitedFromTheTreatmentsScore - this.mySharedPathway.BenefitedFromTheTreatmentsTeamScore;

    return (this.mySharedPathway.MentalHealthProblemFactorsDiff +
      this.mySharedPathway.MentalHealthProblemAffectLifeSkillsDiff +
      this.mySharedPathway.FactorsIncreaseOrDecreaseRiskDiff +
      this.mySharedPathway.LivingConditionsAffectRiskDiff +
      this.mySharedPathway.PeopleAffectedByMyBehavioursDiff +
      this.mySharedPathway.AgreeWithTreatmentPlanOfferedDiff +
      this.mySharedPathway.BenefitedFromTheTreatmentsDiff);
  }

  // section D
  public previousTotalSectionD() {
    if (this.lastPathwayDetails)
      return this.lastPathwayDetails.completedTheTreatmentProgrammeScore + this.lastPathwayDetails.managedToStopDrugAlcoholUseScoreScore + this.lastPathwayDetails.relapsePreventionPlanScore + this.lastPathwayDetails.notUsingDrugsAlcoholWhenLeftUnsupervisedScore + this.lastPathwayDetails.cooperateWithDrugAlcoholScreensScore;
  }

  public previousTeamTotalSectionD() {
    if (this.lastPathwayDetails)
      return this.lastPathwayDetails.completedTheTreatmentProgrammeTeamScore + this.lastPathwayDetails.managedToStopDrugAlcoholUseScoreTeamScore + this.lastPathwayDetails.relapsePreventionPlanTeamScore + this.lastPathwayDetails.notUsingDrugsAlcoholWhenLeftUnsupervisedTeamScore + this.lastPathwayDetails.cooperateWithDrugAlcoholScreensTeamScore;
  }

  public currentTotalSectionD() {
    if (this.mySharedPathway)
      return this.mySharedPathway.CompletedTheTreatmentProgrammeScore + this.mySharedPathway.ManagedToStopDrugAlcoholUseScoreScore + this.mySharedPathway.RelapsePreventionPlanScore + this.mySharedPathway.NotUsingDrugsAlcoholWhenLeftUnsupervisedScore + this.mySharedPathway.CooperateWithDrugAlcoholScreensScore;
  }

  public currentTeamTotalSectionD() {
    if (this.mySharedPathway)
      return this.mySharedPathway.CompletedTheTreatmentProgrammeTeamScore + this.mySharedPathway.ManagedToStopDrugAlcoholUseScoreTeamScore + this.mySharedPathway.RelapsePreventionPlanTeamScore + this.mySharedPathway.NotUsingDrugsAlcoholWhenLeftUnsupervisedTeamScore + this.mySharedPathway.CooperateWithDrugAlcoholScreensTeamScore;
  }

  public getDifferenceSectionD() {

    this.mySharedPathway.CompletedTheTreatmentProgrammeDiff = this.mySharedPathway.CompletedTheTreatmentProgrammeScore - this.mySharedPathway.CompletedTheTreatmentProgrammeTeamScore

    this.mySharedPathway.ManagedToStopDrugAlcoholUseScoreDiff = this.mySharedPathway.ManagedToStopDrugAlcoholUseScoreScore - this.mySharedPathway.ManagedToStopDrugAlcoholUseScoreTeamScore

    this.mySharedPathway.RelapsePreventionPlanDiff = this.mySharedPathway.RelapsePreventionPlanScore - this.mySharedPathway.RelapsePreventionPlanTeamScore

    this.mySharedPathway.NotUsingDrugsAlcoholWhenLeftUnsupervisedDiff = this.mySharedPathway.NotUsingDrugsAlcoholWhenLeftUnsupervisedScore - this.mySharedPathway.NotUsingDrugsAlcoholWhenLeftUnsupervisedTeamScore

    this.mySharedPathway.CooperateWithDrugAlcoholScreensDiff = this.mySharedPathway.CooperateWithDrugAlcoholScreensScore - this.mySharedPathway.CooperateWithDrugAlcoholScreensTeamScore


    return (this.mySharedPathway.CompletedTheTreatmentProgrammeDiff +
      this.mySharedPathway.ManagedToStopDrugAlcoholUseScoreDiff +
      this.mySharedPathway.RelapsePreventionPlanDiff +
      this.mySharedPathway.NotUsingDrugsAlcoholWhenLeftUnsupervisedDiff +
      this.mySharedPathway.CooperateWithDrugAlcoholScreensDiff);
  }
  // section E

  public previousTotalSectionE() {
    if (this.lastPathwayDetails)
      return this.lastPathwayDetails.planAboutMyFutureCareScore + this.lastPathwayDetails.planAboutMyPlacementScore + this.lastPathwayDetails.planAboutMySupportNetworksScore + this.lastPathwayDetails.willComplyWithTreatmentPlansScore + this.lastPathwayDetails.stressesIWillFaceOutsideHospitalScore;
  }

  public previousTeamTotalSectionE() {
    if (this.lastPathwayDetails)
      return this.lastPathwayDetails.planAboutMyFutureCareTeamScore + this.lastPathwayDetails.planAboutMyPlacementTeamScore + this.lastPathwayDetails.planAboutMySupportNetworksTeamScore + this.lastPathwayDetails.willComplyWithTreatmentPlansTeamScore + this.lastPathwayDetails.stressesIWillFaceOutsideHospitalTeamScore;
  }

  public currentTotalSectionE() {
    if (this.mySharedPathway)
      return this.mySharedPathway.PlanAboutMyFutureCareScore + this.mySharedPathway.PlanAboutMyPlacementScore + this.mySharedPathway.PlanAboutMySupportNetworksScore + this.mySharedPathway.WillComplyWithTreatmentPlansScore + this.mySharedPathway.StressesIWillFaceOutsideHospitalScore;
  }

  public currentTeamTotalSectionE() {
    if (this.mySharedPathway)
      return this.mySharedPathway.PlanAboutMyFutureCareTeamScore + this.mySharedPathway.PlanAboutMyPlacementTeamScore + this.mySharedPathway.PlanAboutMySupportNetworksTeamScore + this.mySharedPathway.WillComplyWithTreatmentPlansTeamScore + this.mySharedPathway.StressesIWillFaceOutsideHospitalTeamScore;
  }

  public getDifferenceSectionE() {
    this.mySharedPathway.PlanAboutMyFutureCareDiff = this.mySharedPathway.PlanAboutMyFutureCareScore - this.mySharedPathway.PlanAboutMyFutureCareTeamScore

    this.mySharedPathway.PlanAboutMyPlacementDiff = this.mySharedPathway.PlanAboutMyPlacementScore - this.mySharedPathway.PlanAboutMyPlacementTeamScore

    this.mySharedPathway.PlanAboutMySupportNetworksDiff = this.mySharedPathway.PlanAboutMySupportNetworksScore - this.mySharedPathway.PlanAboutMySupportNetworksTeamScore

    this.mySharedPathway.WillComplyWithTreatmentPlansDiff = this.mySharedPathway.WillComplyWithTreatmentPlansScore - this.mySharedPathway.WillComplyWithTreatmentPlansTeamScore

    this.mySharedPathway.StressesIWillFaceOutsideHospitalDiff = this.mySharedPathway.StressesIWillFaceOutsideHospitalScore - this.mySharedPathway.StressesIWillFaceOutsideHospitalTeamScore


    return (this.mySharedPathway.PlanAboutMyFutureCareDiff +
      this.mySharedPathway.PlanAboutMyPlacementDiff +
      this.mySharedPathway.PlanAboutMySupportNetworksDiff +
      this.mySharedPathway.WillComplyWithTreatmentPlansDiff +
      this.mySharedPathway.StressesIWillFaceOutsideHospitalDiff);
  }

  // section F
  public previousTotalSectionF() {
    if (this.lastPathwayDetails)
      return this.lastPathwayDetails.managingMySelfCareScore + this.lastPathwayDetails.physicalHealthProblemsAreWellManagedScore + this.lastPathwayDetails.notSufferingFromAnySideEffectsScore + this.lastPathwayDetails.physicalHealthWillBeCheckedScore;
  }

  public previousTeamTotalSectionF() {
    if (this.lastPathwayDetails)
      return this.lastPathwayDetails.managingMySelfCareTeamScore + this.lastPathwayDetails.physicalHealthProblemsAreWellManagedTeamScore + this.lastPathwayDetails.notSufferingFromAnySideEffectsTeamScore + this.lastPathwayDetails.physicalHealthWillBeCheckedTeamScore;
  }

  public currentTotalSectionF() {
    if (this.mySharedPathway)
      return this.mySharedPathway.ManagingMySelfCareScore + this.mySharedPathway.PhysicalHealthProblemsAreWellManagedScore + this.mySharedPathway.NotSufferingFromAnySideEffectsScore + this.mySharedPathway.PhysicalHealthWillBeCheckedScore;
  }

  public currentTeamTotalSectionF() {
    if (this.mySharedPathway)
      return this.mySharedPathway.ManagingMySelfCareTeamScore + this.mySharedPathway.PhysicalHealthProblemsAreWellManagedTeamScore + this.mySharedPathway.NotSufferingFromAnySideEffectsTeamScore + this.mySharedPathway.PhysicalHealthWillBeCheckedTeamScore;
  }

  public getDifferenceSectionF() {
    this.mySharedPathway.ManagingMySelfCareDiff = this.mySharedPathway.ManagingMySelfCareScore - this.mySharedPathway.ManagingMySelfCareTeamScore

    this.mySharedPathway.PhysicalHealthProblemsAreWellManagedDiff = this.mySharedPathway.PhysicalHealthProblemsAreWellManagedScore - this.mySharedPathway.PhysicalHealthProblemsAreWellManagedTeamScore

    this.mySharedPathway.NotSufferingFromAnySideEffectsDiff = this.mySharedPathway.NotSufferingFromAnySideEffectsScore - this.mySharedPathway.NotSufferingFromAnySideEffectsTeamScore

    this.mySharedPathway.PhysicalHealthWillBeCheckedDiff = this.mySharedPathway.PhysicalHealthWillBeCheckedScore - this.mySharedPathway.PhysicalHealthWillBeCheckedTeamScore


    return (this.mySharedPathway.ManagingMySelfCareDiff +
      this.mySharedPathway.PhysicalHealthProblemsAreWellManagedDiff +
      this.mySharedPathway.NotSufferingFromAnySideEffectsDiff +
      this.mySharedPathway.PhysicalHealthWillBeCheckedDiff);
  }
  // section G

  public previousTotalSectionG() {
    if (this.lastPathwayDetails)
      return this.lastPathwayDetails.skillsToGetOnWithPeopleScore + this.lastPathwayDetails.wellBalancedWeeklyRoutineScore + this.lastPathwayDetails.consistentlyManageDailyLivingSkillsScore + this.lastPathwayDetails.rangeOfInterestsScore;
  }

  public previousTeamTotalSectionG() {
    if (this.lastPathwayDetails)
      return this.lastPathwayDetails.skillsToGetOnWithPeopleTeamScore + this.lastPathwayDetails.wellBalancedWeeklyRoutineTeamScore + this.lastPathwayDetails.consistentlyManageDailyLivingSkillsTeamScore + this.lastPathwayDetails.rangeOfInterestsTeamScore;
  }

  public currentTotalSectionG() {
    if (this.mySharedPathway)
      return this.mySharedPathway.SkillsToGetOnWithPeopleScore + this.mySharedPathway.WellBalancedWeeklyRoutineScore + this.mySharedPathway.ConsistentlyManageDailyLivingSkillsScore + this.mySharedPathway.RangeOfInterestsScore;
  }

  public currentTeamTotalSectionG() {
    if (this.mySharedPathway)
      return this.mySharedPathway.SkillsToGetOnWithPeopleTeamScore + this.mySharedPathway.WellBalancedWeeklyRoutineTeamScore + this.mySharedPathway.ConsistentlyManageDailyLivingSkillsTeamScore + this.mySharedPathway.RangeOfInterestsTeamScore;
  }

  public getDifferenceSectionG() {
    this.mySharedPathway.SkillsToGetOnWithPeopleDiff = this.mySharedPathway.SkillsToGetOnWithPeopleScore - this.mySharedPathway.SkillsToGetOnWithPeopleTeamScore

    this.mySharedPathway.WellBalancedWeeklyRoutineDiff = this.mySharedPathway.WellBalancedWeeklyRoutineScore - this.mySharedPathway.WellBalancedWeeklyRoutineTeamScore

    this.mySharedPathway.ConsistentlyManageDailyLivingSkillsDiff = this.mySharedPathway.ConsistentlyManageDailyLivingSkillsScore - this.mySharedPathway.ConsistentlyManageDailyLivingSkillsTeamScore

    this.mySharedPathway.RangeOfInterestsDiff = this.mySharedPathway.RangeOfInterestsScore - this.mySharedPathway.RangeOfInterestsTeamScore


    return (this.mySharedPathway.SkillsToGetOnWithPeopleDiff +
      this.mySharedPathway.WellBalancedWeeklyRoutineDiff +
      this.mySharedPathway.ConsistentlyManageDailyLivingSkillsDiff +
      this.mySharedPathway.RangeOfInterestsDiff);
  }

  // section H

  public previousTotalSectionH() {
    if (this.lastPathwayDetails)
      return this.lastPathwayDetails.positiveTherapeuticRelationshipWithClinicalTeamScore + this.lastPathwayDetails.beenAbleToGetOnWithOtherServiceUsersScore + this.lastPathwayDetails.familyRelationshipsFreeFromConflictScore + this.lastPathwayDetails.shownProblemOfSexualNatureScore;
  }

  public previousTeamTotalSectionH() {
    if (this.lastPathwayDetails)
      return this.lastPathwayDetails.positiveTherapeuticRelationshipWithClinicalTeamTeamScore + this.lastPathwayDetails.beenAbleToGetOnWithOtherServiceUsersTeamScore + this.lastPathwayDetails.familyRelationshipsFreeFromConflictTeamScore + this.lastPathwayDetails.shownProblemOfSexualNatureTeamScore;
  }

  public currentTotalSectionH() {
    if (this.mySharedPathway)
      return this.mySharedPathway.PositiveTherapeuticRelationshipWithClinicalTeamScore + this.mySharedPathway.BeenAbleToGetOnWithOtherServiceUsersScore + this.mySharedPathway.FamilyRelationshipsFreeFromConflictScore + this.mySharedPathway.ShownProblemOfSexualNatureScore;
  }

  public currentTeamTotalSectionH() {
    if (this.mySharedPathway)
      return this.mySharedPathway.PositiveTherapeuticRelationshipWithClinicalTeamTeamScore + this.mySharedPathway.BeenAbleToGetOnWithOtherServiceUsersTeamScore + this.mySharedPathway.FamilyRelationshipsFreeFromConflictTeamScore + this.mySharedPathway.ShownProblemOfSexualNatureTeamScore;
  }

  public getDifferenceSectionH() {

    this.mySharedPathway.PositiveTherapeuticRelationshipWithClinicalTeamDiff = this.mySharedPathway.PositiveTherapeuticRelationshipWithClinicalTeamScore - this.mySharedPathway.PositiveTherapeuticRelationshipWithClinicalTeamTeamScore

    this.mySharedPathway.BeenAbleToGetOnWithOtherServiceUsersDiff = this.mySharedPathway.BeenAbleToGetOnWithOtherServiceUsersScore - this.mySharedPathway.BeenAbleToGetOnWithOtherServiceUsersTeamScore

    this.mySharedPathway.FamilyRelationshipsFreeFromConflictDiff = this.mySharedPathway.FamilyRelationshipsFreeFromConflictScore - this.mySharedPathway.FamilyRelationshipsFreeFromConflictTeamScore

    this.mySharedPathway.ShownProblemOfSexualNatureDiff = this.mySharedPathway.ShownProblemOfSexualNatureScore - this.mySharedPathway.ShownProblemOfSexualNatureTeamScore

    return (
      this.mySharedPathway.PositiveTherapeuticRelationshipWithClinicalTeamDiff +
      this.mySharedPathway.BeenAbleToGetOnWithOtherServiceUsersDiff +
      this.mySharedPathway.FamilyRelationshipsFreeFromConflictDiff +
      this.mySharedPathway.ShownProblemOfSexualNatureDiff);

  }

  private getPreviousPathway(sharedPathwayId: number) {
    if (sharedPathwayId) {
      this.sharedPathwayService.getPreviousPathway(sharedPathwayId).subscribe(response => {
        if (response) {
          this.lastPathwayDetails = response;
        }
      }, err => {
        console.error("could not fetch  record::" + err.error);
      })
    }
  }
}
