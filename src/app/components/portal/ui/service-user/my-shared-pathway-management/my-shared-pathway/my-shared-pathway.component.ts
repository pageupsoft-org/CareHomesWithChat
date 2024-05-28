import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MySharedPathwayService } from 'src/app/services/my-shared-pathway.service';
import { UpdateLogService } from 'src/app/services/update-log.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { CirculatedTo } from 'src/app/shared/enums/circulated-to.enum';
import { MySharedPathway } from 'src/app/shared/models/my-shared-pathway';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { PlansAndProgresses } from 'src/app/shared/models/plan-and-progress';
import { SummaryOutcomePlans } from 'src/app/shared/models/summary-outcome-plans';
import { UpdateLog } from 'src/app/shared/models/update-log';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/util/Constants';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-my-shared-pathway',
  templateUrl: './my-shared-pathway.component.html',
  styleUrls: ['./my-shared-pathway.component.scss']
})
export class MySharedPathwayComponent extends BaseComponent implements OnInit {
  @Input() userData: PatientAdmission;
  @Input() sharedPathwayData: MySharedPathway;
  @Input() isReload: boolean;
  @Output() showPathways: EventEmitter<any> = new EventEmitter<any>();

  public circulatedToEnum = CirculatedTo;
  public circulatedToArray: Array<any> = [];
  public circulateTo: Array<number> = [];
  public isCirculated: boolean;
  public usersList: User[] = [];
  public mySharedPathway: MySharedPathway;
  public tabIndex: number;
  public active: number;
  public showLabel: boolean = false;
  public lastPathwayDetails: MySharedPathway;
  public planAndProgress: PlansAndProgresses = new PlansAndProgresses();
  public summaryOutcomePlan: SummaryOutcomePlans = new SummaryOutcomePlans();
  public statusColor: Array<any> = [];
  public todayDate: Date;
  public isEdit: boolean = false;
  public logList: Array<UpdateLog> = [];
  public currentUserId: number = 0;

  constructor(private updateLogServices: UpdateLogService, private userService: UserService, private sharedPathwayService: MySharedPathwayService, private router: Router) { super(); }

  ngOnInit(): void {
    this.onTabChange(1);
    this.circulatedToArray = this.getCirculatedTo();
    this.getUsers();
    this.todayDate = new Date();
    if (!this.userData) {
      this.showLabel = true;
    }
    if (this.sharedPathwayData) {
      this.isEdit = true;
      this.setValues();
      this.getPreviousPathway(this.sharedPathwayData.id);
      this.getLog();
    } else {
      this.mySharedPathway = new MySharedPathway();
      this.getLatestSharedPathway(this.userData.id);
      this.mySharedPathway.completedBy = Number(JSON.parse(localStorage.getItem('_identity')).id);
      this.mySharedPathway.locationId = this.userData.locationId;
      this.mySharedPathway.careHomeId = this.userData.careHomeId ;
      if (this.currentUserRole == this.userType.Admin || this.currentUserRole == this.userType.SuperUser) {
        this.mySharedPathway.signOffBy = Number(JSON.parse(localStorage.getItem('_identity')).id);
        this.mySharedPathway.isSignOff = true;
      }
    }
  }

  public setValues() {
    this.currentUserId = Number((localStorage.getItem('_identity')) ? JSON.parse(localStorage.getItem('_identity')).id : '');
    this.mySharedPathway = new MySharedPathway();
    this.getSharedPathway(this.sharedPathwayData.id);

    // this.mySharedPathway = this.sharedPathwayData;

  }

  public changeCirculated(option, event) {
    if (event.target.checked) {
      this.circulateTo.push(option.value);
    } else {
      for (var i = 0; i < this.circulatedToArray.length; i++) {
        if (this.circulateTo[i] == option.value) {
          this.circulateTo.splice(i, 1);
        }
      }
    }

    this.mySharedPathway.circulatedTo = this.circulateTo.join("|");
  }

  getUsers() {
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

  public validate(index) {

    let current_tab = index - 1;
    let flag = true
    if (current_tab == 1) {
      flag = this.validateSectionA()
    }
    else if (current_tab == 2) {
      flag = this.validateSectionB()
    }
    else if (current_tab == 3) {
      flag = this.validateSectionC()
    }
    else if (current_tab == 4) {
      flag = this.validateSectionD()
    }
    else if (current_tab == 5) {
      flag = this.validateSectionE()
    }
    else if (current_tab == 6) {
      flag = this.validateSectionF()
    }
    else if (current_tab == 7) {
      flag = this.validateSectionG()
    }
    else {
      flag = this.validateSectionH()
    }
    if (!flag) {
      alert('Please fill all fields or skip this section');
    }
    else {
      this.onTabChange(index);
    }
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

  private validateSectionA() {

    if (this.mySharedPathway.sectionANote == null || this.mySharedPathway.sectionANote.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.mySharedPathway.sectionADisagreementNote == null || this.mySharedPathway.sectionADisagreementNote.replace(/\s/g, "").length == 0) {
      return false;
    }
    else {
      return true;
    }
  }

  private validateSectionB() {
    if (this.mySharedPathway.sectionBNote == null || this.mySharedPathway.sectionBNote.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.mySharedPathway.sectionBDisagreementNote == null || this.mySharedPathway.sectionBDisagreementNote.replace(/\s/g, "").length == 0) {
      return false;
    }

    else {
      return true;
    }
  }

  private validateSectionC() {

    if (this.mySharedPathway.sectionCNote == null || this.mySharedPathway.sectionCNote.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.mySharedPathway.sectionCDisagreementNote == null || this.mySharedPathway.sectionCDisagreementNote.replace(/\s/g, "").length == 0) {
      return false;
    }

    else {
      return true;
    }
  }

  private validateSectionD() {

    if (this.mySharedPathway.sectionDNote == null || this.mySharedPathway.sectionDNote.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.mySharedPathway.sectionDDisagreementNote == null || this.mySharedPathway.sectionDDisagreementNote.replace(/\s/g, "").length == 0) {
      return false;
    }

    else {
      return true;
    }
  }

  private validateSectionE() {

    if (this.mySharedPathway.sectionENote == null || this.mySharedPathway.sectionENote.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.mySharedPathway.sectionEDisagreementNote == null || this.mySharedPathway.sectionEDisagreementNote.replace(/\s/g, "").length == 0) {
      return false;
    }

    else {
      return true;
    }
  }

  private validateSectionF() {

    if (this.mySharedPathway.sectionFNote == null || this.mySharedPathway.sectionFNote.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.mySharedPathway.sectionFDisagreementNote == null || this.mySharedPathway.sectionFDisagreementNote.replace(/\s/g, "").length == 0) {
      return false;
    }

    else {
      return true;
    }
  }

  private validateSectionG() {

    if (this.mySharedPathway.sectionGNote == null || this.mySharedPathway.sectionGNote.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.mySharedPathway.sectionGDisagreementNote == null || this.mySharedPathway.sectionGDisagreementNote.replace(/\s/g, "").length == 0) {
      return false;
    }

    else {
      return true;
    }
  }

  private validateSectionH() {

    if (this.mySharedPathway.sectionHNote == null || this.mySharedPathway.sectionHNote.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.mySharedPathway.sectionHDisagreementNote == null || this.mySharedPathway.sectionHDisagreementNote.replace(/\s/g, "").length == 0) {
      return false;
    }

    else {
      return true;
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
        console.error("could not fetch users::" + err.error);
        this.showPathways.emit();
      })
    }
  }

  private getLatestSharedPathway(patientId: number) {
    this.SetLoading(true);
    if (patientId) {
      this.sharedPathwayService.getLatestSharedPathway(patientId).subscribe(response => {
        if (response) {
          this.lastPathwayDetails = response;
        } else {
          this.lastPathwayDetails = null
        }
        this.SetLoading(false);
      }, err => {
        console.error("could not fetch latest record:: " + err.error);
        this.SetLoading(false);
      })
    }
  }

  private getPreviousPathway(sharedPathwayId: number) {
    // this.SetLoading(true);
    if (sharedPathwayId) {
      this.sharedPathwayService.getPreviousPathway(sharedPathwayId).subscribe(response => {
        if (response) {
          this.lastPathwayDetails = response;
        }
        // this.SetLoading(false);
      }, err => {
        console.error("could not fetch latest record:: " + err.error);
        // this.SetLoading(false);
      })
    }
  }

  private getCirculatedTo() {
    return EnumConverter.ConvertEnumToArray(this.circulatedToEnum);
  }

  public isCirculatedChecked(value) {
    if (this.circulateTo.includes(value)) {
      return true;
    } else {
      return false;
    }
  }

  public onSubmit() {
    if (this.mySharedPathway.completedBy == null) {
      alert('Please select Completed By');
    } else if (this.circulateTo.length <= 0 || this.circulateTo.length == null) {
      alert('Please select Circulated To');
    } else if (this.mySharedPathway.signOffBy == null) {
      alert('Please select sign off by');
    } else {
      if (this.isEdit) {
        this.updateSharedPathway();

      } else {
        this.addSharedPathway();
      }
    }
  }

  private addSharedPathway() {

    this.SetLoading(true);

    this.mySharedPathway.patientId = this.userData.id;
    this.sharedPathwayService.addSharedPathway(this.mySharedPathway).subscribe(response => {
      if (response) {
        alert("Pathway added successfully");
        this.showPathways.emit();
      }
      this.SetLoading(false);
    }, (err) => {
      alert(err.error);
      this.SetLoading(false);
    });
  }

  private updateSharedPathway() {

    this.SetLoading(true);

    if (this.currentUserId == this.mySharedPathway.signOffBy) {
      this.mySharedPathway.isSignOff = true;
    }
    this.mySharedPathway.patientId = this.userData.id;
    this.sharedPathwayService.updateSharedPathway(this.mySharedPathway).subscribe(response => {
      if (response) {
        alert("Pathway updated successfully");
        if (this.isReload) {
          // location.reload();
      this.router.navigate([Constants.routes.dashboard()]);

        } else
        this.showPathways.emit();
      }
      this.SetLoading(false);
    }, (err) => {
      alert(err.error);
      this.SetLoading(false);
    });
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

  public skip(index) {
    if (!confirm("If you skip this section, all entries will lost")) {
      return false
    }
    let current_tab = index - 1;
    if (current_tab == 1) {
      this.clearSectionA()
    }
    else if (current_tab == 2) {
      this.clearSectionB()
    }
    else if (current_tab == 3) {
      this.clearSectionC()
    }
    else if (current_tab == 4) {
      this.clearSectionD()
    }
    else if (current_tab == 5) {
      this.clearSectionE()
    }
    else if (current_tab == 6) {
      this.clearSectionF()
    }
    else if (current_tab == 7) {
      this.clearSectionG()
    }
    else {
      this.clearSectionH()
    }

    this.onTabChange(index);

  }

  public addPlanProgress(sectionName: string) {
    this.planAndProgress.sectionName = sectionName;

    this.mySharedPathway.plansAndProgresses.push(this.planAndProgress);
    this.planAndProgress = new PlansAndProgresses();
  }

  public addsummaryOutcomePlans(sectionName: string) {
    this.summaryOutcomePlan.sectionName = sectionName;

    this.mySharedPathway.summaryOutcomePlans.push(this.summaryOutcomePlan);
    this.summaryOutcomePlan = new SummaryOutcomePlans();
  }

  public removePlanProgress(index: number, sectionName: string) {

    this.mySharedPathway.plansAndProgresses.forEach((element, i) => {
      if (element.sectionName == sectionName && i == index) {
        this.mySharedPathway.plansAndProgresses.splice(i, 1);
      }
    });
  }

  public removeSummaryOutcome(index: number) {
    this.mySharedPathway.summaryOutcomePlans.splice(index, 1);
  }

  private clearSectionA() {

    this.mySharedPathway.sectionANote = null
    this.mySharedPathway.sectionADisagreementNote = null

    this.mySharedPathway.positiveStepsTowardsRecoveryScore = 1;
    this.mySharedPathway.positiveStepsTowardsRecoveryTeamScore = 1;
    this.mySharedPathway.independentAndManagingSelfCareScore = 1;
    this.mySharedPathway.independentAndManagingSelfCareTeamScore = 1;
    this.mySharedPathway.wellControlledSymptomsScore = 1;
    this.mySharedPathway.wellControlledSymptomsTeamScore = 1;
    this.mySharedPathway.thinkBeforeActScore = 1;
    this.mySharedPathway.thinkBeforeActTeamScore = 1;
    this.mySharedPathway.takeMedicationResponsiblyScore = 1;
    this.mySharedPathway.takeMedicationResponsiblyTeamScore = 1;
    this.mySharedPathway.copingStrategiesScore = 1;
    this.mySharedPathway.copingStrategiesTeamScore = 1;

    this.mySharedPathway.plansAndProgresses = this.mySharedPathway.plansAndProgresses.filter(s => s.sectionName !== "A");


  }

  private clearSectionB() {

    this.mySharedPathway.sectionBNote = null
    this.mySharedPathway.sectionBDisagreementNote = null

    this.mySharedPathway.goodAttitudeTowardsPeopleScore = 1;
    this.mySharedPathway.goodAttitudeTowardsPeopleTeamScore = 1;
    this.mySharedPathway.canManageMyRiskToOthersScore = 1;
    this.mySharedPathway.canManageMyRiskToOthersTeamScore = 1;
    this.mySharedPathway.canManageMySetbacksScore = 1;
    this.mySharedPathway.canManageMySetbacksTeamScore = 1;
    this.mySharedPathway.unsupervisedSettingsScore = 1;
    this.mySharedPathway.unsupervisedSettingsTeamScore = 1;
    this.mySharedPathway.willingToWorkWithTheTeamScore = 1;
    this.mySharedPathway.willingToWorkWithTheTeamTeamScore = 1;
    this.mySharedPathway.successfullyCompletedTreatmentProgrammeScore = 1;
    this.mySharedPathway.successfullyCompletedTreatmentProgrammeTeamScore = 1;
    this.mySharedPathway.consistentlyCompliedWithCarePlansScore = 1;
    this.mySharedPathway.consistentlyCompliedWithCarePlansTeamScore = 1;
    this.mySharedPathway.plansAndProgresses = this.mySharedPathway.plansAndProgresses.filter(s => s.sectionName !== "B");



  }

  private clearSectionC() {

    this.mySharedPathway.sectionCNote = null
    this.mySharedPathway.sectionCDisagreementNote = null

    this.mySharedPathway.mentalHealthProblemFactorsScore = 1;
    this.mySharedPathway.mentalHealthProblemFactorsTeamScore = 1;
    this.mySharedPathway.mentalHealthProblemAffectLifeSkillsScore = 1;
    this.mySharedPathway.mentalHealthProblemAffectLifeSkillsTeamScore = 1;
    this.mySharedPathway.factorsIncreaseOrDecreaseRiskScore = 1;
    this.mySharedPathway.factorsIncreaseOrDecreaseRiskTeamScore = 1;
    this.mySharedPathway.livingConditionsAffectRiskScore = 1;
    this.mySharedPathway.livingConditionsAffectRiskTeamScore = 1;
    this.mySharedPathway.peopleAffectedByMyBehavioursScore = 1;
    this.mySharedPathway.peopleAffectedByMyBehavioursTeamScore = 1;
    this.mySharedPathway.agreeWithTreatmentPlanOfferedScore = 1;
    this.mySharedPathway.agreeWithTreatmentPlanOfferedTeamScore = 1;
    this.mySharedPathway.benefitedFromTheTreatmentsScore = 1;
    this.mySharedPathway.benefitedFromTheTreatmentsTeamScore = 1;
    this.mySharedPathway.plansAndProgresses = this.mySharedPathway.plansAndProgresses.filter(s => s.sectionName !== "C");


  }

  private clearSectionD() {

    this.mySharedPathway.sectionDNote = null
    this.mySharedPathway.sectionDDisagreementNote = null

    this.mySharedPathway.completedTheTreatmentProgrammeScore = 1;
    this.mySharedPathway.completedTheTreatmentProgrammeTeamScore = 1;
    this.mySharedPathway.managedToStopDrugAlcoholUseScoreScore = 1;
    this.mySharedPathway.managedToStopDrugAlcoholUseScoreTeamScore = 1;
    this.mySharedPathway.relapsePreventionPlanScore = 1;
    this.mySharedPathway.relapsePreventionPlanTeamScore = 1;
    this.mySharedPathway.notUsingDrugsAlcoholWhenLeftUnsupervisedScore = 1;
    this.mySharedPathway.notUsingDrugsAlcoholWhenLeftUnsupervisedTeamScore = 1;
    this.mySharedPathway.cooperateWithDrugAlcoholScreensScore = 1;
    this.mySharedPathway.cooperateWithDrugAlcoholScreensTeamScore = 1;
    this.mySharedPathway.plansAndProgresses = this.mySharedPathway.plansAndProgresses.filter(s => s.sectionName !== "D");


  }

  private clearSectionE() {

    this.mySharedPathway.sectionENote = null
    this.mySharedPathway.sectionEDisagreementNote = null


    this.mySharedPathway.planAboutMyFutureCareScore = 1;
    this.mySharedPathway.planAboutMyFutureCareTeamScore = 1;
    this.mySharedPathway.planAboutMyPlacementScore = 1;
    this.mySharedPathway.planAboutMyPlacementTeamScore = 1;
    this.mySharedPathway.planAboutMySupportNetworksScore = 1;
    this.mySharedPathway.planAboutMySupportNetworksTeamScore = 1;
    this.mySharedPathway.willComplyWithTreatmentPlansScore = 1;
    this.mySharedPathway.willComplyWithTreatmentPlansTeamScore = 1;
    this.mySharedPathway.stressesIWillFaceOutsideHospitalScore = 1;
    this.mySharedPathway.stressesIWillFaceOutsideHospitalTeamScore = 1;
    this.mySharedPathway.plansAndProgresses = this.mySharedPathway.plansAndProgresses.filter(s => s.sectionName !== "E");


  }

  private clearSectionF() {

    this.mySharedPathway.sectionFNote = null
    this.mySharedPathway.sectionFDisagreementNote = null

    this.mySharedPathway.managingMySelfCareScore = 1;
    this.mySharedPathway.managingMySelfCareTeamScore = 1;
    this.mySharedPathway.physicalHealthProblemsAreWellManagedScore = 1;
    this.mySharedPathway.physicalHealthProblemsAreWellManagedTeamScore = 1;
    this.mySharedPathway.notSufferingFromAnySideEffectsScore = 1;
    this.mySharedPathway.notSufferingFromAnySideEffectsTeamScore = 1;
    this.mySharedPathway.physicalHealthWillBeCheckedScore = 1;
    this.mySharedPathway.physicalHealthWillBeCheckedTeamScore = 1;
    this.mySharedPathway.plansAndProgresses = this.mySharedPathway.plansAndProgresses.filter(s => s.sectionName !== "F");

  }

  private clearSectionG() {

    this.mySharedPathway.sectionGNote = null
    this.mySharedPathway.sectionGDisagreementNote = null

    this.mySharedPathway.skillsToGetOnWithPeopleScore = 1;
    this.mySharedPathway.skillsToGetOnWithPeopleTeamScore = 1;
    this.mySharedPathway.wellBalancedWeeklyRoutineScore = 1;
    this.mySharedPathway.wellBalancedWeeklyRoutineTeamScore = 1;
    this.mySharedPathway.consistentlyManageDailyLivingSkillsScore = 1;
    this.mySharedPathway.consistentlyManageDailyLivingSkillsTeamScore = 1;
    this.mySharedPathway.rangeOfInterestsScore = 1;
    this.mySharedPathway.rangeOfInterestsTeamScore = 1;
    this.mySharedPathway.plansAndProgresses = this.mySharedPathway.plansAndProgresses.filter(s => s.sectionName !== "G");


  }

  private clearSectionH() {

    this.mySharedPathway.sectionHNote = null
    this.mySharedPathway.sectionHDisagreementNote = null

    this.mySharedPathway.positiveTherapeuticRelationshipWithClinicalTeamScore = 1;
    this.mySharedPathway.positiveTherapeuticRelationshipWithClinicalTeamTeamScore = 1;
    this.mySharedPathway.beenAbleToGetOnWithOtherServiceUsersScore = 1;
    this.mySharedPathway.beenAbleToGetOnWithOtherServiceUsersTeamScore = 1;
    this.mySharedPathway.familyRelationshipsFreeFromConflictScore = 1;
    this.mySharedPathway.familyRelationshipsFreeFromConflictTeamScore = 1;
    this.mySharedPathway.shownProblemOfSexualNatureScore = 1;
    this.mySharedPathway.shownProblemOfSexualNatureTeamScore = 1;
    this.mySharedPathway.plansAndProgresses = this.mySharedPathway.plansAndProgresses.filter(s => s.sectionName !== "H");


  }

}
