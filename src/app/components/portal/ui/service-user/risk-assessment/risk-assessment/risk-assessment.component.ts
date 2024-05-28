import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RiskAssessmentService } from 'src/app/services/risk-assessment.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
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
import { UserType } from 'src/app/shared/enums/user-type.enum';
import { LocationServices } from 'src/app/services/location.service';

@Component({
  selector: 'app-risk-assessment',
  templateUrl: './risk-assessment.component.html',
  styleUrls: ['./risk-assessment.component.scss']
})
export class RiskAssessmentComponent extends BaseComponent implements OnInit {
  @Input() userData: any;
  @Output() showAllRiskAssessment: EventEmitter<any> = new EventEmitter();

  showLabel = false;
  riskAssessment: RiskAssessment;
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
  public lastRiskAsssessment: RiskAssessment;
  public userTypeEnum = UserType;
  public locationName = '-';

  constructor(private riskAssessmentService: RiskAssessmentService, private locationService: LocationServices, private route: ActivatedRoute, private userService: UserService) { super(); }

  ngOnInit(): void {
    this.onTabChange(1);
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
    this.riskAssessment = new RiskAssessment();
    this.riskAssessment.patientId = this.route.snapshot.params['id'];
    this.riskAssessment.completedBy = Number(JSON.parse(localStorage.getItem('_identity')).id);
    this.riskAssessment.locationId = this.userData.locationId;
    this.riskAssessment.careHomeId = this.userData.careHomeId;
    if (this.currentUserRole == this.userType.Admin || this.currentUserRole == this.userType.SuperUser) {
      this.riskAssessment.signOffBy = Number(JSON.parse(localStorage.getItem('_identity')).id);
      this.riskAssessment.isSignOff = true;
    }

    if (!this.userData && !this.route.snapshot.params['id']) {
      this.showLabel = true;
    }
    this.getLocation(this.userData.locationId);
    this.getUsers();
    this.getLatestAssessment();
  }

  public onTabChange(index) {
    this.tabIndex = index;
    this.active = index;
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
        this.onSubmit(this.riskAssessment, formRef);
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

  public onSubmit(form: RiskAssessment, formRef?) {
    this.SetLoading(true);
    this.riskAssessment.patientId = this.userData.id;
    this.riskAssessmentService.addRiskAssessment(form).subscribe(response => {
      if (response) {
        alert("Assessment added successfully");
        formRef.reset();
        // this.onTabChange(1);
        this.getRiskAssessments();
      }
      this.SetLoading(false);
    }, error => {
      alert(error.error);
      this.SetLoading(false);
    })
  }

  public getRiskAssessments() {
    this.showAllRiskAssessment.emit();
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

  private getLatestAssessment() {
    this.riskAssessmentService.getLatestRiskAssessment(this.userData.id).subscribe(response => {
      if (response) {
        this.lastRiskAsssessment = response;
      }
    }, error => {
      console.error("could not fetch latest record:: " + error.error);
    })
  }

  private getUsers() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe(response => {
      if (response) {
        this.usersList = response;
      }
    }, err => {
      console.error("could not fetch users::" + err.error);
    })
    // this.isBusy = false;
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
