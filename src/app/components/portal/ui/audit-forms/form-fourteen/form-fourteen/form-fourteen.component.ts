import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormFourteenService } from 'src/app/services/form-fourteen.service';
import { LocationServices } from 'src/app/services/location.service';
import { PatientService } from 'src/app/services/patient.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { RiskEntry } from 'src/app/shared/enums/risk-entry.enum';
import { AuditFormFourteen } from 'src/app/shared/models/audit-form-fourteen';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/util/Constants';

@Component({
  selector: 'app-form-fourteen',
  templateUrl: './form-fourteen.component.html',
  styleUrls: ['./form-fourteen.component.scss'],
})
export class FormFourteenComponent extends BaseComponent implements OnInit {
  @Output() getForms: EventEmitter<any> = new EventEmitter<any>();

  public locationList: Array<Location> = [];
  public userList: Array<User> = [];
  public auditForm: FormGroup;
  public isEdit: boolean = false;
  public isFilling: boolean = false;
  public createForm: boolean = false;
  public riskEntry = RiskEntry;
  public patientsList = [];

  constructor(
    private locationService: LocationServices,
    private userService: UserService,
    private formfourteenService: FormFourteenService,
    private fb: FormBuilder,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router

  ) {
    super();
  }

  ngOnInit(): void {
    this.getLocations();
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.getFormFourteen(this.route.snapshot.params['id']);
    } else {
      this.auditForm = this.fb.group({
        id: [0],
        auditDate: [null],
        auditedBy: [null, Validators.required],
        // patientId: [null, Validators.required],
        allCounterSignature: [RiskEntry.Yes, Validators.required],
        administeredCounterSignature: [RiskEntry.Yes, Validators.required],
        controlledDrugExpiryDate: [RiskEntry.Yes, Validators.required],
        emergencyDrugExpiryDate: [RiskEntry.Yes, Validators.required],
        emergencyDrugRecording: [RiskEntry.Yes, Validators.required],
        isRoomClean: [RiskEntry.Yes, Validators.required],
        isCupboardsClean: [RiskEntry.Yes, Validators.required],
        roomTemperatureMaintained: [RiskEntry.Yes, Validators.required],
        isClinicalFridgeClean: [RiskEntry.Yes, Validators.required],
        clinicalFridgeTemperatureMaintained: [RiskEntry.Yes, Validators.required],
        wasteBagsAvailable: [RiskEntry.Yes, Validators.required],
        sharpBoxAvailable: [RiskEntry.Yes, Validators.required],
        updatedBNFAvailable: [RiskEntry.Yes, Validators.required],
        updatedDrugAlert: [RiskEntry.Yes, Validators.required],
        updatedSignatoryList: [RiskEntry.Yes, Validators.required],
        signoffBy: [null],
        isSignedOff: [false],
        locationId: [null, Validators.required],
        careHomeId: [careHomeId],
        createdBy: [this.currentUserId],
        createdAt: [new Date().toISOString()]
      });
      this.completeForm();
    }

  }

  public completeForm(event?: any) {

    if (this.auditForm.controls['auditedBy'].value == this.currentUserId) {
      // user going to fill form
      this.isFilling = true;
      if (this.currentUserRole == this.userType.SuperUser || this.currentUserRole == this.userType.Admin) {
        this.auditForm.controls['signoffBy'].disable(); //disable sign off by and set current user id
        this.auditForm.controls['signoffBy'].setValue(this.currentUserId);
        this.auditForm.controls['isSignedOff'].setValue(true);
        this.auditForm.controls['auditDate'].setValue(new Date().toISOString());
      } else {
        this.auditForm.controls['auditDate'].setValue(new Date().toISOString());
      }
      this.setValidation();
    } else if (this.currentUserId == this.auditForm.controls['signoffBy'].value && this.isEdit) {
      if (event) {
        // this.auditForm.controls['auditedBy'].setValue(this.previousAuditor);
        this.isFilling = false;
        this.auditForm.controls['auditDate'].setValue(null);
        this.auditForm.controls['signoffBy'].setValue(null);
        this.auditForm.controls['isSignedOff'].setValue(false);
        this.auditForm.controls['signoffBy'].disable();
        this.removeValidation();
      } else {
        this.isFilling = true;
        this.auditForm.controls['isSignedOff'].setValue(true);
        this.auditForm.controls['signoffBy'].disable();
        this.setValidation();
      }
    } else {
      this.isFilling = false;
      this.auditForm.controls['auditDate'].setValue(null);
      this.auditForm.controls['signoffBy'].setValue(null);
      this.auditForm.controls['isSignedOff'].setValue(false);
      this.auditForm.controls['signoffBy'].disable();
      this.removeValidation();
    }
  }

  public onSubmit() {
    this.SetLoading(true);
    if (this.currentUserId == this.auditForm.controls['auditedBy'].value || this.currentUserRole == this.userType.SuperUser || this.currentUserRole == this.userType.Admin) {
      if (Number(this.currentUserId) == Number(this.auditForm.controls['signoffBy'].value)) {
        this.auditForm.controls['isSignedOff'].setValue(true);
        this.auditForm.controls['signoffBy'].enable();
        if (this.createForm) {
          let formFourteen = new AuditFormFourteen();
          formFourteen.auditDate = new Date(new Date(this.auditForm.controls['auditDate'].value).setMonth(new Date(this.auditForm.controls['auditDate'].value).getMonth() + 1));
          formFourteen.auditedBy = this.auditForm.controls['auditedBy'].value;
          formFourteen.locationId = this.auditForm.controls['locationId'].value;
          formFourteen.careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
          formFourteen.createdAt = new Date();
          formFourteen.createdBy = this.currentUserId;
          this.formfourteenService.addForm(formFourteen).subscribe();
        }
      }
      if (this.isEdit) {
        this.updateForm();
      } else {
        this.addForm();
      }
    }
  }

  public goBack() {
    // this.getForms.emit();
    if (this.route.snapshot.queryParams["fromDashboard"]) {
      this.router.navigate([Constants.routes.dashboard()]);
    }
    else
      window.history.back();
  }

  public changeSignoff() {
    if (
      this.currentUserRole == this.userType.SuperUser ||
      this.currentUserRole == this.userType.Admin
    ) {
      this.auditForm.controls['signoffBy'].setValue(this.currentUserId);
    }
  }



  private addForm() {
    this.SetLoading(true);
    this.formfourteenService.addForm(this.auditForm.value).subscribe(
      (response) => {
        if (response) {
          alert('Form submitted successfully');
          this.goBack();
        }
        this.SetLoading(false);
      },
      (err) => {
        this.SetLoading(false);
        alert(err.error);
      }
    );
  }

  private updateForm() {
    this.SetLoading(true);

    let message = 'Updated and saved successfully';
    if (this.auditForm.controls['signoffBy'].value == this.currentUserId) {
      // this.auditForm.controls['isSignedOff'].value(true);
      message = 'Updated and signed off successfully';
    }
    this.formfourteenService.updateForm(this.auditForm.value).subscribe(
      (response) => {
        if (response) {
          alert(message);
          this.goBack();
        }
        this.SetLoading(false);
      },
      (err) => {
        this.SetLoading(false);
        console.log(err.error);
      }
    );
  }

  private getLocations() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.locationService.getLocations(careHomeId).subscribe(
      (response) => {
        if (response.length > 0) {
          // this.locationList = response;
          if (this.currentUserRole != this.userType.Admin) {
            let locationIds = JSON.parse(localStorage.getItem('_identity')).locationIds;
            locationIds.forEach((element) => {
              this.locationList.push(response.filter((x) => x.id == element)[0]);
            });
          } else {
            this.locationList = response;
          }
        }
      },
      (err) => {
        console.error('could not fetch locations ::' + err.error);
      }
    );
  }

  public getUsers(locationId: number) {
    if (locationId) {
      this.SetLoading(true);
      let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
      this.userService.getByLocation(locationId,careHomeId).subscribe((response) => {
        if (response) {
          this.userList = response.filter((x) => x.userType != this.userType.Auditor);
        }
        this.SetLoading(false);
      },
        (err) => {
          this.SetLoading(false);
          console.error('could not fetch users::' + err.error);
        });
    }
  }


  private getFormFourteen(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formfourteenService.getForm(id).subscribe(
        (response) => {
          if (response) {
            this.getUsers(response.locationId);
            this.getPatients(response.locationId);
            this.setFormValue(response);
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
  private getPatients(locationId) {
    this.SetLoading(true);
    this.patientService.getPatients(locationId).subscribe(
      (response) => {
        if (response) {
          this.patientsList = Object.keys(response).map((key) => ({
            id: key,
            name: response[key],
          }));
        }
        this.SetLoading(false);
      },
      (error) => {
        alert(error.error);
        this.SetLoading(false);
      }
    );
  }

  private setValidation() {

    this.auditForm.controls['auditDate'].setValidators(Validators.required);
    this.auditForm.controls['auditDate'].updateValueAndValidity();
    this.auditForm.controls['signoffBy'].setValidators(Validators.required);
    this.auditForm.controls['signoffBy'].updateValueAndValidity();
    // this.auditForm.controls['patientId'].setValidators(Validators.required);
    // this.auditForm.controls['patientId'].updateValueAndValidity();
    // Controlled Drugs (CD
    this.auditForm.controls['allCounterSignature'].setValidators(Validators.required);
    this.auditForm.controls['allCounterSignature'].updateValueAndValidity();
    this.auditForm.controls['administeredCounterSignature'].setValidators(Validators.required);
    this.auditForm.controls['administeredCounterSignature'].updateValueAndValidity();
    this.auditForm.controls['controlledDrugExpiryDate'].setValidators(Validators.required);
    this.auditForm.controls['controlledDrugExpiryDate'].updateValueAndValidity();

    // Emergency Drugs
    this.auditForm.controls['emergencyDrugExpiryDate'].setValidators(Validators.required);
    this.auditForm.controls['emergencyDrugExpiryDate'].updateValueAndValidity();
    this.auditForm.controls['emergencyDrugRecording'].setValidators(Validators.required);
    this.auditForm.controls['emergencyDrugRecording'].updateValueAndValidity();

    // treatment/MedicationRoom(s)
    this.auditForm.controls['isRoomClean'].setValidators(Validators.required);
    this.auditForm.controls['isRoomClean'].updateValueAndValidity();
    this.auditForm.controls['isCupboardsClean'].setValidators(Validators.required);
    this.auditForm.controls['isCupboardsClean'].updateValueAndValidity();

    // Area Of Audit

    this.auditForm.controls['roomTemperatureMaintained'].setValidators(Validators.required);
    this.auditForm.controls['roomTemperatureMaintained'].updateValueAndValidity();
    this.auditForm.controls['isClinicalFridgeClean'].setValidators(Validators.required);
    this.auditForm.controls['isClinicalFridgeClean'].updateValueAndValidity();
    this.auditForm.controls['clinicalFridgeTemperatureMaintained'].setValidators(Validators.required);
    this.auditForm.controls['clinicalFridgeTemperatureMaintained'].updateValueAndValidity();
    this.auditForm.controls['wasteBagsAvailable'].setValidators(Validators.required);
    this.auditForm.controls['wasteBagsAvailable'].updateValueAndValidity();
    this.auditForm.controls['sharpBoxAvailable'].setValidators(Validators.required);
    this.auditForm.controls['sharpBoxAvailable'].updateValueAndValidity();
    this.auditForm.controls['updatedBNFAvailable'].setValidators(Validators.required);
    this.auditForm.controls['updatedBNFAvailable'].updateValueAndValidity();
    this.auditForm.controls['updatedDrugAlert'].setValidators(Validators.required);
    this.auditForm.controls['updatedDrugAlert'].updateValueAndValidity();
    this.auditForm.controls['updatedSignatoryList'].setValidators(Validators.required);
    this.auditForm.controls['updatedSignatoryList'].updateValueAndValidity();
  }

  private removeValidation() {
    this.auditForm.controls['auditDate'].clearValidators();
    this.auditForm.controls['auditDate'].updateValueAndValidity();
    this.auditForm.controls['signoffBy'].clearValidators();
    this.auditForm.controls['signoffBy'].updateValueAndValidity();
    // this.auditForm.controls['patientId'].clearValidators();
    // this.auditForm.controls['patientId'].updateValueAndValidity();
    // Controlled Drugs (CD
    this.auditForm.controls['allCounterSignature'].clearValidators();
    this.auditForm.controls['allCounterSignature'].updateValueAndValidity();
    this.auditForm.controls['administeredCounterSignature'].clearValidators();
    this.auditForm.controls['administeredCounterSignature'].updateValueAndValidity();
    this.auditForm.controls['controlledDrugExpiryDate'].clearValidators();
    this.auditForm.controls['controlledDrugExpiryDate'].updateValueAndValidity();

    // Emergency Drugs
    this.auditForm.controls['emergencyDrugExpiryDate'].clearValidators();
    this.auditForm.controls['emergencyDrugExpiryDate'].updateValueAndValidity();
    this.auditForm.controls['emergencyDrugRecording'].clearValidators();
    this.auditForm.controls['emergencyDrugRecording'].updateValueAndValidity();

    // treatment/MedicationRoom(s)
    this.auditForm.controls['isRoomClean'].clearValidators();
    this.auditForm.controls['isRoomClean'].updateValueAndValidity();
    this.auditForm.controls['isCupboardsClean'].clearValidators();
    this.auditForm.controls['isCupboardsClean'].updateValueAndValidity();

    // Area Of Audit

    this.auditForm.controls['roomTemperatureMaintained'].clearValidators();
    this.auditForm.controls['roomTemperatureMaintained'].updateValueAndValidity();
    this.auditForm.controls['isClinicalFridgeClean'].clearValidators();
    this.auditForm.controls['isClinicalFridgeClean'].updateValueAndValidity();
    this.auditForm.controls['clinicalFridgeTemperatureMaintained'].clearValidators();
    this.auditForm.controls['clinicalFridgeTemperatureMaintained'].updateValueAndValidity();
    this.auditForm.controls['wasteBagsAvailable'].clearValidators();
    this.auditForm.controls['wasteBagsAvailable'].updateValueAndValidity();
    this.auditForm.controls['sharpBoxAvailable'].clearValidators();
    this.auditForm.controls['sharpBoxAvailable'].updateValueAndValidity();
    this.auditForm.controls['updatedBNFAvailable'].clearValidators();
    this.auditForm.controls['updatedBNFAvailable'].updateValueAndValidity();
    this.auditForm.controls['updatedDrugAlert'].clearValidators();
    this.auditForm.controls['updatedDrugAlert'].updateValueAndValidity();
    this.auditForm.controls['updatedSignatoryList'].clearValidators();
    this.auditForm.controls['updatedSignatoryList'].updateValueAndValidity();
  }

  private setFormValue(formFourteenValue: AuditFormFourteen) {
    this.auditForm = this.fb.group({
      id: [formFourteenValue.id],
      auditDate: [formFourteenValue.auditDate],
      auditedBy: [formFourteenValue.auditedBy, Validators.required],
      signoffBy: [formFourteenValue.signoffBy],
      // patientId: [formFourteenValue.patientId],
      isSignedOff: [formFourteenValue.isSignedOff],

      allCounterSignature: [formFourteenValue.allCounterSignature, Validators.required],
      administeredCounterSignature: [formFourteenValue.administeredCounterSignature, Validators.required],
      controlledDrugExpiryDate: [formFourteenValue.controlledDrugExpiryDate, Validators.required],
      emergencyDrugExpiryDate: [formFourteenValue.emergencyDrugExpiryDate, Validators.required],
      emergencyDrugRecording: [formFourteenValue.emergencyDrugRecording, Validators.required],
      isRoomClean: [formFourteenValue.isRoomClean, Validators.required],
      isCupboardsClean: [formFourteenValue.isCupboardsClean, Validators.required],
      roomTemperatureMaintained: [formFourteenValue.roomTemperatureMaintained, Validators.required],
      isClinicalFridgeClean: [formFourteenValue.isClinicalFridgeClean, Validators.required],
      clinicalFridgeTemperatureMaintained: [formFourteenValue.clinicalFridgeTemperatureMaintained, Validators.required],
      wasteBagsAvailable: [formFourteenValue.wasteBagsAvailable, Validators.required],
      sharpBoxAvailable: [formFourteenValue.sharpBoxAvailable, Validators.required],
      updatedBNFAvailable: [formFourteenValue.updatedBNFAvailable, Validators.required],
      updatedDrugAlert: [formFourteenValue.updatedDrugAlert, Validators.required],
      updatedSignatoryList: [formFourteenValue.updatedSignatoryList, Validators.required],


      locationId: [formFourteenValue.locationId, Validators.required],
      careHomeId: [formFourteenValue.careHomeId],
      createdBy: [formFourteenValue.createdBy],
      createdAt: [formFourteenValue.createdAt],
      updatedBy: [formFourteenValue.createdBy],
    });
    this.completeForm();

  }

}
