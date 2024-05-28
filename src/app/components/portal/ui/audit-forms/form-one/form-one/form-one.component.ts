import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { FormOneOthers } from 'src/app/shared/enums/form-one-other.enum';
import { IncidentType } from 'src/app/shared/enums/incident-type.enum';
import { MedicalIncident } from 'src/app/shared/enums/medical-incident.enum';
import { MedicationRefusal } from 'src/app/shared/enums/medication-refusal.enum';
import { UserType } from 'src/app/shared/enums/user-type.enum';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-form-one',
  templateUrl: './form-one.component.html',
  styleUrls: ['./form-one.component.scss']
})
export class FormOneComponent extends BaseComponent implements OnInit {

  public locationList: Array<Location> = [];
  public formOne: FormGroup;
  public incidents: Array<any> = [];
  public incidentEnum = IncidentType;
  private incidentIds: Array<number> = [];

  public medicationRefusals: Array<any> = [];
  public medicationRefusalEnum = MedicationRefusal;
  private medicationRefusalIds: Array<number> = [];

  public medicalIncidents: Array<any> = [];
  public medicalIncidentEnum = MedicalIncident;
  private medicalIncidentIds: Array<number> = [];

  public formOneOthers: Array<any> = [];
  public formOneOtherEnum = FormOneOthers;
  private formOneOtherIds: Array<number> = [];

  public today: Date = new Date();
  public usersList: User[] = [];
  constructor(private locationService: LocationServices, private fb: FormBuilder, private userService: UserService) { super() }

  ngOnInit(): void {
    this.SetLoading(true);
    this.getLocations();
    this.incidents = this.getIncidentType();
    this.medicationRefusals = this.getMedicationRefusal();
    this.medicalIncidents = this.getMedicalIncidents();
    this.formOneOthers = this.getFormOneOthers();
    this.newFormOne();
    this.getUsers();
  }

  public changeIncident(option, event) {
    if (event.target.checked) {
      this.incidentIds.push(option.value);
    } else {
      for (var i = 0; i < this.incidentIds.length; i++) {
        if (this.incidentIds[i] == option.value) {
          this.incidentIds.splice(i, 1);
        }
      }
    }
  
    // this.recoveryStar.areasToWorkOn = this.incidentIds.join("|");
  }

  public isIncidentChecked(value) {
    if (this.incidentIds.includes(value)) {
      return true;
    } else {
      return false;
    }
  }

  public changeMedicationRefusalEnum(option, event) {
    if (event.target.checked) {
      this.medicationRefusalIds.push(option.value);
    } else {
      for (var i = 0; i < this.medicationRefusalIds.length; i++) {
        if (this.medicationRefusalIds[i] == option.value) {
          this.medicationRefusalIds.splice(i, 1);
        }
      }
    }

    // this.recoveryStar.areasToWorkOn = this.medicationRefusalIds.join("|");
  }

  public isMedicationRefusalEnumChecked(value) {
    if (this.medicationRefusalIds.includes(value)) {
      return true;
    } else {
      return false;
    }
  }

  public changeMedicalIncidentEnum(option, event) {
    if (event.target.checked) {
      this.medicalIncidentIds.push(option.value);
    } else {
      for (var i = 0; i < this.medicalIncidentIds.length; i++) {
        if (this.medicalIncidentIds[i] == option.value) {
          this.medicalIncidentIds.splice(i, 1);
        }
      }
    }

    // this.recoveryStar.areasToWorkOn = this.medicalIncidentIds.join("|");
  }

  public isMedicalIncidentEnumChecked(value) {
    if (this.medicalIncidentIds.includes(value)) {
      return true;
    } else {
      return false;
    }
  }

  public changeOtherEnum(option, event) {
    if (event.target.checked) {
      this.formOneOtherIds.push(option.value);
    } else {
      for (var i = 0; i < this.formOneOtherIds.length; i++) {
        if (this.formOneOtherIds[i] == option.value) {
          this.formOneOtherIds.splice(i, 1);
        }
      }
    }
    
    // this.recoveryStar.areasToWorkOn = this.formOneOtherIds.join("|");
  }

  public isOthEnumChecked(value) {
    if (this.formOneOtherIds.includes(value)) {
      return true;
    } else {
      return false;
    }
  }

  private getLocations() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.locationService.getLocations(careHomeId).subscribe(response => {
      if (response) {
        this.locationList = response;
      }
    }, err => {
      console.error("could not fetch location :: " + err.error);
    });
  }

  private getIncidentType() {
    return EnumConverter.ConvertEnumToArray(IncidentType);
  }

  private getMedicationRefusal() {
    return EnumConverter.ConvertEnumToArray(MedicationRefusal);
  }

  private getMedicalIncidents() {
    return EnumConverter.ConvertEnumToArray(MedicalIncident);
  }

  private getFormOneOthers() {
    return EnumConverter.ConvertEnumToArray(FormOneOthers);
  }

  private newFormOne() {
    // this.formOne = this.fb.group({
    //   id: [0],
    //   firstName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
    //   lastName: [''],
    //   userName: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
    //   email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
    //   userType: [UserType.User, Validators.compose([Validators.required])],
    //   staffNumber: [''],
    //   joiningDate: [null],
    //   locationIds: ['', Validators.compose([Validators.required])],
    //   position: [''],
    //   isActive: [true],
    //   training: [''],
    //   courses: this.fb.array([
    //     // this.addCourseFormGroup()
    //   ]),
    // });
  }

  private getUsers() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe(response => {
      if (response) {
        this.usersList = response.filter(x => x.userType == UserType.Auditor);
      }
    }, err => {
      alert("could not fetch users::" + err.error);
    })
    // this.isBusy = false;
  }
}
