import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { RiskAssessmentService } from 'src/app/services/risk-assessment.service';
import { UserService } from 'src/app/services/user.service';
import { ActionsToBeTaken } from 'src/app/shared/enums/actions-to-taken.enum';
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

@Component({
  selector: 'app-update-assessmentlog',
  templateUrl: './update-assessmentlog.component.html',
  styleUrls: ['./update-assessmentlog.component.scss']
})
export class UpdateAssessmentlogComponent implements OnInit {
  @Input() previourValues: any;
  @Output() showAllLogs: EventEmitter<any> = new EventEmitter();

  tabIndex: number = 1;
  active: number = 1;

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
  actionToBeTakenEnum = ActionsToBeTaken;
  circulatedToArray: Array<any> = [];
  agencyArr: Array<any> = [];
  sourceArr: Array<any> = [];
  usersList: User[] = [];
  public lastRiskAsssessment: RiskAssessment;

  constructor(private userService: UserService, private riskAssessmentService: RiskAssessmentService) { }
  public showLabel: boolean = false;
  public showLogDetail: boolean = false;

  ngOnInit(): void {
    if (!this.previourValues ) {
      this.showLabel = true;
    }
    this.onTabChange(1);
    this.circulatedToArray = this.getCirculatedTo();
    this.agencyArr = this.getAgency();
    this.sourceArr = this.getInformationSource();
    this.getUsers();
  }

  onTabChange(index) {
    this.tabIndex = index;
    this.active = index;
  }

  getOtherAgency(agency) {

    let newString = [];
    agency.split('|').forEach(element => {
      this.agencyArr.forEach((el) => {
        if (el.value == element) {
          newString.push(el.key);
        }
      });
    });
    return newString.join();
  }

  getInformationSources(source) {
    let newString = [];
    source.split('|').forEach(element => {
      this.sourceArr.forEach((el) => {
        if (el.value == element) {
          newString.push(el.key);
        }
      });
    });
    return newString.join();
  }

  getAgency() {
    var agency = EnumConverter.ConvertEnumToArray(this.otherAgency);
    return agency;
  }

  getInformationSource() {
    var source = EnumConverter.ConvertEnumToArray(this.informationSourceEnum);
    return source;
  }

  getCirculatedTo() {
    var circulatedTo = EnumConverter.ConvertEnumToArray(CirculatedTo);
    return circulatedTo;
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


  private getUsers() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe(response => {
      if (response) {
        this.usersList = response;
      }
    }, err => {
      console.error("could not fetch users::" + err.error);
    })

  }

  public getSignOffName(signOffId: number) {
    let userName = '';
    this.usersList.forEach((el) => {
      if (el.id == signOffId) {
        userName = el.firstName;

      }
    });
    return userName;
  }

  private getPreviousAssessment() {
    this.riskAssessmentService.getPreviousAssessment(this.previourValues.Id).subscribe(response => {
      if (response) {
        this.lastRiskAsssessment = response;
      }
    }, error => {
      alert(error.error);
    })
  }

  public getRiskAssessments() {
    this.showAllLogs.emit();
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

}
