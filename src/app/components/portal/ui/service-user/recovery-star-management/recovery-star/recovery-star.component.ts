import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RecoveryStarService } from 'src/app/services/recovery-star.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { CirculatedTo } from 'src/app/shared/enums/circulated-to.enum';
import { SummaryOtherAgencies } from 'src/app/shared/enums/summary-other-agencies.enum';
import { RecoveryStar } from 'src/app/shared/models/recovery-star';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/util/Constants';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-recovery-star',
  templateUrl: './recovery-star.component.html',
  styleUrls: ['./recovery-star.component.scss']
})
export class RecoveryStarComponent extends BaseComponent implements OnInit {
  @Input() userData: any;
  @Input() recoveryStarId: any;
  @Input() isReload: boolean;
  @Output() showAllRecoveryStar: EventEmitter<any> = new EventEmitter<any>();

  public recoveryStar: RecoveryStar;
  public usersList: User[] = [];
  public circulatedToEnum = CirculatedTo;
  public circulatedToArray: Array<any> = [];
  public circulateTo: Array<number> = [];
  public tabIndex: number;
  public active: number;
  public currentUserId: number = 0;

  public summaryOtherAgency = SummaryOtherAgencies;
  public summaryOtherAgencies: Array<any> = [];
  public summaryOtherAgencyIds: Array<number> = [];

  public isEdit = false;

  constructor(private userService: UserService, private recoveryStarService: RecoveryStarService, private router: Router) { super(); }

  ngOnInit(): void {
    this.SetLoading(true);
    if (this.recoveryStarId) {
      this.isEdit = true;
      this.setValues();
    } else {
      this.recoveryStar = new RecoveryStar();
      this.SetLoading(false);
      
      this.recoveryStar.locationId =this.userData.locationId;
      this.recoveryStar.careHomeId =this.userData.careHomeId;

      this.recoveryStar.completedBy = Number(JSON.parse(localStorage.getItem('_identity')).id);
      if (this.currentUserRole == this.userType.Admin || this.currentUserRole == this.userType.SuperUser) {
        this.recoveryStar.signOffBy = Number(JSON.parse(localStorage.getItem('_identity')).id);
        this.recoveryStar.isSignOff = true;
      }
    }
    this.getUsers();
    this.circulatedToArray = this.getCirculatedTo();
    this.summaryOtherAgencies = this.getSummaryOtherAgencies();
    this.onClickNext(1);
  }

  public onClickNext(index) {
    this.tabIndex = index;
    this.active = index;
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
      for (var i = 0; i < this.summaryOtherAgencyIds.length; i++) {
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

  public onSubmit(formData: RecoveryStar) {
    this.SetLoading(true);

    if (this.isEdit) {
      this.updateRecoveryStar(formData);
    } else {
      this.submitRecoveryStar(formData);
    }
  }

  public validate(index) {
    let current_tab = index - 1;
    let flag = true;
    if (current_tab == 1) {
      flag = this.validateSectionA();
    }
    else if (current_tab == 2) {
      flag = this.validateSectionB();
    }
    else if (current_tab == 3) {
      flag = this.validateSectionC();
    }
    else if (current_tab == 4) {
      flag = this.validateSectionD();
    }
    else if (current_tab == 5) {
      flag = this.validateSectionE();
    }
    else if (current_tab == 6) {
      flag = this.validateSectionF();
    }
    else if (current_tab == 7) {
      flag = this.validateSectionG();
    }
    else if (current_tab == 8) {
      flag = this.validateSectionH();
    }
    else if (current_tab == 9) {
      flag = this.validateSectionI();
    }
    else if (current_tab == 10) {
      flag = this.validateSectionJ();
    }
    else {
      // current tab 11
      flag = this.validateSectionK();
    }
    if (!flag) {
      if (current_tab != 11) {
        alert('Please fill all fields and give score ');
      }
    }
    else {
      if (current_tab == 11) {
        this.onSubmit(this.recoveryStar);
      } else {
        this.onClickNext(index);
      }
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

  public getRecoverystars() {
    if (this.isReload) {
      // location.reload();
      this.router.navigate([Constants.routes.dashboard()]);

    } else
      this.showAllRecoveryStar.emit();
  }

  private validateSectionA() {
    if (this.recoveryStar.managingMentalHealthScorePatient == null) {
      return false;
    }
    else if (this.recoveryStar.managingMentalHealthScoreStaff == null) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore1Client == null || this.recoveryStar.reasonsForChoosingScore1Client.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore1Staff == null || this.recoveryStar.reasonsForChoosingScore1Staff.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForDisagreement1 == null || this.recoveryStar.reasonsForDisagreement1.replace(/\s/g, "").length == 0) {
      return false;
    } else {
      return true;
    }
  }

  private validateSectionB() {
    if (this.recoveryStar.selfCareScorePatient == null) {
      return false;
    }
    else if (this.recoveryStar.selfCareScoreStaff == null) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore2Client == null || this.recoveryStar.reasonsForChoosingScore2Client.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore2Staff == null || this.recoveryStar.reasonsForChoosingScore2Staff.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForDisagreement2 == null || this.recoveryStar.reasonsForDisagreement2.replace(/\s/g, "").length == 0) {
      return false;
    } else {
      return true;
    }
  }

  private validateSectionC() {
    if (this.recoveryStar.livingSkillsScorePatient == null) {
      return false;
    }
    else if (this.recoveryStar.livingSkillsScoreStaff == null) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore3Client == null || this.recoveryStar.reasonsForChoosingScore3Client.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore3Staff == null || this.recoveryStar.reasonsForChoosingScore3Staff.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForDisagreement3 == null || this.recoveryStar.reasonsForDisagreement3.replace(/\s/g, "").length == 0) {
      return false;
    } else {
      return true;
    }
  }

  private validateSectionD() {
    if (this.recoveryStar.socialNetworksScorePatient == null) {
      return false;
    }
    else if (this.recoveryStar.socialNetworksScoreStaff == null) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore4Client == null || this.recoveryStar.reasonsForChoosingScore4Client.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore4Staff == null || this.recoveryStar.reasonsForChoosingScore4Staff.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForDisagreement4 == null || this.recoveryStar.reasonsForDisagreement4.replace(/\s/g, "").length == 0) {
      return false;
    } else {
      return true;
    }
  }

  private validateSectionE() {
    if (this.recoveryStar.workScorePatient == null) {
      return false;
    }
    else if (this.recoveryStar.workScoreStaff == null) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore5Client == null || this.recoveryStar.reasonsForChoosingScore5Client.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore5Staff == null || this.recoveryStar.reasonsForChoosingScore5Staff.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForDisagreement5 == null || this.recoveryStar.reasonsForDisagreement5.replace(/\s/g, "").length == 0) {
      return false;
    } else {
      return true;
    }
  }

  private validateSectionF() {
    if (this.recoveryStar.relationshipsScorePatient == null) {
      return false;
    }
    else if (this.recoveryStar.relationshipsScoreStaff == null) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore6Client == null || this.recoveryStar.reasonsForChoosingScore6Client.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore6Staff == null || this.recoveryStar.reasonsForChoosingScore6Staff.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForDisagreement6 == null || this.recoveryStar.reasonsForDisagreement6.replace(/\s/g, "").length == 0) {
      return false;
    } else {
      return true;
    }
  }

  private validateSectionG() {
    if (this.recoveryStar.addictiveBehaviourScorePatient == null) {
      return false;
    }
    else if (this.recoveryStar.addictiveBehaviourScoreStaff == null) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore7Client == null || this.recoveryStar.reasonsForChoosingScore7Client.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore7Staff == null || this.recoveryStar.reasonsForChoosingScore7Staff.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForDisagreement7 == null || this.recoveryStar.reasonsForDisagreement7.replace(/\s/g, "").length == 0) {
      return false;
    } else {
      return true;
    }
  }

  private validateSectionH() {
    if (this.recoveryStar.responsibilitiesScorePatient == null) {
      return false;
    }
    else if (this.recoveryStar.responsibilitiesScoreStaff == null) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore8Client == null || this.recoveryStar.reasonsForChoosingScore8Client.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore8Staff == null || this.recoveryStar.reasonsForChoosingScore8Staff.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForDisagreement8 == null || this.recoveryStar.reasonsForDisagreement8.replace(/\s/g, "").length == 0) {
      return false;
    } else {
      return true;
    }
  }

  private validateSectionI() {
    if (this.recoveryStar.identityAndSelfEsteemScorePatient == null) {
      return false;
    }
    else if (this.recoveryStar.identityAndSelfEsteemScoreStaff == null) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore9Client == null || this.recoveryStar.reasonsForChoosingScore9Client.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore9Staff == null || this.recoveryStar.reasonsForChoosingScore9Staff.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForDisagreement9 == null || this.recoveryStar.reasonsForDisagreement9.replace(/\s/g, "").length == 0) {
      return false;
    } else {
      return true;
    }
  }

  private validateSectionJ() {
    if (this.recoveryStar.trustAndHopeScorePatient == null) {
      return false;
    }
    else if (this.recoveryStar.trustAndHopeScoreStaff == null) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore10Client == null || this.recoveryStar.reasonsForChoosingScore10Client.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForChoosingScore10Staff == null || this.recoveryStar.reasonsForChoosingScore10Staff.replace(/\s/g, "").length == 0) {
      return false;
    }
    else if (this.recoveryStar.reasonsForDisagreement10 == null || this.recoveryStar.reasonsForDisagreement10.replace(/\s/g, "").length == 0) {
      return false;
    } else {
      return true;
    }
  }

  private validateSectionK() {

    if (this.recoveryStar.nextReviewMeetingTodo == null || this.recoveryStar.nextReviewMeetingTodo.replace(/\s/g, "").length == 0) {
      alert("Please fill next review meeting");
      return false;
    }
    else if (this.recoveryStar.completedDate == null) {
      alert("Please select completed date");
      return false;
    }
    else if (this.recoveryStar.nextReviewDate == null) {
      alert("Please select next review date");
      return false;
    }
    else if (this.recoveryStar.completedBy == null) {
      alert("Please select completed by");
      return false;
    }

    else if (this.recoveryStar.circulatedTo == null || this.recoveryStar.circulatedTo.replace(/\s/g, "").length == 0) {
      alert("Please select circulated to");
      return false;
    }

    else if (!this.recoveryStar.signOffBy) {
      alert("Please select sign off by");
      return false;
    }
    else {
      return true;
    }


  }

  private getUsers() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe(response => {
      if (response) {
        this.usersList = response;
      }
    }, err => {
      console.error("could not fetch users :: " + err.error);
    })
  }

  private getCirculatedTo() {
    return EnumConverter.ConvertEnumToArray(this.circulatedToEnum);
  }

  private getSummaryOtherAgencies() {
    return EnumConverter.ConvertEnumToArray(this.summaryOtherAgency);
  }

  private setValues() {
    this.currentUserId = Number((localStorage.getItem('_identity')) ? JSON.parse(localStorage.getItem('_identity')).id : '');
    this.recoveryStarService.getRecoveryStar(this.recoveryStarId).subscribe(response => {
      if (response) {
        this.recoveryStar = response;
        this.recoveryStar.circulatedTo.split('|').forEach(element => {
          this.circulateTo.push(Number(element));
        });
        this.recoveryStar.areasToWorkOn.split('|').forEach(element => {
          this.summaryOtherAgencyIds.push(Number(element));
        })
      }
    }, err => {
      alert(err.error);
    });
    this.SetLoading(false);
  }

  private submitRecoveryStar(formData) {
    this.SetLoading(true);
    this.recoveryStar.patientId = this.userData.id;
    this.recoveryStarService.addRecoveryStar(formData).subscribe(response => {
      if (response) {
        alert("Pathway added successfully");
      }
      this.SetLoading(false);
      this.onClickNext(12);
      this.getRecoverystars();

    }, (error) => {
      alert(error.error);
      this.SetLoading(false);
    })
    this.SetLoading(false);
  }

  private updateRecoveryStar(formData) {
    this.SetLoading(true);
    if (this.currentUserId == this.recoveryStar.signOffBy) {
      this.recoveryStar.isSignOff = true;
    }
    this.recoveryStar.patientId = this.userData.id;
    this.recoveryStarService.updateRecoveryStar(formData).subscribe(response => {
      if (response) {
        alert("Pathway updated successfully");
          this.getRecoverystars();
      }
      this.SetLoading(false);
    }, (error) => {
      alert(error.error);
      this.SetLoading(false);
      console.error(error);

    })
  }

}
