import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PatientZoneLogService } from 'src/app/services/patient-zone-log.service';
import { PatientService } from 'src/app/services/patient.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { AdmissionStatus } from 'src/app/shared/enums/admission-status.enum';
import { UserType } from 'src/app/shared/enums/user-type.enum';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { PatientZoneActionMapping } from 'src/app/shared/models/patient-zone-action-mapping';
import { PatientZoneCriteriaMapping } from 'src/app/shared/models/patient-zone-criteria-mapping';
import { PatientZoneLog } from 'src/app/shared/models/patient-zoning-log';
import { User } from 'src/app/shared/models/user';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-patient-zone-log',
  templateUrl: './patient-zone-log.component.html',
  styleUrls: ['./patient-zone-log.component.scss'],
})
export class PatientZoneLogComponent extends BaseComponent implements OnInit {
  @Input() locationId: number;

  public patienLog: Array<PatientZoneLog> = [];
  public patientList: Array<PatientAdmission> = [];
  public patientId: number;
  private usersList: Array<User> = [];
  private roles: any;

  constructor(
    private zoneLogService: PatientZoneLogService,
    private patientService: PatientService,
    private userService: UserService
  ) {
    super();
  }

  ngOnInit(): void { }

  ngOnChanges(): void {
    if (!this.locationId) {
      return;
    }
    this.getUsers();
    this.roles = EnumConverter.ConvertEnumToArray(UserType);
    this.getPatients();
  }

  // public goBack() {
  //   this.getPatients.emit();
  // }

  public getCriterias(locationCriterias: Array<PatientZoneCriteriaMapping>) {
    if (locationCriterias) {
      let criteriaNames = [];
      locationCriterias.forEach((element) => {
        if (element.locationCriteria)
          criteriaNames.push(element.locationCriteria.name);
      });
      return criteriaNames.join(',');
    } else {
      return '-';
    }
  }

  public getActions(locationActions: Array<PatientZoneActionMapping>) {
    if (locationActions) {
      let actionNames = [];
      locationActions.forEach((element) => {
        if (element.locationAction)
          actionNames.push(element.locationAction.name);
      });
      return actionNames.join(',');
    } else {
      return '-';
    }
  }

  public getPatientLog(patientId) {
    if (patientId) {
      this.SetLoading(true);
      this.zoneLogService.getPatientLogs(patientId).subscribe(
        (response) => {
          if (response.length > 0) {
            this.patienLog = response;
          }
          else {
            this.patienLog = [];
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

  public movedBy(userId) {
    let user = this.usersList.find((x) => x.id == userId);
    return ((user.firstName == null || user.lastName == null ? user.email : user.firstName + ' ' + user.lastName) + ' (' + this.roles.find((x) => x.value == user.userType).key + ')');
  }

  private getPatients() {
    this.SetLoading(true);
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    this.patientService.getPatientsWithAlert(careHomeId).subscribe(
      (response) => {
        if (response) {
          this.patientList = response.filter((x) => x.locationId == this.locationId && x.status != AdmissionStatus.Closed);
          this.patienLog = [];
        }
        this.SetLoading(false);
      },
      (error) => {
        alert(error.error);
        this.SetLoading(false);
      }
    );
    this.SetLoading(false);
  }

  private getUsers() {
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    this.userService.getUsers(careHomeId).subscribe(
      (response) => {
        if (response) {
          this.usersList = response;
        }
      },
      (err) => {
        console.error('could not fetch users::' + err.error);
      }
    );
  }
}
