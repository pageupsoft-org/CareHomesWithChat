import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
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
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-updated-registrationlog',
  templateUrl: './updated-registrationlog.component.html',
  styleUrls: ['./updated-registrationlog.component.scss']
})
export class UpdatedRegistrationlogComponent implements OnInit {
  @Input() previousValues: any;
  @Output() showAllLogs: EventEmitter<any> = new EventEmitter<any>();
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

  constructor(private locationService: LocationServices, private userService: UserService) { }

  ngOnInit(): void {

    this.getUsers();
    this.getLocations();
    // this.getRiskAssessments();
    this.circulatedToArray = this.getCirculatedTo();
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
        this.usersList = response;
      }
    }, err => {
      console.error("could not fetch users::" + err.error);
    })
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

  getUserNameList(careCoordinator: any) {
    let userName = [];
    careCoordinator.forEach(element => {
      this.usersList.forEach((el) => {
        if (el.id == element.CareCoordinatorId) {
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

  public goBack(){
    this.showAllLogs.emit();
  }
}
