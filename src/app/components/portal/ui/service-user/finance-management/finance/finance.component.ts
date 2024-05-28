import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PatientTransactionService } from 'src/app/services/finance.service';
import { PatientService } from 'src/app/services/patient.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { CirculatedTo } from 'src/app/shared/enums/circulated-to.enum';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { PatientTransaction } from 'src/app/shared/models/patient-transaction';
import { User } from 'src/app/shared/models/user';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent extends BaseComponent implements OnInit {
  @Input() userData: PatientAdmission;
  @Input() transictionData: PatientTransaction;
  @Output() getAllTransaction: EventEmitter<any> = new EventEmitter<any>();

  public usersList: Array<User> = [];
  public circulatedToEnum = CirculatedTo;
  public circulatedToArray: Array<any> = [];
  public circulateTo: Array<number> = [];
  public patientTransaction: PatientTransaction;
  public isEdit: boolean = false;
  public currentUserId: number = 0;


  constructor(private userService: UserService, private patientTransactionService: PatientTransactionService, private patientService: PatientService) { super(); }

  ngOnInit(): void {
    if (!this.userData) {
      return;
    }
    this.getUsers();
    this.getPatientById();
    this.circulatedToArray = this.getCirculatedTo();
    if (this.isEdit) { } else {
      this.patientTransaction = new PatientTransaction();
      this.patientTransaction.completedBy = Number(JSON.parse(localStorage.getItem('_identity')).id);
      if (this.currentUserRole == this.userType.Admin || this.currentUserRole == this.userType.SuperUser) {
        this.patientTransaction.signOffBy = Number(JSON.parse(localStorage.getItem('_identity')).id);
        this.patientTransaction.isSignOff = true;
      }
    }
  }

  public onSubmit() {

    if (this.patientTransaction.amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (!this.patientTransaction.completedBy) {
      alert("Please select completed by");
      return;
    }
    if (!this.patientTransaction.signOffBy) {
      alert("Please select sign-off by");
      return;
    }
    if (!this.patientTransaction.transactionDate) {
      alert("Please select date");
      return;
    }
    if (!this.patientTransaction.circulatedTo || this.patientTransaction.circulatedTo.length <= 0) {
      alert("Please select circulated to");
      return;
    }

    this.patientTransaction.patientId = this.userData.id;
    if (this.isEdit) { }
    else {
      this.addPatientTransaction();
    }
  }

  public getTransactions() {
    this.getAllTransaction.emit();
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
    this.patientTransaction.circulatedTo = this.circulateTo.join("|");
  }

  public isCirculatedChecked(value) {
    if (this.circulateTo.includes(value)) {
      return true;
    } else {
      return false;
    }
  }

  private addPatientTransaction() {
    this.SetLoading(true);
    this.patientTransactionService.addTransaction(this.patientTransaction).subscribe(response => {
      if (response) {
        alert('Record inserted successfully');
        this.getTransactions();
      }
    }, err => {
      alert(err.error);
    })
    this.SetLoading(false);
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
      console.error("could not fetch users :: " + err.error);
    })
  }

  private getPatientById() {
    this.patientService.getPatient(this.userData.id).subscribe(response => {
      if (response) {
        this.userData = response;
      }
    }, err => {
      alert(err.error + " : Patient Record");
    })
  }

  public calculate_balance() {
    if (this.patientTransaction.mode == 'D') {
      return Number(this.userData.totalAmount) + Number(this.patientTransaction.amount);
    } else {
      return this.userData.totalAmount - this.patientTransaction.amount;
    }

  }

}
