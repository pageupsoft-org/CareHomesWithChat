import { Component, Input, OnInit } from '@angular/core';
import { PatientTransactionService } from 'src/app/services/finance.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { PatientTransaction } from 'src/app/shared/models/patient-transaction';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-finance-overview',
  templateUrl: './finance-overview.component.html',
  styleUrls: ['./finance-overview.component.scss']
})
export class FinanceOverviewComponent extends BaseComponent implements OnInit {
  @Input() userData: PatientAdmission;

  public transactionList: Array<PatientTransaction> = [];
  public showTransactionList: Boolean = true;
  public showTransaction: Boolean = false;
  public transictionData: PatientTransaction;
  public usersList: Array<User> = [];
  public showNotification = false;

  constructor(private patientTransactionService: PatientTransactionService, private userService: UserService) { super(); }

  ngOnInit(): void {
    if (!this.userData) {
      this.showNotification = true;
      return;
    }
    // this.getUsers();
    this.getAllTransaction();
  }

  public createFinance() {
    this.showTransaction = false;
    this.showTransactionList = false;
    this.transictionData = null
  }

  public getFinace(finance: any) {
    this.showTransaction = false;
    this.showTransactionList = false;
    this.transictionData = finance;
  }

  public viewTransaction(finance: any) {
    this.showTransaction = true;
    this.showTransactionList = false;
    this.transictionData = finance;
  }

  public removeTransaction(transactionId: number) {
    if (transactionId) {
      if (confirm("Are you sure you want to delete this")) {
        this.SetLoading(true);
        this.patientTransactionService.deleteTransaction(transactionId).subscribe(response => {
          if (response) {
            alert("Record deleted successfully");
            this.getAllTransaction();
          }
          this.SetLoading(false);
        }, err => {
          alert(err.error);
          this.SetLoading(false);
        })
      }
    }

  }

  public getUserName(userId: number) {
    if (userId) {
      let name;
      // return this.usersList.filter(x => x.id == userId);
      if (this.usersList.length > 0) {
        name = this.usersList.find(x => x.id == userId);
        if (name) {
          if (name.firstName == null && name.lastName == null)
            return name.email;
          else
            return ((name.firstName)?name.firstName:'') + " " + ((name.lastName)?name.lastName:'');
        }
      }
    }
  }

  public getAllTransaction() {
    this.SetLoading(true);
    this.showTransaction = false;
    this.showTransactionList = true;
    this.patientTransactionService.getTransactions(this.userData.id).subscribe(response => {
      if (response) {
        this.transactionList = response.sort((a, b) => {
          if (a.id < b.id) {
            return 1
          }
          if (a.id > b.id) {
            return -1
          }
          return 0
        });
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
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


}
