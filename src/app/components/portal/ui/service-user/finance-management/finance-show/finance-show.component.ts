import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { CirculatedTo } from 'src/app/shared/enums/circulated-to.enum';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { PatientTransaction } from 'src/app/shared/models/patient-transaction';
import { User } from 'src/app/shared/models/user';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-finance-show',
  templateUrl: './finance-show.component.html',
  styleUrls: ['./finance-show.component.scss']
})
export class FinanceShowComponent extends BaseComponent implements OnInit {
  @Input() userData: PatientAdmission;
  @Input() transictionData: PatientTransaction;
  @Output() getAllTransaction: EventEmitter<any> = new EventEmitter<any>();

  public usersList: Array<User> = [];
  public patientTransaction: PatientTransaction;
  public circulatedToArray: Array<any> = [];

  constructor(private userService: UserService, private patientService: PatientService) { super(); }

  ngOnInit(): void {
    this.SetLoading(true);
    // this.patientTransaction.patientId = this.userData.id;
    this.circulatedToArray = this.getCirculatedTo();
    if (!this.userData) {
      return;
    }
    this.getPatientById();
    if (this.transictionData) {
      this.patientTransaction = this.transictionData;
      if (this.patientTransaction.circulatedTo)
        this.getCirculateToString(this.patientTransaction.circulatedTo);
    } else {
      alert("Something went wrong!!");
      this.getTransactions();
      return;
    }
    this.getUsers();
    this.SetLoading(false);
  }

  public getTransactions() {
    this.getAllTransaction.emit();
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

  private getCirculateToString(circulatedToString: string) {
    let newString = [];
    circulatedToString.split('|').forEach(element => {
      this.circulatedToArray.forEach((el) => {
        if (el.value == element) {
          newString.push(el.key);
        }
      });
    });
    return this.patientTransaction.circulatedTo = newString.join();

  }

  private getCirculatedTo() {
    return EnumConverter.ConvertEnumToArray(CirculatedTo);
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
}
