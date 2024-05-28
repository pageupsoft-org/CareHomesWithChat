import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormFourteenService } from 'src/app/services/form-fourteen.service';
import { LocationServices } from 'src/app/services/location.service';
import { PatientService } from 'src/app/services/patient.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { RiskEntry } from 'src/app/shared/enums/risk-entry.enum';
import { AuditFormFourteen } from 'src/app/shared/models/audit-form-fourteen';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-form-fourteen-show',
  templateUrl: './form-fourteen-show.component.html',
  styleUrls: ['./form-fourteen-show.component.scss'],
})
export class FormFourteenShowComponent extends BaseComponent implements OnInit {
  public locationList: Array<Location> = [];
  public auditForm: AuditFormFourteen;
  public userList: Array<User> = [];
  public locationName: string = "";
  public signOffBy: string = "";
  public patientName: string = "";
  public riskEntry = RiskEntry;

  constructor(
    private locationService: LocationServices,
    private formfourteenService: FormFourteenService,
    private userService: UserService,
    private patientService: PatientService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    if (!this.route.snapshot.params['id']) {
      alert('something went wrong!!');
      this.goBack();
    }
    this.getFormFourteen(this.route.snapshot.params['id']);
  }

  public goBack() {
    window.history.back();
  }

  public getLocation(locationId: number) {
    if (locationId) {
      this.locationService.getLocation(locationId).subscribe((response) => {
        if (response) {
          return this.locationName = response.name;
        }
      },
        (err) => {
          console.error('could not fetch locations ::' + err.error);
        }
      );
    }
  }

  private getFormFourteen(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formfourteenService.getForm(id).subscribe(
        (response) => {
          if (response) {
            this.auditForm = response;
            this.getPatient(this.auditForm.patientId);
          }
          this.SetLoading(false);
        },
        (err) => {
          this.SetLoading(false);
          alert(err.error);
        }
      );
    }
  }

  public getUser(id: number) {
    if (id) {
      this.SetLoading(true);

      this.userService.getUser(id).subscribe((response) => {
        if (response)
          return this.signOffBy = (response.firstName == null || response.lastName == null) ? response.email : (response.firstName + " " + response.lastName)
        this.SetLoading(false);
      },
        (err) => {
          this.SetLoading(false);
          console.error('could not fetch users::' + err.error);
        }
      );
    }
  }

  public getPatient(id: number) {
    if (id) {
      this.SetLoading(true);

      this.patientService.getPatient(id).subscribe(
        (response) => {
          if (response) {
            return this.patientName = response.firstName + " " + response.lastName
          }
          this.SetLoading(false);
        },
        (err) => {
          console.error('could not fetch users::' +err.error);
          this.SetLoading(false);
        }
      );
    }
  }
}
