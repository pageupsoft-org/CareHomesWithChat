import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RecoveryStarService } from 'src/app/services/recovery-star.service';
import { UpdateLogService } from 'src/app/services/update-log.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { CirculatedTo } from 'src/app/shared/enums/circulated-to.enum';
import { SummaryOtherAgencies } from 'src/app/shared/enums/summary-other-agencies.enum';
import { RecoveryStar } from 'src/app/shared/models/recovery-star';
import { UpdateLog } from 'src/app/shared/models/update-log';
import { User } from 'src/app/shared/models/user';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-show-recovery-star',
  templateUrl: './show-recovery-star.component.html',
  styleUrls: ['./show-recovery-star.component.scss']
})
export class ShowRecoveryStarComponent extends BaseComponent implements OnInit {
  @Input() userData: any;
  @Input() recoveryStarId: any
  @Output() showAllRecoveryStar: EventEmitter<any> = new EventEmitter<any>();


  public recoveryStar: RecoveryStar;
  public usersList: User[] = [];
  public circulatedToEnum = CirculatedTo;
  public circulatedToArray: Array<any> = [];
  public circulateTo: Array<number> = [];
  public tabIndex: number;
  public active: number;

  public summaryOtherAgency = SummaryOtherAgencies;
  public summaryOtherAgencies: Array<any> = [];
  public summaryOtherAgencyIds: Array<number> = [];

  public patientScores: Array<number> = [];
  public userScores: Array<number> = [];
  public logList: Array<UpdateLog> = [];
  public previousValues;
  public showLogDetail: boolean = false;


  constructor(private userService: UserService, private recoveryStarService: RecoveryStarService, private updateLogServices: UpdateLogService) { super(); }

  ngOnInit(): void {
    this.SetLoading(true);
    if (this.recoveryStarId) {
      this.setValues();
      this.getLog();
      // this.createScoresArray();
    }
    this.getUsers();
    this.circulatedToArray = this.getCirculatedTo();
    this.summaryOtherAgencies = this.getSummaryOtherAgencies();
    this.onClickNext(1);


  }

  public createScoresArray() {
    this.patientScores.push(this.recoveryStar.managingMentalHealthScorePatient);
    this.patientScores.push(this.recoveryStar.selfCareScorePatient);
    this.patientScores.push(this.recoveryStar.livingSkillsScorePatient);
    this.patientScores.push(this.recoveryStar.socialNetworksScorePatient);
    this.patientScores.push(this.recoveryStar.workScorePatient);
    this.patientScores.push(this.recoveryStar.relationshipsScorePatient);
    this.patientScores.push(this.recoveryStar.addictiveBehaviourScorePatient);
    this.patientScores.push(this.recoveryStar.responsibilitiesScorePatient);
    this.patientScores.push(this.recoveryStar.identityAndSelfEsteemScorePatient);
    this.patientScores.push(this.recoveryStar.trustAndHopeScorePatient);


    this.userScores.push(this.recoveryStar.managingMentalHealthScoreStaff);
    this.userScores.push(this.recoveryStar.selfCareScoreStaff);
    this.userScores.push(this.recoveryStar.livingSkillsScoreStaff);
    this.userScores.push(this.recoveryStar.socialNetworksScoreStaff);
    this.userScores.push(this.recoveryStar.workScoreStaff);
    this.userScores.push(this.recoveryStar.relationshipsScoreStaff);
    this.userScores.push(this.recoveryStar.addictiveBehaviourScoreStaff);
    this.userScores.push(this.recoveryStar.responsibilitiesScoreStaff);
    this.userScores.push(this.recoveryStar.identityAndSelfEsteemScoreStaff);
    this.userScores.push(this.recoveryStar.trustAndHopeScoreStaff);

  }

  private getCirculatedTo() {
    return EnumConverter.ConvertEnumToArray(this.circulatedToEnum);
  }

  public getRecoverystars() {
    this.showAllRecoveryStar.emit();
  }

  public onClickNext(index) {
    this.tabIndex = index;
    this.active = index;

  }

  private getSummaryOtherAgencies() {
    return EnumConverter.ConvertEnumToArray(this.summaryOtherAgency);
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

  public getOtherAgencyString(OtherAgency: string) {
    let newString = [];
    OtherAgency.split('|').forEach(element => {
      this.summaryOtherAgencies.forEach((el) => {
        if (el.value == element) {
          newString.push(el.key);
        }
      });
    });
    return newString.join();

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
    this.recoveryStar.circulatedTo = this.circulateTo.join("|");
  }

  public isCirculatedChecked(value) {
    if (this.circulateTo.includes(value)) {
      return true;
    } else {
      return false;
    }
  }

  public changeOtherAgency(option, event) {
    if (event.target.checked) {
      this.summaryOtherAgencyIds.push(option.value);
    } else {
      for (var i = 0; i < this.summaryOtherAgencies.length; i++) {
        if (this.summaryOtherAgencyIds[i] == option.value) {
          this.summaryOtherAgencyIds.splice(i, 1);
        }
      }
    }
    this.recoveryStar.areasToWorkOn = this.summaryOtherAgencyIds.join("|");
  }

  public isOtherAgencyChecked(value) {
    if (this.summaryOtherAgencyIds.includes(value)) {
      return true;
    } else {
      return false;
    }
  }

  public getPatientTotal() {
    return this.recoveryStar.totalScrorePatient = this.recoveryStar.managingMentalHealthScorePatient +
      this.recoveryStar.selfCareScorePatient +
      this.recoveryStar.livingSkillsScorePatient +
      this.recoveryStar.socialNetworksScorePatient +
      this.recoveryStar.workScorePatient +
      this.recoveryStar.relationshipsScorePatient +
      this.recoveryStar.addictiveBehaviourScorePatient +
      this.recoveryStar.responsibilitiesScorePatient +
      this.recoveryStar.identityAndSelfEsteemScorePatient +
      this.recoveryStar.trustAndHopeScorePatient;
  }

  public getUserTotal() {
    return this.recoveryStar.totalScroreStaff = this.recoveryStar.managingMentalHealthScoreStaff +
      this.recoveryStar.selfCareScoreStaff +
      this.recoveryStar.livingSkillsScoreStaff +
      this.recoveryStar.socialNetworksScoreStaff +
      this.recoveryStar.workScoreStaff +
      this.recoveryStar.relationshipsScoreStaff +
      this.recoveryStar.addictiveBehaviourScoreStaff +
      this.recoveryStar.responsibilitiesScoreStaff +
      this.recoveryStar.identityAndSelfEsteemScoreStaff +
      this.recoveryStar.trustAndHopeScoreStaff;
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
    this.onClickNext(13);
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

  private setValues() {

    this.recoveryStarService.getRecoveryStar(this.recoveryStarId).subscribe(response => {
      if (response) {
        this.recoveryStar = response;
        this.recoveryStar.circulatedTo.split('|').forEach(element => {
          this.circulateTo.push(Number(element));
        });
        this.recoveryStar.areasToWorkOn.split('|').forEach(element => {
          this.summaryOtherAgencyIds.push(Number(element));
        })
        this.createScoresArray();
      }
    }, err => {
      alert(err.error);
    });
    this.SetLoading(false);
  }

  private getLog() {
    this.updateLogServices.getLogs('RecoveryStar', this.recoveryStarId).subscribe(response => {
      if (response.length > 0) {
        this.logList = response;
      }
    }, err => {
      alert(err.error);
    })
  }

}
