import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MySharedPathwayService } from 'src/app/services/my-shared-pathway.service';
import { UpdateLogService } from 'src/app/services/update-log.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { CirculatedTo } from 'src/app/shared/enums/circulated-to.enum';
import { MySharedPathway } from 'src/app/shared/models/my-shared-pathway';
import { UpdateLog } from 'src/app/shared/models/update-log';
import { User } from 'src/app/shared/models/user';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-show-my-shared-pathway',
  templateUrl: './show-my-shared-pathway.component.html',
  styleUrls: ['./show-my-shared-pathway.component.scss']
})
export class ShowMySharedPathwayComponent extends BaseComponent implements OnInit {
  @Input() userData: any;
  @Input() sharedPathwayData: any;
  @Output() showPathways: EventEmitter<any> = new EventEmitter<any>();


  public circulatedToEnum = CirculatedTo;
  public circulatedToArray: Array<any> = [];
  public circulateTo: Array<number> = [];
  public usersList: User[] = [];
  public mySharedPathway: MySharedPathway;
  public tabIndex: number;
  public active: number;
  public lastPathwayDetails: MySharedPathway;
  public todayDate: Date;
  public logList: Array<UpdateLog> = [];
  public showLogDetail: boolean = false;
  public previousValues;


  constructor(private updateLogServices: UpdateLogService, private userService: UserService, private sharedPathwayService: MySharedPathwayService) { super(); }

  ngOnInit(): void {
    this.onTabChange(1);
    this.circulatedToArray = this.getCirculatedTo();
    this.getUsers();
    if (!this.userData) {
      alert("Something went wrong!!");
    }
    if (this.sharedPathwayData) {
      // this.mySharedPathway = new MySharedPathway();
      // this.mySharedPathway = this.sharedPathwayData;
      this.setValues();
      this.getLog();
      this.getPreviousPathway(this.sharedPathwayData.id);
    }
  }

  private getLog() {
    this.updateLogServices.getLogs('SharedPathway', this.sharedPathwayData.id).subscribe(response => {
      if (response.length>0) {
        this.logList = response;
      }
    }, err => {
      alert(err.error);
    })
  }

  private getSharedPathway(pathwayId: number) {
    if (pathwayId) {
      this.sharedPathwayService.getSharedPathway(pathwayId).subscribe(response => {
        if (response) {
          this.mySharedPathway = response;
          this.mySharedPathway.circulatedTo.split('|').forEach(element => {
            this.circulateTo.push(Number(element));
          });
        }
      }, err => {
        alert(err.error);
        this.showPathways.emit();
      })
    }
  }

  public setValues() {
    this.getSharedPathway(this.sharedPathwayData.id);
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

  public showLogDetails(previousValues) {
    this.previousValues = JSON.parse(previousValues);
    this.showLogDetail = true;
       
  }

  public showAllLogs() {
    this.showLogDetail = false;
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
      return this.mySharedPathway.positiveStepsTowardsRecoveryScore + this.mySharedPathway.independentAndManagingSelfCareScore + this.mySharedPathway.wellControlledSymptomsScore + this.mySharedPathway.thinkBeforeActScore + this.mySharedPathway.takeMedicationResponsiblyScore + this.mySharedPathway.copingStrategiesScore
  }

  public currentTeamTotalSectionA() {
    if (this.mySharedPathway)
      return this.mySharedPathway.positiveStepsTowardsRecoveryTeamScore + this.mySharedPathway.independentAndManagingSelfCareTeamScore + this.mySharedPathway.wellControlledSymptomsTeamScore + this.mySharedPathway.thinkBeforeActTeamScore + this.mySharedPathway.takeMedicationResponsiblyTeamScore + this.mySharedPathway.copingStrategiesTeamScore
  }

  public getDifferenceSectionA() {

    this.mySharedPathway.positiveStepsTowardsRecoveryDiff = this.mySharedPathway.positiveStepsTowardsRecoveryScore - this.mySharedPathway.positiveStepsTowardsRecoveryTeamScore;

    this.mySharedPathway.independentAndManagingSelfCareDiff = this.mySharedPathway.independentAndManagingSelfCareScore - this.mySharedPathway.independentAndManagingSelfCareTeamScore;

    this.mySharedPathway.wellControlledSymptomsDiff = this.mySharedPathway.wellControlledSymptomsScore - this.mySharedPathway.wellControlledSymptomsTeamScore;

    this.mySharedPathway.thinkBeforeActDiff = this.mySharedPathway.thinkBeforeActScore - this.mySharedPathway.thinkBeforeActTeamScore;

    this.mySharedPathway.takeMedicationResponsiblyDiff = this.mySharedPathway.takeMedicationResponsiblyScore - this.mySharedPathway.takeMedicationResponsiblyTeamScore;

    this.mySharedPathway.copingStrategiesDiff = this.mySharedPathway.copingStrategiesScore - this.mySharedPathway.copingStrategiesTeamScore;


    return (this.mySharedPathway.positiveStepsTowardsRecoveryDiff +
      this.mySharedPathway.independentAndManagingSelfCareDiff +
      this.mySharedPathway.wellControlledSymptomsDiff +
      this.mySharedPathway.thinkBeforeActDiff +
      this.mySharedPathway.takeMedicationResponsiblyDiff +
      this.mySharedPathway.copingStrategiesDiff);
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
      return this.mySharedPathway.goodAttitudeTowardsPeopleScore + this.mySharedPathway.canManageMyRiskToOthersScore + this.mySharedPathway.canManageMySetbacksScore + this.mySharedPathway.unsupervisedSettingsScore + this.mySharedPathway.willingToWorkWithTheTeamScore + this.mySharedPathway.successfullyCompletedTreatmentProgrammeScore + this.mySharedPathway.consistentlyCompliedWithCarePlansScore;
  }

  public currentTeamTotalSectionB() {
    if (this.mySharedPathway)
      return this.mySharedPathway.goodAttitudeTowardsPeopleTeamScore + this.mySharedPathway.canManageMyRiskToOthersTeamScore + this.mySharedPathway.canManageMySetbacksTeamScore + this.mySharedPathway.unsupervisedSettingsTeamScore + this.mySharedPathway.willingToWorkWithTheTeamTeamScore + this.mySharedPathway.successfullyCompletedTreatmentProgrammeTeamScore + this.mySharedPathway.consistentlyCompliedWithCarePlansTeamScore;
  }

  public getDifferenceSectionB() {
    this.mySharedPathway.goodAttitudeTowardsPeopleDiff = this.mySharedPathway.goodAttitudeTowardsPeopleScore - this.mySharedPathway.goodAttitudeTowardsPeopleTeamScore

    this.mySharedPathway.canManageMyRiskToOthersDiff = this.mySharedPathway.canManageMyRiskToOthersScore - this.mySharedPathway.canManageMyRiskToOthersTeamScore

    this.mySharedPathway.canManageMySetbacksDiff = this.mySharedPathway.canManageMySetbacksScore - this.mySharedPathway.canManageMySetbacksTeamScore

    this.mySharedPathway.unsupervisedSettingsDiff = this.mySharedPathway.unsupervisedSettingsScore - this.mySharedPathway.unsupervisedSettingsTeamScore

    this.mySharedPathway.willingToWorkWithTheTeamDiff = this.mySharedPathway.willingToWorkWithTheTeamScore - this.mySharedPathway.willingToWorkWithTheTeamTeamScore

    this.mySharedPathway.successfullyCompletedTreatmentProgrammeDiff = this.mySharedPathway.successfullyCompletedTreatmentProgrammeScore - this.mySharedPathway.successfullyCompletedTreatmentProgrammeTeamScore

    this.mySharedPathway.consistentlyCompliedWithCarePlansDiff = this.mySharedPathway.consistentlyCompliedWithCarePlansScore - this.mySharedPathway.consistentlyCompliedWithCarePlansTeamScore;

    return (this.mySharedPathway.goodAttitudeTowardsPeopleDiff +
      this.mySharedPathway.canManageMyRiskToOthersDiff +
      this.mySharedPathway.canManageMySetbacksDiff +
      this.mySharedPathway.unsupervisedSettingsDiff +
      this.mySharedPathway.willingToWorkWithTheTeamDiff +
      this.mySharedPathway.successfullyCompletedTreatmentProgrammeDiff +
      this.mySharedPathway.consistentlyCompliedWithCarePlansDiff);
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
      return this.mySharedPathway.mentalHealthProblemFactorsScore + this.mySharedPathway.mentalHealthProblemAffectLifeSkillsScore + this.mySharedPathway.factorsIncreaseOrDecreaseRiskScore + this.mySharedPathway.livingConditionsAffectRiskScore + this.mySharedPathway.peopleAffectedByMyBehavioursScore + this.mySharedPathway.agreeWithTreatmentPlanOfferedScore + this.mySharedPathway.benefitedFromTheTreatmentsScore;
  }

  public currentTeamTotalSectionC() {
    if (this.mySharedPathway)
      return this.mySharedPathway.mentalHealthProblemFactorsTeamScore + this.mySharedPathway.mentalHealthProblemAffectLifeSkillsTeamScore + this.mySharedPathway.factorsIncreaseOrDecreaseRiskTeamScore + this.mySharedPathway.livingConditionsAffectRiskTeamScore + this.mySharedPathway.peopleAffectedByMyBehavioursTeamScore + this.mySharedPathway.agreeWithTreatmentPlanOfferedTeamScore + this.mySharedPathway.benefitedFromTheTreatmentsTeamScore;
  }

  public getDifferenceSectionC() {
    this.mySharedPathway.mentalHealthProblemFactorsDiff = this.mySharedPathway.mentalHealthProblemFactorsScore - this.mySharedPathway.mentalHealthProblemFactorsTeamScore;

    this.mySharedPathway.mentalHealthProblemAffectLifeSkillsDiff = this.mySharedPathway.mentalHealthProblemAffectLifeSkillsScore - this.mySharedPathway.mentalHealthProblemAffectLifeSkillsTeamScore;

    this.mySharedPathway.factorsIncreaseOrDecreaseRiskDiff = this.mySharedPathway.factorsIncreaseOrDecreaseRiskScore - this.mySharedPathway.factorsIncreaseOrDecreaseRiskTeamScore;

    this.mySharedPathway.livingConditionsAffectRiskDiff = this.mySharedPathway.livingConditionsAffectRiskScore - this.mySharedPathway.livingConditionsAffectRiskTeamScore;

    this.mySharedPathway.peopleAffectedByMyBehavioursDiff = this.mySharedPathway.peopleAffectedByMyBehavioursScore - this.mySharedPathway.peopleAffectedByMyBehavioursTeamScore;

    this.mySharedPathway.agreeWithTreatmentPlanOfferedDiff = this.mySharedPathway.agreeWithTreatmentPlanOfferedScore - this.mySharedPathway.agreeWithTreatmentPlanOfferedTeamScore;

    this.mySharedPathway.benefitedFromTheTreatmentsDiff = this.mySharedPathway.benefitedFromTheTreatmentsScore - this.mySharedPathway.benefitedFromTheTreatmentsTeamScore;

    return (this.mySharedPathway.mentalHealthProblemFactorsDiff +
      this.mySharedPathway.mentalHealthProblemAffectLifeSkillsDiff +
      this.mySharedPathway.factorsIncreaseOrDecreaseRiskDiff +
      this.mySharedPathway.livingConditionsAffectRiskDiff +
      this.mySharedPathway.peopleAffectedByMyBehavioursDiff +
      this.mySharedPathway.agreeWithTreatmentPlanOfferedDiff +
      this.mySharedPathway.benefitedFromTheTreatmentsDiff);
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
      return this.mySharedPathway.completedTheTreatmentProgrammeScore + this.mySharedPathway.managedToStopDrugAlcoholUseScoreScore + this.mySharedPathway.relapsePreventionPlanScore + this.mySharedPathway.notUsingDrugsAlcoholWhenLeftUnsupervisedScore + this.mySharedPathway.cooperateWithDrugAlcoholScreensScore;
  }

  public currentTeamTotalSectionD() {
    if (this.mySharedPathway)
      return this.mySharedPathway.completedTheTreatmentProgrammeTeamScore + this.mySharedPathway.managedToStopDrugAlcoholUseScoreTeamScore + this.mySharedPathway.relapsePreventionPlanTeamScore + this.mySharedPathway.notUsingDrugsAlcoholWhenLeftUnsupervisedTeamScore + this.mySharedPathway.cooperateWithDrugAlcoholScreensTeamScore;
  }

  public getDifferenceSectionD() {

    this.mySharedPathway.completedTheTreatmentProgrammeDiff = this.mySharedPathway.completedTheTreatmentProgrammeScore - this.mySharedPathway.completedTheTreatmentProgrammeTeamScore

    this.mySharedPathway.managedToStopDrugAlcoholUseScoreDiff = this.mySharedPathway.managedToStopDrugAlcoholUseScoreScore - this.mySharedPathway.managedToStopDrugAlcoholUseScoreTeamScore

    this.mySharedPathway.relapsePreventionPlanDiff = this.mySharedPathway.relapsePreventionPlanScore - this.mySharedPathway.relapsePreventionPlanTeamScore

    this.mySharedPathway.notUsingDrugsAlcoholWhenLeftUnsupervisedDiff = this.mySharedPathway.notUsingDrugsAlcoholWhenLeftUnsupervisedScore - this.mySharedPathway.notUsingDrugsAlcoholWhenLeftUnsupervisedTeamScore

    this.mySharedPathway.cooperateWithDrugAlcoholScreensDiff = this.mySharedPathway.cooperateWithDrugAlcoholScreensScore - this.mySharedPathway.cooperateWithDrugAlcoholScreensTeamScore


    return (this.mySharedPathway.completedTheTreatmentProgrammeDiff +
      this.mySharedPathway.managedToStopDrugAlcoholUseScoreDiff +
      this.mySharedPathway.relapsePreventionPlanDiff +
      this.mySharedPathway.notUsingDrugsAlcoholWhenLeftUnsupervisedDiff +
      this.mySharedPathway.cooperateWithDrugAlcoholScreensDiff);
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
      return this.mySharedPathway.planAboutMyFutureCareScore + this.mySharedPathway.planAboutMyPlacementScore + this.mySharedPathway.planAboutMySupportNetworksScore + this.mySharedPathway.willComplyWithTreatmentPlansScore + this.mySharedPathway.stressesIWillFaceOutsideHospitalScore;
  }

  public currentTeamTotalSectionE() {
    if (this.mySharedPathway)
      return this.mySharedPathway.planAboutMyFutureCareTeamScore + this.mySharedPathway.planAboutMyPlacementTeamScore + this.mySharedPathway.planAboutMySupportNetworksTeamScore + this.mySharedPathway.willComplyWithTreatmentPlansTeamScore + this.mySharedPathway.stressesIWillFaceOutsideHospitalTeamScore;
  }

  public getDifferenceSectionE() {
    this.mySharedPathway.planAboutMyFutureCareDiff = this.mySharedPathway.planAboutMyFutureCareScore - this.mySharedPathway.planAboutMyFutureCareTeamScore

    this.mySharedPathway.planAboutMyPlacementDiff = this.mySharedPathway.planAboutMyPlacementScore - this.mySharedPathway.planAboutMyPlacementTeamScore

    this.mySharedPathway.planAboutMySupportNetworksDiff = this.mySharedPathway.planAboutMySupportNetworksScore - this.mySharedPathway.planAboutMySupportNetworksTeamScore

    this.mySharedPathway.willComplyWithTreatmentPlansDiff = this.mySharedPathway.willComplyWithTreatmentPlansScore - this.mySharedPathway.willComplyWithTreatmentPlansTeamScore

    this.mySharedPathway.stressesIWillFaceOutsideHospitalDiff = this.mySharedPathway.stressesIWillFaceOutsideHospitalScore - this.mySharedPathway.stressesIWillFaceOutsideHospitalTeamScore


    return (this.mySharedPathway.planAboutMyFutureCareDiff +
      this.mySharedPathway.planAboutMyPlacementDiff +
      this.mySharedPathway.planAboutMySupportNetworksDiff +
      this.mySharedPathway.willComplyWithTreatmentPlansDiff +
      this.mySharedPathway.stressesIWillFaceOutsideHospitalDiff);
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
      return this.mySharedPathway.managingMySelfCareScore + this.mySharedPathway.physicalHealthProblemsAreWellManagedScore + this.mySharedPathway.notSufferingFromAnySideEffectsScore + this.mySharedPathway.physicalHealthWillBeCheckedScore;
  }

  public currentTeamTotalSectionF() {
    if (this.mySharedPathway)
      return this.mySharedPathway.managingMySelfCareTeamScore + this.mySharedPathway.physicalHealthProblemsAreWellManagedTeamScore + this.mySharedPathway.notSufferingFromAnySideEffectsTeamScore + this.mySharedPathway.physicalHealthWillBeCheckedTeamScore;
  }

  public getDifferenceSectionF() {
    this.mySharedPathway.managingMySelfCareDiff = this.mySharedPathway.managingMySelfCareScore - this.mySharedPathway.managingMySelfCareTeamScore

    this.mySharedPathway.physicalHealthProblemsAreWellManagedDiff = this.mySharedPathway.physicalHealthProblemsAreWellManagedScore - this.mySharedPathway.physicalHealthProblemsAreWellManagedTeamScore

    this.mySharedPathway.notSufferingFromAnySideEffectsDiff = this.mySharedPathway.notSufferingFromAnySideEffectsScore - this.mySharedPathway.notSufferingFromAnySideEffectsTeamScore

    this.mySharedPathway.physicalHealthWillBeCheckedDiff = this.mySharedPathway.physicalHealthWillBeCheckedScore - this.mySharedPathway.physicalHealthWillBeCheckedTeamScore


    return (this.mySharedPathway.managingMySelfCareDiff +
      this.mySharedPathway.physicalHealthProblemsAreWellManagedDiff +
      this.mySharedPathway.notSufferingFromAnySideEffectsDiff +
      this.mySharedPathway.physicalHealthWillBeCheckedDiff);
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
      return this.mySharedPathway.skillsToGetOnWithPeopleScore + this.mySharedPathway.wellBalancedWeeklyRoutineScore + this.mySharedPathway.consistentlyManageDailyLivingSkillsScore + this.mySharedPathway.rangeOfInterestsScore;
  }

  public currentTeamTotalSectionG() {
    if (this.mySharedPathway)
      return this.mySharedPathway.skillsToGetOnWithPeopleTeamScore + this.mySharedPathway.wellBalancedWeeklyRoutineTeamScore + this.mySharedPathway.consistentlyManageDailyLivingSkillsTeamScore + this.mySharedPathway.rangeOfInterestsTeamScore;
  }

  public getDifferenceSectionG() {
    this.mySharedPathway.skillsToGetOnWithPeopleDiff = this.mySharedPathway.skillsToGetOnWithPeopleScore - this.mySharedPathway.skillsToGetOnWithPeopleTeamScore

    this.mySharedPathway.wellBalancedWeeklyRoutineDiff = this.mySharedPathway.wellBalancedWeeklyRoutineScore - this.mySharedPathway.wellBalancedWeeklyRoutineTeamScore

    this.mySharedPathway.consistentlyManageDailyLivingSkillsDiff = this.mySharedPathway.consistentlyManageDailyLivingSkillsScore - this.mySharedPathway.consistentlyManageDailyLivingSkillsTeamScore

    this.mySharedPathway.rangeOfInterestsDiff = this.mySharedPathway.rangeOfInterestsScore - this.mySharedPathway.rangeOfInterestsTeamScore


    return (this.mySharedPathway.skillsToGetOnWithPeopleDiff +
      this.mySharedPathway.wellBalancedWeeklyRoutineDiff +
      this.mySharedPathway.consistentlyManageDailyLivingSkillsDiff +
      this.mySharedPathway.rangeOfInterestsDiff);
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
      return this.mySharedPathway.positiveTherapeuticRelationshipWithClinicalTeamScore + this.mySharedPathway.beenAbleToGetOnWithOtherServiceUsersScore + this.mySharedPathway.familyRelationshipsFreeFromConflictScore + this.mySharedPathway.shownProblemOfSexualNatureScore;
  }

  public currentTeamTotalSectionH() {
    if (this.mySharedPathway)
      return this.mySharedPathway.positiveTherapeuticRelationshipWithClinicalTeamTeamScore + this.mySharedPathway.beenAbleToGetOnWithOtherServiceUsersTeamScore + this.mySharedPathway.familyRelationshipsFreeFromConflictTeamScore + this.mySharedPathway.shownProblemOfSexualNatureTeamScore;
  }

  public getDifferenceSectionH() {

    this.mySharedPathway.positiveTherapeuticRelationshipWithClinicalTeamDiff = this.mySharedPathway.positiveTherapeuticRelationshipWithClinicalTeamScore - this.mySharedPathway.positiveTherapeuticRelationshipWithClinicalTeamTeamScore

    this.mySharedPathway.beenAbleToGetOnWithOtherServiceUsersDiff = this.mySharedPathway.beenAbleToGetOnWithOtherServiceUsersScore - this.mySharedPathway.beenAbleToGetOnWithOtherServiceUsersTeamScore

    this.mySharedPathway.familyRelationshipsFreeFromConflictDiff = this.mySharedPathway.familyRelationshipsFreeFromConflictScore - this.mySharedPathway.familyRelationshipsFreeFromConflictTeamScore

    this.mySharedPathway.shownProblemOfSexualNatureDiff = this.mySharedPathway.shownProblemOfSexualNatureScore - this.mySharedPathway.shownProblemOfSexualNatureTeamScore

    return (
      this.mySharedPathway.positiveTherapeuticRelationshipWithClinicalTeamDiff +
      this.mySharedPathway.beenAbleToGetOnWithOtherServiceUsersDiff +
      this.mySharedPathway.familyRelationshipsFreeFromConflictDiff +
      this.mySharedPathway.shownProblemOfSexualNatureDiff);

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
