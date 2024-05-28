import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormFifteenService } from 'src/app/services/form-fifteen.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { Location } from 'src/app/shared/models/location';
import { MedicationSpotCheck } from 'src/app/shared/models/medication-spot-check';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-form-fifteen-show',
  templateUrl: './form-fifteen-show.component.html',
  styleUrls: ['./form-fifteen-show.component.scss']
})
export class FormFifteenShowComponent extends BaseComponent implements OnInit {
  @Input() serviceUserData: PatientAdmission;
  @Input() medicationSpotCheck: MedicationSpotCheck;
  @Output() getForms: EventEmitter<any> = new EventEmitter<any>();

  public locationList: Array<Location> = [];
  public userList: Array<User> = [];
  public formFifteen: MedicationSpotCheck;

  constructor(
    private locationService: LocationServices,
    private userService: UserService,
    private formFifteenService: FormFifteenService
  ) {
    super();
  }

  ngOnInit(): void {
    if (!this.serviceUserData) {
      return;
    }
    this.getLocations();
    this.getUsers();
    if (this.medicationSpotCheck) {
      this.getFormFifteen(this.medicationSpotCheck.id);
    } else {
      alert("something went wrong");
      this.goBack();
    }
  }

  private getLocations() {
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    this.locationService.getLocations(careHomeId).subscribe(
      (response) => {
        if (response) {
          this.locationList = response;
        }
      },
      (err) => {
        console.error('could not fetch locations ::' + err.error);
      }
    );
  }

  private getUsers() {
    this.SetLoading(true);
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    this.userService.getUsers(careHomeId).subscribe((response) => {
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
  public getLocationName(locationId) {
    if (locationId) {
      return this.locationList.find(x => x.id == locationId).name;
    }
  }

  private getFormFifteen(id) {
    this.SetLoading(true);
    this.formFifteenService.getForm(id).subscribe(response => {
      if (response) {
        this.formFifteen = response;
      }
      this.SetLoading(false);
    }, (err) => {
      this.SetLoading(false);
      alert(err.error);
      this.goBack();
    })
  }

}
