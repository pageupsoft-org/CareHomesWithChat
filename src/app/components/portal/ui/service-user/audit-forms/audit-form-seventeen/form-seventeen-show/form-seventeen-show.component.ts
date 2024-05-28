import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormSeventeenService } from 'src/app/services/form-seventeen.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { Location } from 'src/app/shared/models/location';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { User } from 'src/app/shared/models/user';
import { WeeklyMedicationStockCheck } from 'src/app/shared/models/weekly-medication-stock-check';

@Component({
  selector: 'app-form-seventeen-show',
  templateUrl: './form-seventeen-show.component.html',
  styleUrls: ['./form-seventeen-show.component.scss'],
})
export class FormSeventeenShowComponent
  extends BaseComponent
  implements OnInit {
  @Input() serviceUserData: PatientAdmission;
  @Input() weeklyMedicationStock: WeeklyMedicationStockCheck;
  @Output() getForms: EventEmitter<any> = new EventEmitter<any>();

  public weeklyMedication: WeeklyMedicationStockCheck;
  public userList: Array<User> = [];

  constructor(private formseventeenService: FormSeventeenService, private locationService: LocationServices,
    private userService: UserService) {
    super();
  }

  ngOnInit(): void {
    if (this.weeklyMedicationStock) {
      this.getForm();
      this.getUsers();
    }
  }


  public goBack() {
    this.getForms.emit();
  }

  public getName(userId: number) {
    if (userId) {
      let user: User;
      user = this.userList.find(x => x.id == userId);
      return (user.firstName == null || user.lastName == null) ? user.email : user.firstName + " " + user.lastName
    }
  }


  private getForm() {
    this.SetLoading(true);

    this.formseventeenService.getForm(this.weeklyMedicationStock.id).subscribe(
      (response) => {
        if (response) {
          this.weeklyMedication = response;
        }
        this.SetLoading(false);
      },
      (err) => {
        console.error('could not fetch users::' + err.error);
        this.SetLoading(false);
      }
    );
  }


  private getUsers() {
    this.SetLoading(true);
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    this.userService.getUsers(careHomeId).subscribe(
      (response) => {
        if (response) {
          this.userList = response;
        }
        this.SetLoading(false);
      },
      (err) => {
        this.SetLoading(false);
        console.error('could not fetch users::' + err.error);
      }
    );
  }
}
