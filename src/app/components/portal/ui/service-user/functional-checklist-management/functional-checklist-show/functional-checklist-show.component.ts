import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FunctionalChecklistService } from 'src/app/services/functional-checklist.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { CirculatedTo } from 'src/app/shared/enums/circulated-to.enum';
import { FunctionalChecklist } from 'src/app/shared/models/functional-checklist';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { User } from 'src/app/shared/models/user';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-functional-checklist-show',
  templateUrl: './functional-checklist-show.component.html',
  styleUrls: ['./functional-checklist-show.component.scss']
})
export class FunctionalChecklistShowComponent extends BaseComponent implements OnInit {
  @Input() userData: PatientAdmission;
  @Input() functionalityData: FunctionalChecklist;
  @Output() getFunctionalities: EventEmitter<any> = new EventEmitter<any>();


  public functionalChecklist: FunctionalChecklist;
  public usersList: User[] = [];
  public circulatedToEnum = CirculatedTo;
  public circulatedToArray: Array<any> = [];
  public circulateTo: Array<number> = [];

  public totalScore: number = 0;
  public zeroCount: number = 0;
  public maxScore: number = 0;
  public locationName: string = "-";
  private scores: Array<any> = [];
  public positon: string = '';
  private isEdit: boolean = false;

  constructor(private locationService: LocationServices, private userService: UserService, private functionalityService: FunctionalChecklistService) { super(); }

  ngOnInit(): void {
    if (this.functionalityData) {
      this.isEdit = true;
      this.setValues();
      this.getLocation();
    } else {
      this.functionalChecklist = new FunctionalChecklist();
    }
    this.getUsers();
    this.circulatedToArray = this.getCirculatedTo();
  }

  public getFunctionalityList() {
    this.getFunctionalities.emit();
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
    this.functionalChecklist.circulatedTo = this.circulateTo.join("|");
  }

  public isCirculatedChecked(value) {
    if (this.circulateTo.includes(value)) {
      return true;
    } else {
      return false;
    }
  }

  public changeScore(index: string, value: number) {

    let total = 0;
    if (this.scoreExists(index, value)) {
      // return;
    } else {
      this.scores.push({ "index": index, "value": value });
    }
    total = this.scores.reduce((n, { value }) => n + value, 0)
    this.zeroCount = this.scores.filter(n => n.value == 0).length;
    this.totalScore = total - this.zeroCount;
  }

  private scoreExists(index, value) {
    return this.scores.some(function (el) {
      if (el.index === index) {
        el.value = value;
        return true;
      }
    });
  }

  public getTotalScore() {
    // return Number(this.functionalChecklist.bathingShowering + this.functionalChecklist.bowelBladderManagement + this.functionalChecklist.dressing + this.functionalChecklist.eating + this.functionalChecklist.feeding + this.functionalChecklist.functionalMobility + this.functionalChecklist.personalDeviceCare + this.functionalChecklist.personalHygieneGrooming + this.functionalChecklist.sleepRest + this.functionalChecklist.sexualActivity + this.functionalChecklist.toiletHygiene + this.functionalChecklist.careOfOthers + this.functionalChecklist.careOfPets + this.functionalChecklist.parenting + this.functionalChecklist.communication + this.functionalChecklist.publicTransportUse + this.functionalChecklist.financialManagement + this.functionalChecklist.healthManagement + this.functionalChecklist.homeManagement + this.functionalChecklist.mealPreparationCleanup + this.functionalChecklist.medicationManagement + this.functionalChecklist.safetyProcedures + this.functionalChecklist.shopping + this.functionalChecklist.educationalExploration + this.functionalChecklist.formalEducationalParticipation + this.functionalChecklist.informalEducationalParticipation + this.functionalChecklist.employmentInterestsPursuits + this.functionalChecklist.seekingEmployment + this.functionalChecklist.jobPerformance + this.functionalChecklist.capacity + this.functionalChecklist.retirementAdjustment + this.functionalChecklist.seekingVolunteerEmployment + this.functionalChecklist.volunteer + this.functionalChecklist.participation + this.functionalChecklist.leisureExploration + this.functionalChecklist.leisureParticipation + this.functionalChecklist.family + this.functionalChecklist.peerFriend + this.functionalChecklist.community + this.functionalChecklist.religion + this.functionalChecklist.violenceAggression + this.functionalChecklist.suicide + this.functionalChecklist.selfNeglect + this.functionalChecklist.wandering + this.functionalChecklist.sexualOffences + this.functionalChecklist.inappropriateSexualBehaviour + this.functionalChecklist.deliberateFireSetting + this.functionalChecklist.deliberateSelfHarm + this.functionalChecklist.otherSelfHarm + this.functionalChecklist.abuseExploitationFromOthers + this.functionalChecklist.accidentalInjury + this.functionalChecklist.substanceMisuse + this.functionalChecklist.other + this.functionalChecklist.nonContactWithServices + this.functionalChecklist.nonEngagementWithCarePlan + this.functionalChecklist.nonComplianceWithMedication);
    return this.totalScore;
  }

  public getMaxScore() {
    return this.maxScore = 280 - this.zeroCount;
  }

  public getCalculation(value: number) {
    return Math.round((this.maxScore / 5) * value);
  }

  private getUsers() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe(response => {
      if (response) {
        this.usersList = response;
        if (this.functionalityData) {
          this.setPosition(this.functionalChecklist.completedBy);
        }
      }
    }, err => {
      console.error("could not fetch users :: " + err.error);
    })
  }

  private getCirculatedTo() {
    return EnumConverter.ConvertEnumToArray(this.circulatedToEnum);
  }


  private setValues() {
    this.functionalChecklist = this.functionalityData;

    this.scores = Object.keys(this.functionalChecklist).map(key => ({ index: key, value: this.functionalChecklist[key] }));

    this.scores = this.scores.filter(x => x.index != "id" && x.index != "patientId" && x.index != "additionalNotes" && x.index != "calculatedScore" && x.index != "totalScore" && x.index != "completedBy" && x.index != "completedDate" && x.index != "nextReviewDate" && x.index != "circulatedTo" && x.index != "signOffBy" && x.index != "isSignOff")

    let total = this.scores.reduce((n, { value }) => n + value, 0)
    this.zeroCount = this.scores.filter(n => n.value == 0).length;
    this.totalScore = total - this.zeroCount;
    this.totalScore = this.functionalChecklist.totalScore;
    this.maxScore = this.functionalChecklist.calculatedScore;

    this.functionalityData.circulatedTo.split('|').forEach(element => {
      this.circulateTo.push(Number(element));
    });
  }


  public getCirculateToString(circulatedToString: string) {
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

  public setPosition(event: any) {
    this.positon = this.usersList.find(x => x.id == event).position
  }

  private getLocation() {
    if (this.userData.locationId) {
      this.locationService.getLocation(this.userData.locationId).subscribe(response => {
        if (response) {
          return this.locationName = response.name;
        }
        else {
          return "-";
        }
      }, err => {
        console.error('could not fetch location::' + err.error);
      });
    }
  }

}
