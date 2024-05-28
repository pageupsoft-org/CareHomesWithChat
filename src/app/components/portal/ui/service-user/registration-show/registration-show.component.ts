import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { LocationServices } from 'src/app/services/location.service';
import { PatientService } from 'src/app/services/patient.service';
import { RiskAssessmentService } from 'src/app/services/risk-assessment.service';
import { UpdateLogService } from 'src/app/services/update-log.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { AdmissionStatus } from 'src/app/shared/enums/admission-status.enum';
import { AppropriateService } from 'src/app/shared/enums/appropriate-services.enum';
import { CirculatedTo } from 'src/app/shared/enums/circulated-to.enum';
import { CovidScreening } from 'src/app/shared/enums/covid-screening.enum';
import { EthnicOrigin } from 'src/app/shared/enums/ethnicOrigin.enum';
import { Gender } from 'src/app/shared/enums/gender.enum';
import { LegalStatus } from 'src/app/shared/enums/legal-status.enum';
import { MHAStatus } from 'src/app/shared/enums/mha-status.enum';
import { NameTitle } from 'src/app/shared/enums/name-title.enum';
import { PatientsRelationship } from 'src/app/shared/enums/patient-relationship.enum';
import { Location } from 'src/app/shared/models/location';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { RiskAssessment } from 'src/app/shared/models/risk-assessment';
import { UpdateLog } from 'src/app/shared/models/update-log';

import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/util/Constants';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-registration-show',
  templateUrl: './registration-show.component.html',
  styleUrls: ['./registration-show.component.scss']
})
export class RegistrationShowComponent extends BaseComponent implements OnInit {
  tabIndex: number;
  active: number;
  id: number;
  patientAdmission: PatientAdmission;

  headerTab: number;
  activeHead: number;

  admissionStatusArray = AdmissionStatus;
  legalStatusArray = LegalStatus;
  mahStatus = MHAStatus;
  genderArr = Gender;
  nameTitle = NameTitle;
  relationshipArr = PatientsRelationship;
  covidScreeningArray = CovidScreening;
  ethinicArray = EthnicOrigin;
  appropriateArray = AppropriateService;
  locationList: Array<Location> = [];
  usersList: User[] = [];
  riskAssessmentList: Array<any> = [];
  circulatedToArray: Array<any> = [];
  circulatedTo: string;
  riskAssessmentData: RiskAssessment;

  showRiskAssessment: boolean = true;
  viewAssessment: boolean = false;
  editRiskAssessment: boolean = false;
  userData: PatientAdmission;
  public logList: Array<UpdateLog> = [];
  public showLogDetail: boolean = false;
  public previousValues;

  constructor(private locationService: LocationServices, private userService: UserService, private route: ActivatedRoute, private patientService: PatientService, private ngZone: NgZone, private riskAssessmentService: RiskAssessmentService, private updateLogServices: UpdateLogService) { super(); }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getPatient(this.id);
    this.getUsers();
    this.getLog();
    this.getLocations();
    this.onTabChange(2);
    this.changeTab(1);
    // this.getRiskAssessments();
    this.circulatedToArray = this.getCirculatedTo();
  }

  onTabChange(index) {
    this.tabIndex = index;
    this.active = index;
  }

  changeTab(index: number) {
    this.headerTab = index;
    this.activeHead = index;
    this.showRiskAssessment = true;
    this.viewAssessment = false;
    this.editRiskAssessment = false

  }

  getRiskAssessments() {
    this.riskAssessmentService.getRiskAssessments(this.id).subscribe(response => {
      if (response) {
        this.riskAssessmentList = response;
      }
    }, err => {
      alert(err.error);
    })
  }

  getCirculatedTo() {
    var circulatedTo = EnumConverter.ConvertEnumToArray(CirculatedTo);
    return circulatedTo;
  }

  getCirculateToString(circulatedToString: string) {
    let newString = [];
    circulatedToString.split('|').forEach(element => {
      this.circulatedToArray.forEach((el) => {
        if (el.value == element) {
          newString.push(el.key);
        }
      });
    });
    return newString.join();

  }

  getLocations() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.locationService.getLocations(careHomeId).subscribe(response => {
      if (response) {
        this.locationList = response;
      }
    }, err => {
      console.error('could not fetch location::' + err.error);
    });
  }

  getUsers() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe(response => {
      if (response) {
        this.usersList = response
      }
    }, err => {
      console.error("could not fetch users::" + err.error);
    })
    this.isBusy = false;
  }

  getGender() {
    var genderArray = EnumConverter.ConvertEnumToArray(Gender);
    return genderArray;
  }

  getEthinicOrigin() {
    var ethinic = EnumConverter.ConvertEnumToArray(EthnicOrigin);
    return ethinic;
  }

  getAppropriateService() {
    var appropriate = EnumConverter.ConvertEnumToArray(AppropriateService);
    return appropriate;
  }

  getRelationship() {
    var relationship = EnumConverter.ConvertEnumToArray(PatientsRelationship);
    return relationship;
  }

  getCovidScreening() {
    var covid = EnumConverter.ConvertEnumToArray(CovidScreening);
    return covid;
  }

  getAdmissionStatus() {
    var admissionStatus = EnumConverter.ConvertEnumToArray(AdmissionStatus);
    return admissionStatus;
  }

  getLegalStatus() {
    var legalStatusArray = EnumConverter.ConvertEnumToArray(LegalStatus);
    return legalStatusArray;
  }

  getNameTitle() {
    var nameTitle = EnumConverter.ConvertEnumToArray(NameTitle);
    return nameTitle;
  }

  getmahStatus() {
    var mahStatus = EnumConverter.ConvertEnumToArray(MHAStatus);
    return mahStatus;
  }

  private getPatient(id: number) {
    this.SetLoading(true);
    if (id) {
      this.patientService.getPatient(id).subscribe(response => {
        if (response) {
          this.patientAdmission = response;
          this.userData = response;
        } else {
          alert("something went wrong! try again later");

        }
        this.SetLoading(false);
      }, err => {
        this.SetLoading(false);
        alert(err.error);
      })
    } else {
      alert("Something went wrong");
    }
  }

  getUserNameList(careCoordinator: any) {
    let userName = [];
    careCoordinator.forEach(element => {
      this.usersList.forEach((el) => {
        if (el.id == element.careCoordinatorId) {
          userName.push(el.firstName)
        }
      });
    });
    return userName.join();
  }

  getLocationName(locationId: any) {
    let locationName = '';
    this.locationList.forEach(element => {
      if (element.id == locationId) {
        locationName = element.name;
      }
    })
    return locationName;
  }

  getSignOffName(signOffId: number) {
    let userName = '';
    this.usersList.forEach((el) => {
      if (el.id == signOffId) {
        userName = el.firstName;

      }
    });
    return userName;
  }

  createRiskAssessment() {
    this.showRiskAssessment = !this.showRiskAssessment;
    if (!this.showRiskAssessment) {
      this.userData = this.patientAdmission

    } else {
      this.getRiskAssessments();
    }
  }

  removeRiskAssessment(id: number) {
    if (id) {
      if (confirm("Are you sure you want to delete this record?")) {
        this.SetLoading(true);
        this.riskAssessmentService.deleteRiskAssessment(id).subscribe(response => {
          if (response) {
            alert("Successfully  removed");
            this.getRiskAssessments();
          }
          this.SetLoading(false);
        }, error => {
          alert(error.error);
          this.SetLoading(false);
        })
      }
    } else {
      alert('Opps!! Something went wrong.Try again later');
    }
  }

  viewRiskAssessment(id: number) {
    if (id) {
      this.riskAssessmentService.getRiskAssessment(id).subscribe(response => {
        if (response) {
          this.viewAssessment = true;
          this.riskAssessmentData = response;
        }
      }, error => {
        alert(error.error);
      })
    }
  }

  editAssessment(riskAssessment: RiskAssessment) {
    this.editRiskAssessment = true;
    this.riskAssessmentData = riskAssessment;
  }

  public getUserName(userId: number) {
    if (userId) {
      let name;
      // return this.usersList.filter(x => x.id == userId);
      name = this.usersList.find(x => x.id == userId);
      if (name.firstName == null && name.lastName == null)
        return name.email + "(Admin)";
      else
        return ((name.firstName)?name.firstName:'') + " " + ((name.lastName)?name.lastName:'');
    }
  }

  public showLogDetails(previousValues) {
    this.previousValues = JSON.parse(previousValues);
    this.showLogDetail = true;
 
  }

  public showAllLogs() {
    this.showLogDetail = false;
    this.onTabChange(7);
  }
  private getLog() {
    this.updateLogServices.getLogs('Patient', this.id).subscribe(response => {
      if (response.length>0) {
        this.logList = response;
      }
    }, err => {
      alert(err.error);
    })
  }
}
