import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationServices } from 'src/app/services/location.service';
import { PatientDocumentService } from 'src/app/services/patient-document.service';
import { PatientService } from 'src/app/services/patient.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { AdmissionStatus } from 'src/app/shared/enums/admission-status.enum';
import { AppropriateService } from 'src/app/shared/enums/appropriate-services.enum';
import { CovidScreening } from 'src/app/shared/enums/covid-screening.enum';
import { EthnicOrigin } from 'src/app/shared/enums/ethnicOrigin.enum';
import { Gender } from 'src/app/shared/enums/gender.enum';
import { LegalStatus } from 'src/app/shared/enums/legal-status.enum';
import { MHAStatus } from 'src/app/shared/enums/mha-status.enum';
import { NameTitle } from 'src/app/shared/enums/name-title.enum';
import { PatientsRelationship } from 'src/app/shared/enums/patient-relationship.enum';
import { Location } from 'src/app/shared/models/location';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { PatientCareCoordinator } from 'src/app/shared/models/patient-care-coordinator';
import { PatientDependents } from 'src/app/shared/models/patient-dependents';
import { PatientDocuments } from 'src/app/shared/models/patient-documents';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/util/Constants';
import { EnumConverter } from 'src/app/util/EnumConverter';
import { environment } from 'src/environments/environment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MaritalStatus } from 'src/app/shared/enums/marital-status.enum';
import * as angular from "angular";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent extends BaseComponent implements OnInit {
  @Output() onCompleteRegistration: EventEmitter<object> = new EventEmitter<object>();
  @Input() registrationData: PatientAdmission;
  @Input() isReload: boolean;

  active: number;
  public admissionStatus = AdmissionStatus;
  admissionStatusArray;
  legalStatusArray;
  mahStatus;
  genderArr;
  nameTitle;
  relationshipArr;
  covidScreeningArray;
  ethinicArray;
  public ethinicOrigin = EthnicOrigin;
  appropriateArray;
  public maritalStatusArr: Array<MaritalStatus>;
  patientRegistration: PatientAdmission;
  public isObservation: boolean = false;
  public previousSelectedStatus;

  patientDependentsObject: any = new PatientDependents();
  patientDocumentObject: any = new PatientDocuments();
  locationList: Array<Location> = [];
  usersList: User[] = [];

  isPowerOfAttorney = false;
  isSafeGuard = false;
  isDOLs = false;
  public careCoordinators: Array<any> = [];
  file: File = null; // Variable to store file
  public baseUrl = "https://carehomesstorageuk.blob.core.windows.net/docs/";
  public isEdit: boolean = false;
  private registrationId: number = 0;
  public selectedItems: Array<any> = [];
  public staffCoordinators: Array<any> = [];
  public dropdownSettings: IDropdownSettings = {};

  constructor(
    private locationService: LocationServices,
    private userService: UserService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private patientDocumentService: PatientDocumentService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.currentUserRole == this.userType.Auditor) {
      alert("you don't have access to this respource");
      window.history.back();
    }
    this.SetLoading(true);
    this.getLocations();
    this.admissionStatusArray = this.getAdmissionStatus();
    this.maritalStatusArr = EnumConverter.ConvertEnumToArray(MaritalStatus);
    this.legalStatusArray = this.getLegalStatus();
    this.mahStatus = this.getmahStatus();
    this.nameTitle = this.getNameTitle();
    this.ethinicArray = this.getEthinicOrigin();
    this.genderArr = this.getGender();
    this.relationshipArr = this.getRelationship();
    this.appropriateArray = this.getAppropriateService();
    this.covidScreeningArray = this.getCovidScreening();
    this.onTabChange(2);

    if (this.registrationData) {
      this.registrationId = this.registrationData.id;
    }
    if (this.route.snapshot.params['id']) {
      this.registrationId = this.route.snapshot.params['id'];
    }

    if (this.registrationId) {
      this.isEdit = true;
      this.currentDate = null;
      this.getPatientRegistration(this.registrationId);
    } else {
      this.patientRegistration = new PatientAdmission();
      this.patientRegistration.createdBy = Number(JSON.parse(localStorage.getItem('_identity')).id);
      if (this.currentUserRole == this.userType.Admin ||this.currentUserRole == this.userType.SuperUser) {
        this.patientRegistration.signOffBy = Number(JSON.parse(localStorage.getItem('_identity')).id);
        this.patientRegistration.isSignOff = true;
      }
      this.SetLoading(false);
    }
  }

  ngOnChanges(): void {
    this.dropdownSettings = {};
  }

  onItemSelect(item: any) {
    // this.selectedItems.push(item);
  }

  OnItemDeSelect(item: any) {
    // this.selectedItems = this.selectedItems.filter((x) => x != item.id);

  }

  onSelectAll(items: any) {
    // this.selectedItems = [];
    // items.forEach((element) => {
    //   this.selectedItems.push(element);
    // });
  }

  onDeSelectAll(items: any) {
    this.selectedItems = [];
  }

  public onTabChange(index) {
    this.active = index;
  }

  // public statusChange() {
  //   // check previous status is equal to InProgress or Active and currently new states is closed
  //   if (this.registrationData.status != AdmissionStatus.Closed && this.patientRegistration.status == AdmissionStatus.Closed) {
  //     this.patientRegistration.dateOfLeaving = null;
  //   }

  //   if (this.registrationData.status == AdmissionStatus.Closed && this.patientRegistration.status != AdmissionStatus.Closed) {
  //     this.patientRegistration.dateOfLeaving = null;
  //     this.patientRegistration.dateOfAdmission = null;
  //   }
  // }

  public statusChange() {
    if (this.registrationData && this.patientRegistration) {
        if (this.registrationData.status != AdmissionStatus.Closed && this.patientRegistration.status == AdmissionStatus.Closed) {
            this.patientRegistration.dateOfLeaving = null;
        }

        if (this.registrationData.status == AdmissionStatus.Closed && this.patientRegistration.status != AdmissionStatus.Closed) {
            this.patientRegistration.dateOfLeaving = null;
            this.patientRegistration.dateOfAdmission = null;
        }
    } else {
        // Handle the case where either this.registrationData or this.patientRegistration is undefined
        console.error('registrationData or patientRegistration is undefined');
    }
}

  public getSelectedStatus() {
    this.previousSelectedStatus = this.patientRegistration.status;
    // if(this.previousSelectedStatus == AdmissionStatus.Closed){
    //   this.patientRegistration            
    // }
  }

  private getPatientRegistration(id: number) {
    this.SetLoading(true);
    this.patientService.getPatient(id).subscribe((response) => {
      if (response) {
        this.patientRegistration = response;
        this.getUsers(response.locationId);
        // this.registrationData = JSON.parse(JSON.stringify(response)) ;
        this.registrationData = angular.copy(response);

        this.onCompleteRegistration.emit(response);
      }
      this.SetLoading(false);
    },
      (err) => {
        alert(err.error);
        this.SetLoading(false);
      }
    );
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
      (error) => {
        console.error('could not fetch::' + error.error);
      }
    );
  }

  public getUsers(locationId: number) {
    if (locationId) {
      this.SetLoading(true);

      let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
      this.userService.getByLocation(locationId, careHomeId).subscribe((response) => {
        if (response) {
          let list = [];
          list = response.filter((x) => x.userType != this.userType.Auditor);
          this.usersList = [...list];
          let newList = [...list.filter((x) => x.userType != this.userType.Admin && x.userType != this.userType.Auditor)];
          this.staffCoordinators = newList.sort(function (a, b) {
            var nameA =
              a.firstName == null ? a.firstName : a.firstName.toUpperCase(); // ignore upper and lowercase
            var nameB =
              b.firstName == null ? b.firstName : b.firstName.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            // names must be equal
            return 0;
          });

          if (this.patientRegistration.careCoordinators && this.patientRegistration.careCoordinators.length > 0) {
            this.patientRegistration.careCoordinators.forEach((element) => {
              if (this.usersList.length > 0) {
                let user = this.usersList.find((x) => x.id == element.careCoordinatorId);
                // this.careCoordinators.push(user);
                if (user) {
                  let obj = { id: user.id, firstName: user.firstName };
                  this.selectedItems.push(obj);
                  this.onItemSelect(user);
                }
              }
              // this.onItemSelect(element);
            });
          }
          this.SetLoading(false);


        }
        this.SetLoading(false);
      },
        (err) => {
          this.SetLoading(false);

          console.error('could not fetch users::' + err.error);
        });
      this.SetLoading(true);

    }
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'firstName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
    };
  }

  private getGender() {
    return EnumConverter.ConvertEnumToArray(Gender);
  }

  private getEthinicOrigin() {
    return EnumConverter.ConvertEnumToArray(EthnicOrigin);
  }

  private getAppropriateService() {
    return EnumConverter.ConvertEnumToArray(AppropriateService);
  }

  private getRelationship() {
    return EnumConverter.ConvertEnumToArray(PatientsRelationship);
  }

  private getCovidScreening() {
    return EnumConverter.ConvertEnumToArray(CovidScreening);
  }

  private getAdmissionStatus() {
    return EnumConverter.ConvertEnumToArray(AdmissionStatus);
  }

  private getLegalStatus() {
    return EnumConverter.ConvertEnumToArray(LegalStatus);
  }

  private getNameTitle() {
    return EnumConverter.ConvertEnumToArray(NameTitle);
  }

  private getmahStatus() {
    return EnumConverter.ConvertEnumToArray(MHAStatus);
  }

  private registration(form: PatientAdmission) {
    this.SetLoading(true);
    form.careCoordinators = new Array<PatientCareCoordinator>();
    this.selectedItems.forEach((element) => {
      let careCoordinator: PatientCareCoordinator =
        new PatientCareCoordinator();
      careCoordinator.careCoordinatorId = element.id;
      form.careCoordinators.push(careCoordinator);
    });

    form.careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    form.auditedBy = this.selectedItems[0].id;

    this.patientService.addPatient(form).subscribe(
      (response) => {
        if (response) {
          alert('Patient registered successfully');
          this.patientRegistration = new PatientAdmission();
          // this.addFormThirteen(response.Result);
          this.onCompleteRegistration.emit(response);
          this.getServiceUsers();
        }
        this.SetLoading(false);
      },
      (err) => {
        alert(err.error);
        this.SetLoading(false);
      }
    );
  }

  private updateRegistration(form: PatientAdmission) {
    this.SetLoading(true);
    form.careCoordinators = new Array<PatientCareCoordinator>();
    this.selectedItems.forEach((element) => {
      let careCoordinator: PatientCareCoordinator =
        new PatientCareCoordinator();
      careCoordinator.careCoordinatorId = element.id;
      form.careCoordinators.push(careCoordinator);
    });

    if (
      Number(
        localStorage.getItem('_identity')
          ? JSON.parse(localStorage.getItem('_identity')).id
          : ''
      ) == form.signOffBy
    ) {
      form.isSignOff = true;
    }

    this.patientService.updatePatient(form).subscribe((response) => {
      if (response) {
        alert('Patient registered updated successfully');
        this.getServiceUsers();
      }
      this.SetLoading(false);
    },
      (err) => {
        alert(err.error);
        this.SetLoading(false);
      }
    );
  }

  // private addFormThirteen(form) {
  //   let medicationAuditForm = new MedicationAudit();
  //   medicationAuditForm.patientId = form.id;
  //   medicationAuditForm.locationId = form.locationId;
  //   medicationAuditForm.careHomeId = Number(
  //     JSON.parse(localStorage.getItem('_identity')).careHomeId
  //   );
  //   medicationAuditForm.isSignedOff = false;
  //   medicationAuditForm.createdBy = this.currentUserId;
  //   medicationAuditForm.createdAt = new Date();
  //   medicationAuditForm.auditedBy = this.careCoordinators[0];

  //   this.formThirteenService.addForm(medicationAuditForm).subscribe();
  // }

  public onSubmit(form: PatientAdmission) {
    let flag: boolean = true;
    if (!form.signOffBy) {
      flag = false;
      return alert('Please select Sign off');
    }
    if (!form.createdBy) {
      flag = false;
      return alert('Please select created by');
    }
    if (this.patientRegistration.patientDocuments) {
      let no: number;
      this.patientRegistration.patientDocuments.forEach((element, index) => {
        no = index + 1;
        if (!element.fileAsBase64 && element.documentLocation == null) {
          flag = false;
          return alert('Please select document or remove sno. ' + no);
        }
      });
    }
    if (flag) {
      if (this.isEdit) {
        this.updateRegistration(form);
      } else {
        this.registration(form);
      }
    }
  }

  public saveGuard(event: any) {
    this.isSafeGuard = !this.isSafeGuard;
  }

  public dols(event: any) {
    this.isDOLs = !this.isDOLs;
  }

  public powerOfAttorney(event: any) {
    this.isPowerOfAttorney = !this.isPowerOfAttorney;
  }

  public checkAndNext(index) {
    // if (!this.validate(index)) {
    //   alert('Please complete mandatory(*) fields');
    // } else {
    //   this.onTabChange(index);
    // }

    let tab = index - 1;
    let flag: boolean = true;
    if (tab == 2) {
      let leavingDate = new Date(this.patientRegistration.dateOfLeaving);
      let admissionDate = new Date(this.patientRegistration.dateOfAdmission);
      if (this.patientRegistration.dateOfAdmission == null) {
        alert('Please select Date of Admission');
        return false;
      } else if (this.patientRegistration.reasonForAdmission == null || this.patientRegistration.reasonForAdmission.replace(/\s/g, '').length == 0) {
        alert('Please enter reason for admission');
        return false;
      } else if (this.patientRegistration.sourceOfReferral == null || this.patientRegistration.sourceOfReferral.replace(/\s/g, '').length == 0) {
        alert('Please enter source of referral');
        return false;
      } else if (this.patientRegistration.locationId == null) {
        alert('Please select location');
        return false;
      } else if (this.selectedItems.length <= 0) {
        alert('Please select Care co-ordinator');
        return false;
      } else if (this.patientRegistration.status == AdmissionStatus.Closed && this.patientRegistration.dateOfLeaving == null) {
        alert('Please select date of leaving');
      } else if (this.patientRegistration.status == AdmissionStatus.Closed && (admissionDate > leavingDate)) {
        alert('Please select proper date of leaving');
      }
      // else if (this.patientRegistration.patientDocuments) {
      //   let no: number;
      //   this.patientRegistration.patientDocuments.forEach((element, index) => {
      //     no = index + 1;
      //     if (!element.fileAsBase64 && element.documentLocation == null) {
      //       alert('Please select document or remove sno. ' + no);
      //       flag = false;
      //     }
      //   });
      //   if (flag) {
      //     this.onTabChange(index);
      //   }
      // }

      else {
        this.onTabChange(index);
      }
    } else if (tab == 0) {
      if (this.patientRegistration.title == null) {
        alert('Please select title');
        return false;
      } else if (this.patientRegistration.firstName == null || this.patientRegistration.firstName.replace(/\s/g, '').length == 0) {
        alert('Please enter first name');
        return false;
      } else if (this.patientRegistration.lastName == null || this.patientRegistration.lastName.replace(/\s/g, '').length == 0) {
        alert('Please enter last name');
        return false;
      } else if (this.patientRegistration.serviceUserNumber == null || this.patientRegistration.serviceUserNumber.replace(/\s/g, '').length == 0) {
        alert('Please enter service user number');
        return false;
      } else if (this.patientRegistration.address1 == null || this.patientRegistration.address1.replace(/\s/g, '').length == 0) {
        alert('Please enter address1');
        return false;
        // } else if (this.patientRegistration.address2 == null || this.patientRegistration.address2.replace(/\s/g, "").length == 0) {
        //   alert("Please enter address2");
        //   return false;
      } else if (this.patientRegistration.postCode == null) {
        alert('Please enter postCode');
        return false;
      } else if (this.patientRegistration.dob == null) {
        alert('Please select date of birth');
      } else if (this.patientRegistration.gender == null) {
        alert('Please select gender');
        return false;
      } else if (this.patientRegistration.ethnicOrigin == null) {
        alert('Please select ethnicOrigin');
        return false;
      } else if (this.patientRegistration.weight == null) {
        alert('Please select weight');
        return false;
      } else if (this.patientRegistration.height == null) {
        alert('Please select height');
        return false;
      } else if (this.patientRegistration.nhsNumber == null || this.patientRegistration.nhsNumber.replace(/\s/g, '').length == 0) {
        alert('Please enter NHS Number');
        return false;
      } else if (this.patientRegistration.telePhone == null || this.patientRegistration.telePhone.replace(/\s/g, '').length == 0) {
        alert('Please enter Telephone');
        return false;
      } else if (this.patientRegistration.niNumber == null || this.patientRegistration.niNumber.replace(/\s/g, '').length == 0) {
        alert('Please enter NI Number');
        return false;
      } else {
        this.onTabChange(index);
      }
    } else if (tab == 3) {
      if (this.patientRegistration.kinName == null || this.patientRegistration.kinName.replace(/\s/g, '').length == 0) {
        alert('Please enter nearest Kin name');
      } else if (this.patientRegistration.kinContact == null || this.patientRegistration.kinContact.replace(/\s/g, '').length == 0) {
        alert('Please enter kin contact');
      } else if (this.patientRegistration.nearestRelative == null || this.patientRegistration.nearestRelative.replace(/\s/g, '').length == 0) {
        alert('Please enter nearest relative');
      } else if (this.patientRegistration.emergencyContact == null || this.patientRegistration.emergencyContact.replace(/\s/g, '').length == 0) {
        alert('Please enter emergency contact');
      } else if (this.patientRegistration.patientDependents) {
        let no: number;
        this.patientRegistration.patientDependents.forEach((element, index) => {
          no = index + 1;
          if (element.dependentName == null ||
            element.dependentName.replace(/\s/g, '').length == 0
          ) {
            alert('Please enter dependent name');
            flag = false;
          }
        });
        if (flag) {
          this.onTabChange(index);
        }
      } else {
        this.onTabChange(index);
      }
    } else if (tab == 4) {
      if (this.patientRegistration.gpSurgeryName == null || this.patientRegistration.gpSurgeryName.replace(/\s/g, '').length == 0) {
        alert('Please enter gpsurgery name');

        return false;
      } else if (this.patientRegistration.gpContactNo == null || this.patientRegistration.gpContactNo.replace(/\s/g, '').length == 0) {
        alert('Please enter gpcontact number');
        return false;
      } else if (this.patientRegistration.allergies == null || this.patientRegistration.allergies.replace(/\s/g, '').length == 0) {
        alert('Please enter allergies');
        return false;
      } else {
        this.onTabChange(index);
      }
    } else {
      this.onTabChange(index);
    }
  }

  // public validate(tab) {
  //   tab -= 1;
  //   if (tab == 2) {
  //     if (this.patientRegistration.dateOfAdmission == null || this.patientRegistration.reasonForAdmission == null || this.patientRegistration.reasonForAdmission.replace(/\s/g, "").length == 0 || this.patientRegistration.sourceOfReferral == null || this.patientRegistration.sourceOfReferral.replace(/\s/g, "").length == 0) {
  //       return false;
  //     }
  //     else if (this.patientRegistration.locationId == null || this.patientRegistration.status == null) {
  //       return false;
  //     }
  //     else if (this.patientRegistration.patientDocuments) {
  //       let flag = true;
  //       this.patientRegistration.patientDocuments.forEach((element, index) => {
  //         if (!element.fileAsBase64) {
  //           alert('Please select document or remove row no ' + index + 1);
  //           flag = false;
  //         }
  //       });
  //       return flag;
  //     }
  //     else {
  //       return true;
  //     }
  //   }
  //   else if (tab == 0) {
  //     if (this.patientRegistration.title == null || this.patientRegistration.firstName == null || this.patientRegistration.firstName.replace(/\s/g, "").length == 0 || this.patientRegistration.lastName == null || this.patientRegistration.lastName.replace(/\s/g, "").length == 0) {
  //       return false;
  //     }
  //     else if (this.patientRegistration.address1 == null || this.patientRegistration.address1.replace(/\s/g, "").length == 0 || this.patientRegistration.address2 == null || this.patientRegistration.address2.replace(/\s/g, "").length == 0 || this.patientRegistration.postCode == null || this.patientRegistration.dob == null) {
  //       return false;
  //     } else if (this.patientRegistration.gender == null || this.patientRegistration.ethnicOrigin == null || this.patientRegistration.weight == null || this.patientRegistration.height == null) {
  //       return false;
  //     }
  //     else if (this.patientRegistration.niNumber == null || this.patientRegistration.nhsNumber == null || this.patientRegistration.dwpNumber.replace(/\s/g, "").length == 0 || this.patientRegistration.telePhone == null) {
  //       return false;
  //     } else {
  //       return true;
  //     }

  //   }
  //   else if (tab == 3) {
  //     if (this.patientRegistration.kinName == null || this.patientRegistration.kinName.replace(/\s/g, "").length == 0 || this.patientRegistration.nearestRelative == null || this.patientRegistration.nearestRelative.replace(/\s/g, "").length == 0 || this.patientRegistration.emergencyContact == null || this.patientRegistration.emergencyContact.replace(/\s/g, "").length == 0) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   }
  //   else if (tab == 4) {
  //     if (this.patientRegistration.gpSurgeryName == null || this.patientRegistration.gpSurgeryName.replace(/\s/g, "").length == 0 || this.patientRegistration.gpContactNo == null || this.patientRegistration.gpContactNo.replace(/\s/g, "").length == 0 || this.patientRegistration.allergies == null || this.patientRegistration.allergies.replace(/\s/g, "").length == 0) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   }
  //   else {
  //     return true;
  //   }
  // }

  public addDependents() {
    if (this.patientRegistration.patientDependents.length >= 3) {
      alert("Dependents can't be more then three");
    } else {
      this.patientRegistration.patientDependents.push(
        this.patientDependentsObject
      );
      this.patientDependentsObject = new PatientDependents();
    }
  }

  public remove(index) {
    this.patientRegistration.patientDependents.splice(index, 1);
  }

  public addDocuments() {
    this.patientRegistration.patientDocuments.push(this.patientDocumentObject);
    this.patientDocumentObject = new PatientDependents();
  }

  public removeDocument(index: number) {
    this.patientRegistration.patientDocuments.splice(index, 1);
  }

  public ageCalculator() {
    if (this.patientRegistration.dob) {
      const convertAge = new Date(this.patientRegistration.dob);
      const currentDate = new Date();
      if (convertAge > currentDate) {
        alert('select proper date of Birth');
        return (this.patientRegistration.dob = null);
      }
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      this.patientRegistration.age = Math.floor(
        timeDiff / (1000 * 3600 * 24) / 365
      );
    }
  }

  public copyAddressKin(event) {
    if (event) {
      this.patientRegistration.kinAddress1 = this.patientRegistration.address1;
      this.patientRegistration.kinAddress2 = this.patientRegistration.address2;
      this.patientRegistration.kinAddress3 = this.patientRegistration.address3;
      this.patientRegistration.kinAddress4 = this.patientRegistration.address4;
      this.patientRegistration.kinAddress5 = this.patientRegistration.postCode;
    } else {
      this.patientRegistration.kinAddress1 = null;
      this.patientRegistration.kinAddress2 = null;
      this.patientRegistration.kinAddress3 = null;
      this.patientRegistration.kinAddress4 = null;
      this.patientRegistration.kinAddress5 = null;
    }
  }

  public copyAddressDependent(event, index) {
    if (event) {
      this.patientRegistration.patientDependents[index].address1 =
        this.patientRegistration.address1;
      this.patientRegistration.patientDependents[index].address2 =
        this.patientRegistration.address2;
      this.patientRegistration.patientDependents[index].address3 =
        this.patientRegistration.address3;
      this.patientRegistration.patientDependents[index].address4 =
        this.patientRegistration.address4;
      this.patientRegistration.patientDependents[index].address5 =
        this.patientRegistration.postCode;
    } else {
      this.patientRegistration.patientDependents[index].address1 = null;
      this.patientRegistration.patientDependents[index].address2 = null;
      this.patientRegistration.patientDependents[index].address3 = null;
      this.patientRegistration.patientDependents[index].address4 = null;
      this.patientRegistration.patientDependents[index].address5 = null;
    }
  }

  public selectFile(event, document: PatientDocuments) {
    if (event.target && event.target.files.length > 0) {
      let file = event.target.files[0];
      if (file && (event.target.files[0].type.match('application/pdf') || event.target.files[0].type.match('application/msword'))) {
        this.file = file;
        //method to send the file path
        // console.log(event.target.files[0]);
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event: any) => {
          document.fileName = this.file.name;
          document.fileAsBase64 = event.target.result;
        };
      } else {
        alert('support only .PDF and .docs files');
        return false;
      }
    }
  }

  public deleteDocument(index) {
    if (confirm('Are you sure you want to delete this?')) {
      // this.patientDocumentService.deletePatientDocument(documentId).subscribe(
      //   (response) => {
      //     if (response) {
      this.patientRegistration.patientDocuments.splice(index, 1);
      //     }
      //   },
      //   (error) => {
      //     alert(error.error);
      //   }
      // );
    }
  }

  public showObservationDuration() {
    if (this.patientRegistration.isObservation == 'true') {
      this.isObservation = true;
      this.patientRegistration.observationDuration == '15 mins';
    } else {
      this.isObservation = false;
      this.patientRegistration.observationDuration == null;
    }
  }

  public getServiceUsers() {
    if (this.isReload) {
      // location.reload();
      this.router.navigate([Constants.routes.dashboard()]);
    } else
      this.router.navigate([Constants.routes.serviceUserOverview()]);
  }
}
