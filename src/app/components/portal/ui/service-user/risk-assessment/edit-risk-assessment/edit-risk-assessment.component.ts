import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RiskAssessmentService } from 'src/app/services/risk-assessment.service';
import { UserService } from 'src/app/services/user.service';
import { CirculatedTo } from 'src/app/shared/enums/circulated-to.enum';
import { CPAStatus } from 'src/app/shared/enums/cpa-status.enum';
import { FurtherActions } from 'src/app/shared/enums/further-actions.enum';
import { InformationSource } from 'src/app/shared/enums/information-source.enum';
import { LegalStatusRisk } from 'src/app/shared/enums/legal-status-risk.enum';
import { OtherAgencies } from 'src/app/shared/enums/other-agencies.enum';
import { PersonsAtRisk } from 'src/app/shared/enums/persons-risk.enum';
import { SeriousIncident } from 'src/app/shared/enums/serious-incident.enum';
import { RiskAction } from 'src/app/shared/models/risk-action.enum';
import { RiskAssessment } from 'src/app/shared/models/risk-assessment';
import { RiskEntry } from 'src/app/shared/enums/risk-entry.enum';
import { User } from 'src/app/shared/models/user';
import { EnumConverter } from 'src/app/util/EnumConverter';
import { UpdateLogService } from 'src/app/services/update-log.service';
import { UpdateLog } from 'src/app/shared/models/update-log';
import { UserType } from 'src/app/shared/enums/user-type.enum';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { LocationServices } from 'src/app/services/location.service';
import { Constants } from 'src/app/util/Constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-risk-assessment',
  templateUrl: './edit-risk-assessment.component.html',
  styleUrls: ['./edit-risk-assessment.component.scss']
})
export class EditRiskAssessmentComponent extends BaseComponent implements OnInit {
  @Input() riskAssessmentData: RiskAssessment;
  @Input() userData: any;
  @Input() isReload: boolean;
  @Output() showAllRiskAssessment: EventEmitter<any> = new EventEmitter();

  showLabel = false;

  tabIndex: number;
  active: number;
  otherAgency = OtherAgencies;
  cpaStatusEnum = CPAStatus;
  legalStatusRiskEnum = LegalStatusRisk;
  seriousIncidentEnum = SeriousIncident;
  personsAtRiskEnum = PersonsAtRisk;
  furtherActionsEnum = FurtherActions;
  riskEntryEnum = RiskEntry;
  riskActionEnum = RiskAction;
  informationSourceEnum = InformationSource;
  circulatedToEnum = CirculatedTo;

  // enums Array
  OtherAgenciesArray;
  cpaStatusArray;
  legalStatusArray;
  seriousIncidentArray;
  personsAtRiskArray;
  furtherActionsArray;
  riskEntryArray;
  riskActionArray;
  informationSourceArray;
  circulatedToArray;

  circulateTo: Array<number> = [];
  agencies: Array<number> = [];
  informationSource: Array<number> = [];
  id: number;
  isOtherAgencies: boolean;
  isInformationOtherSource: boolean;
  isCirculated: boolean;
  usersList: User[] = [];
  riskAssessment: RiskAssessment;
  public lastRiskAsssessment: RiskAssessment;
  public logList: Array<UpdateLog> = [];
  public userTypeEnum = UserType;
  public currentUserId: number = 0;
  public locationName = '-';

  constructor(private locationService: LocationServices, private riskAssessmentService: RiskAssessmentService, private userService: UserService, private updateLogServices: UpdateLogService, private router: Router) { super(); }

  ngOnInit(): void {
    if (!this.riskAssessmentData || !this.userData) {
      this.showLabel = true;
    }
    this.setValues();
    this.OtherAgenciesArray = this.getOtherAgencies();
    this.cpaStatusArray = this.cpaStatus();
    this.legalStatusArray = this.getlegalStatus();
    this.seriousIncidentArray = this.getseriousIncident();
    this.personsAtRiskArray = this.getpersonsAtRisk();
    this.furtherActionsArray = this.getfurtherActions();
    this.riskEntryArray = this.getRiskEntry();
    this.riskActionArray = this.getRiskAction();
    this.circulatedToArray = this.getCirculatedTo();
    this.informationSourceArray = this.getInformationSource();
    this.onTabChange(1);
    this.getLocation(this.userData.locationId);
    this.getUsers();
    // this.getLog();
  }

  public onTabChange(index) {
    this.tabIndex = index;
    this.active = index;
  }

  public getRiskAssessments() {
    if (this.isReload) {
      // location.reload();
      this.router.navigate([Constants.routes.dashboard()]);

    } else
      this.showAllRiskAssessment.emit();
  }

  public validate(index, formRef?) {
    let current_tab = index - 1;
    if (current_tab == 1) {
      if (this.riskAssessment.assessmentType == null || this.riskAssessment.assessmentType.replace(/\s/g, "").length == 0) {
        alert("Please fill assessment type");
        return false;
      }
      else if (this.riskAssessment.otherAgenciesInvolved == null || this.riskAssessment.otherAgenciesInvolved.replace(/\s/g, "").length == 0) {
        alert("Please select other agencies");
        return false;
      }

      else {
        this.onTabChange(index);
      }
    } else if (current_tab == 3) {
      if (this.riskAssessment.summaryOfMainRisks == null || this.riskAssessment.summaryOfMainRisks.replace(/\s/g, "").length == 0) {
        alert("Please fill Descriptive Summary of Main Risks Identified");
        return false
      }
      else if (this.riskAssessment.protectiveFactor == null || this.riskAssessment.protectiveFactor.replace(/\s/g, "").length == 0) {
        alert("Please fill Protective factors");
        return false;
      }
      else {
        this.onTabChange(index);
      }
    }
    else if (current_tab == 4) {
      if (this.riskAssessment.areasOfConcern == null) {
        alert("Please enter area of concern");
        return false;
      } else if (this.riskAssessment.informationSource == null) {
        alert("Please select information source");
        return false;
      }
      else if (this.riskAssessment.completedDate == null) {
        alert("Please select completed date");
        return false;
      }

      else if (this.riskAssessment.nextReviewDate == null) {
        alert("Please select next review date");
        return false;
      }
      else if (this.riskAssessment.circulatedTo == null) {
        alert("Please select circulated to");
        return false;
      }
      else {
        this.onSubmit(this.riskAssessment);
        return true;
      }
    }
    else {
      this.onTabChange(index);
    }
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

    if (this.circulateTo.includes(this.circulatedToEnum.Other)) {
      this.isCirculated = true;
    } else {
      this.isCirculated = false;
    }

    this.riskAssessment.circulatedTo = this.circulateTo.join("|");
  }

  public changeOtherAgencies(option, event) {

    if (event.target.checked) {
      this.agencies.push(option.value);

    } else {
      for (var i = 0; i < this.circulatedToArray.length; i++) {
        if (this.agencies[i] == option.value) {
          this.agencies.splice(i, 1);
        }
      }
    }

    if (this.agencies.includes(this.otherAgency.Other)) {
      this.isOtherAgencies = true;
    } else {
      this.isOtherAgencies = false;
    }
    this.riskAssessment.otherAgenciesInvolved = this.agencies.join("|");
  }

  public isAgency(value) {
    if (this.agencies.includes(value)) {
      return true;
    } else {
      return false;
    }
  }

  public isCirculatedChecked(value) {
    if (this.circulateTo.includes(value)) {
      return true;
    } else {
      return false;
    }
  }

  public isInformationChecked(value) {
    if (this.informationSource.includes(value)) {
      return true;
    } else {
      return false;
    }
  }

  public changeInformationSource(option, event) {
    if (event.target.checked) {
      this.informationSource.push(option.value);
    } else {
      for (var i = 0; i < this.circulatedToArray.length; i++) {
        if (this.informationSource[i] == option.value) {
          this.informationSource.splice(i, 1);
        }
      }
    }
    if (this.informationSource.includes(this.informationSourceEnum.Other)) {
      this.isInformationOtherSource = true;
    } else {
      this.isInformationOtherSource = false;
    }
    this.riskAssessment.informationSource = this.informationSource.join("|");
  }

  public onSubmit(form: RiskAssessment) {
    this.SetLoading(true);
    if (this.currentUserId == this.riskAssessment.signOffBy) {
      this.riskAssessment.isSignOff = true;
    }
    this.riskAssessmentService.updateRiskAssessment(form).subscribe(response => {
      if (response) {
        alert("Assessment updated successfully");
        this.getRiskAssessments();
      }
    }, error => {
      alert(error.error);
    })
    this.SetLoading(false);
  }

  public checkNextReviewDate() {
    if (this.riskAssessment.nextReviewDate) {
      let nextDate = new Date(this.riskAssessment.nextReviewDate);
      let completedDate = new Date(this.riskAssessment.completedDate);
      if (nextDate < completedDate) {
        this.riskAssessment.nextReviewDate = null;
      }
    }
  }

  private setValues() {
    this.currentUserId = Number((localStorage.getItem('_identity')) ? JSON.parse(localStorage.getItem('_identity')).id : '');
    this.riskAssessment = new RiskAssessment();
    this.riskAssessment = this.riskAssessmentData;
    this.getPreviousAssessment();

    this.riskAssessment.otherAgenciesInvolved.split('|').forEach(element => {
      this.agencies.push(Number(element));
    });
    this.riskAssessment.circulatedTo.split('|').forEach(element => {
      this.circulateTo.push(Number(element));
    });
    this.riskAssessment.informationSource.split('|').forEach(element => {
      this.informationSource.push(Number(element));
    });
  }

  private getUsers() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe(response => {
      if (response.length > 0) {
        this.usersList = response;
      }
    }, err => {
      console.error('could not fetch user::' + err.error);
    })
  }

  private getOtherAgencies() {
    return EnumConverter.ConvertEnumToArray(OtherAgencies);
  }

  private cpaStatus() {
    return EnumConverter.ConvertEnumToArray(CPAStatus);
  }

  private getlegalStatus() {
    return EnumConverter.ConvertEnumToArray(this.legalStatusRiskEnum);
  }

  private getseriousIncident() {
    return EnumConverter.ConvertEnumToArray(this.seriousIncidentEnum);
  }

  private getpersonsAtRisk() {
    return EnumConverter.ConvertEnumToArray(this.personsAtRiskEnum);

  }

  private getfurtherActions() {
    return EnumConverter.ConvertEnumToArray(this.furtherActionsEnum);
  }

  private getRiskEntry() {
    return EnumConverter.ConvertEnumToArray(this.riskEntryEnum);
  }

  private getRiskAction() {
    return EnumConverter.ConvertEnumToArray(this.riskActionEnum);
  }

  private getCirculatedTo() {
    return EnumConverter.ConvertEnumToArray(this.circulatedToEnum);
  }

  private getInformationSource() {
    return EnumConverter.ConvertEnumToArray(this.informationSourceEnum);
  }

  private getPreviousAssessment() {
    this.riskAssessmentService.getPreviousAssessment(this.riskAssessment.id).subscribe(response => {
      if (response) {
        this.lastRiskAsssessment = response;
      }
    }, error => {
      alert(error.error);
    })
  }

  private getLocation(locationId: number) {

    this.locationService.getLocation(locationId).subscribe((response) => {
      if (response) {
        this.locationName = response.name;
      }
    },
      (error) => {
        console.error('could not fetch::' + error.error);
      });
  }

}
