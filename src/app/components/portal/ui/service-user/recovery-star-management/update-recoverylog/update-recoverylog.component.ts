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
  selector: 'app-update-recoverylog',
  templateUrl: './update-recoverylog.component.html',
  styleUrls: ['./update-recoverylog.component.scss']
})
export class UpdateRecoverylogComponent extends BaseComponent implements OnInit {
  @Input() previousValues: any

  @Output() showAllLogs: EventEmitter<any> = new EventEmitter<any>();

  public recoveryStar: any;
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

  constructor(private userService: UserService, private recoveryStarService: RecoveryStarService) { super(); }

  ngOnInit(): void {
    this.SetLoading(true);
    if (this.previousValues) {
      this.setValues();
      // this.createScoresArray();
    }
    this.getUsers();
    this.circulatedToArray = this.getCirculatedTo();
    this.summaryOtherAgencies = this.getSummaryOtherAgencies();
    this.onClickNext(1);

  }

  public createScoresArray() {
    this.patientScores.push(this.recoveryStar.ManagingMentalHealthScorePatient);
    this.patientScores.push(this.recoveryStar.SelfCareScorePatient);
    this.patientScores.push(this.recoveryStar.LivingSkillsScorePatient);
    this.patientScores.push(this.recoveryStar.SocialNetworksScorePatient);
    this.patientScores.push(this.recoveryStar.WorkScorePatient);
    this.patientScores.push(this.recoveryStar.RelationshipsScorePatient);
    this.patientScores.push(this.recoveryStar.AddictiveBehaviourScorePatient);
    this.patientScores.push(this.recoveryStar.ResponsibilitiesScorePatient);
    this.patientScores.push(this.recoveryStar.IdentityAndSelfEsteemScorePatient);
    this.patientScores.push(this.recoveryStar.TrustAndHopeScorePatient);


    this.userScores.push(this.recoveryStar.ManagingMentalHealthScoreStaff);
    this.userScores.push(this.recoveryStar.SelfCareScoreStaff);
    this.userScores.push(this.recoveryStar.LivingSkillsScoreStaff);
    this.userScores.push(this.recoveryStar.SocialNetworksScoreStaff);
    this.userScores.push(this.recoveryStar.WorkScoreStaff);
    this.userScores.push(this.recoveryStar.RelationshipsScoreStaff);
    this.userScores.push(this.recoveryStar.AddictiveBehaviourScoreStaff);
    this.userScores.push(this.recoveryStar.ResponsibilitiesScoreStaff);
    this.userScores.push(this.recoveryStar.IdentityAndSelfEsteemScoreStaff);
    this.userScores.push(this.recoveryStar.TrustAndHopeScoreStaff);

  }

  private getCirculatedTo() {
    return EnumConverter.ConvertEnumToArray(this.circulatedToEnum);
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
    if(OtherAgency){
    OtherAgency.split('|').forEach(element => {
      this.summaryOtherAgencies.forEach((el) => {
        if (el.value == element) {
          newString.push(el.key);
        }
      });
    });
    return newString.join();
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
    this.recoveryStar.CirculatedTo = this.circulateTo.join("|");
  }

  public isCirculatedChecked(value) {
    if (this.circulateTo.includes(value)) {
      return true;
    } else {
      return false;
    }
  }

  public goBack()
  {
    this.showAllLogs.emit();
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
    this.recoveryStar.AreasToWorkOn = this.summaryOtherAgencyIds.join("|");
  }

  public isOtherAgencyChecked(value) {
    if (this.summaryOtherAgencyIds.includes(value)) {
      return true;
    } else {
      return false;
    }
  }

  public getPatientTotal() {
    return this.recoveryStar.TotalScrorePatient = this.recoveryStar.ManagingMentalHealthScorePatient +
      this.recoveryStar.SelfCareScorePatient +
      this.recoveryStar.LivingSkillsScorePatient +
      this.recoveryStar.SocialNetworksScorePatient +
      this.recoveryStar.WorkScorePatient +
      this.recoveryStar.RelationshipsScorePatient +
      this.recoveryStar.AddictiveBehaviourScorePatient +
      this.recoveryStar.ResponsibilitiesScorePatient +
      this.recoveryStar.IdentityAndSelfEsteemScorePatient +
      this.recoveryStar.TrustAndHopeScorePatient;
  }

  public getUserTotal() {
    return this.recoveryStar.TotalScroreStaff = this.recoveryStar.ManagingMentalHealthScoreStaff +
      this.recoveryStar.SelfCareScoreStaff +
      this.recoveryStar.LivingSkillsScoreStaff +
      this.recoveryStar.SocialNetworksScoreStaff +
      this.recoveryStar.WorkScoreStaff +
      this.recoveryStar.RelationshipsScoreStaff +
      this.recoveryStar.AddictiveBehaviourScoreStaff +
      this.recoveryStar.ResponsibilitiesScoreStaff +
      this.recoveryStar.IdentityAndSelfEsteemScoreStaff +
      this.recoveryStar.TrustAndHopeScoreStaff;
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

    this.recoveryStar = this.previousValues;

    this.recoveryStar.CirculatedTo.split('|').forEach(element => {
      this.circulateTo.push(Number(element));
    });
    this.recoveryStar.AreasToWorkOn.split('|').forEach(element => {
      this.summaryOtherAgencyIds.push(Number(element));
    })
    this.createScoresArray();

    this.SetLoading(false);
  }
}
