import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormTwoService } from 'src/app/services/form-two.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { Consequences } from 'src/app/shared/enums/consequences.enum';
import { IncidentOccurStage } from 'src/app/shared/enums/incident-occur-stage.enum';
import { IncidentTypeFormTwo } from 'src/app/shared/enums/incident-type-form-two.enum';
import { InjuriesType } from 'src/app/shared/enums/injuries-type.enum';
import { MedicationIncidentCodes } from 'src/app/shared/enums/medication-incident-codes.enum';
import { NatureOfActivity } from 'src/app/shared/enums/nature-of-activityts.enum';
import { OtherFactors } from 'src/app/shared/enums/other-factors.enum';
import { Status } from 'src/app/shared/enums/status.enum';
import { ViolentIncidents } from 'src/app/shared/enums/violent-incidents';
import { AuditFormTwo } from 'src/app/shared/models/audit-form-two';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-form-two-show',
  templateUrl: './form-two-show.component.html',
  styleUrls: ['./form-two-show.component.scss']
})
export class FormTwoShowComponent extends BaseComponent implements OnInit {

  public auditForm: AuditFormTwo;
  public status = Status;
  public otherFactors = OtherFactors;
  public natureOfActivity = NatureOfActivity;
  public violentIncidents = ViolentIncidents;
  public incident = IncidentTypeFormTwo;
  public injuryType = InjuriesType;
  public consequences = Consequences;
  public incidentOccurStage = IncidentOccurStage;
  public incidentCodes = MedicationIncidentCodes;

  private userList: Array<User> = [];
  private locationList: Array<Location> = [];
  public active: number = 1;

  public incidentLocationName: string;
  public locationName: string;

  constructor(private locationService: LocationServices, private route: ActivatedRoute, private userService: UserService, private formTwoService: FormTwoService) { super() }

  ngOnInit(): void {
    this.getLocations();
    this.getUsers();
    if (this.route.snapshot.params['id']) {
      // this.isEdit = true;
      this.getFormTwo(this.route.snapshot.params['id']);
    } else {
      alert("Something went wrong!!");
      this.goBack();
    }

  }

  public goBack() {
    window.history.back();
  }

  public getLocation(locationId: number) {
    if (locationId) {
      if (this.locationList.find(x => x.id == locationId))
        return this.locationList.find(x => x.id == locationId).name;
    } else {
      return "-";
    }
  }

  public getUserName(userId: number) {
    if (userId && this.userList.length > 0) {
      let name;
      // return this.usersList.filter(x => x.id == userId);
      name = this.userList.find(x => x.id == userId);
      if (name.firstName == null && name.lastName == null)
        return name.email + "(Admin)";
      else
        return ((name.firstName)?name.firstName:'') + " " + ((name.lastName)?name.lastName:'');
    }
  }

  public onTabChange(index) {
    this.active = index;
  }

  private getUsers() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe((response) => {
      if (response) {
        this.userList = response;
      }
    },
      (err) => {
        console.error('could not fetch users::' + err.error);
      }
    );
  }

  private getLocations() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.locationService.getLocations(careHomeId).subscribe(response => {
      if (response) {
        this.locationList = response;
      }
    }, err => {
      console.error('could not fetch location::' + err.error);
    });
  }

  private getFormTwo(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formTwoService.getForm(id).subscribe((response) => {
        if (response) {
          this.auditForm = new AuditFormTwo();
          this.auditForm = response;
          this.getUserName(this.auditForm.signoffBy);
          this.locationName = this.getLocation(this.auditForm.locationId);
          this.incidentLocationName = this.getLocation(this.auditForm.incidentLocation);
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

}
