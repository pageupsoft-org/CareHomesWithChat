import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { UserType } from 'src/app/shared/enums/user-type.enum';
import { Location } from 'src/app/shared/models/location';
import { RiskEntry } from 'src/app/shared/enums/risk-entry.enum';
import { User } from 'src/app/shared/models/user';
import { FormFifteenService } from 'src/app/services/form-fifteen.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { MedicationSpotCheck } from 'src/app/shared/models/medication-spot-check';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { Constants } from 'src/app/util/Constants';

@Component({
  selector: 'app-form-fifteen',
  templateUrl: './form-fifteen.component.html',
  styleUrls: ['./form-fifteen.component.scss'],
})
export class FormFifteenComponent extends BaseComponent implements OnInit {
  @Input() serviceUserData: PatientAdmission;
  @Input() medicationSpotCheck: MedicationSpotCheck;
  @Input() isReload: boolean;
  @Output() getForms: EventEmitter<any> = new EventEmitter<any>();

  public locationList: Array<Location> = [];
  public userList: Array<User> = [];
  public riskAction = RiskEntry;
  public formFifteen: FormGroup;
  public isFilling: boolean = false;
  public isEdit: boolean = false;
  public createForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationServices,
    private userService: UserService,
    private formFifteenService: FormFifteenService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    if (!this.serviceUserData) {
      return;
    }

    this.getLocations();
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    if (this.medicationSpotCheck) {
      this.getForm15(this.medicationSpotCheck.id);
    } else {
      this.formFifteen = this.fb.group({
        id: [0],
        patientId: [this.serviceUserData.id],
        auditedBy: [this.serviceUserData.careCoordinators[0]['careCoordinatorId'],Validators.required],
        auditDate: [null],
        signoffBy: [null],
        isSignedOff: [false],
        locationId: [this.serviceUserData.locationId],
        careHomeId: [careHomeId],
        createdBy: [this.currentUserId],
        createdAt: [new Date()],
        form15Records: this.fb.array([this.addRecord()]),
      });
      this.getUsers(this.formFifteen.controls['locationId'].value);

      this.completeForm();
    }
  }

  public completeForm(event?: any) {
    if (this.formFifteen.controls['auditedBy'].value == this.currentUserId) {
      this.isFilling = true;
      if (this.currentUserRole == UserType.SuperUser || this.currentUserRole == UserType.Admin) {
        this.formFifteen.controls['signoffBy'].setValue(this.currentUserId);
        this.formFifteen.controls['signoffBy'].disable();
        this.formFifteen.controls['isSignedOff'].setValue(true);
        this.formFifteen.controls['auditDate'].setValue(new Date().toISOString());
      } else {
        this.formFifteen.controls['auditDate'].setValue(new Date().toISOString());
      }
      this.setValidation();
    } else if (this.currentUserId == this.formFifteen.controls['signoffBy'].value && this.isEdit) {
      if (event) {
        // this.formFifteen.controls['auditedBy'].setValue(this.previousAuditor);
        this.isFilling = false;
        this.formFifteen.controls['auditDate'].setValue(null);
        this.formFifteen.controls['signoffBy'].setValue(null);
        this.formFifteen.controls['isSignedOff'].setValue(false);
        this.formFifteen.controls['signoffBy'].disable();
       
        this.removeValidation();
      } else {
        this.isFilling = true;
        this.formFifteen.controls['isSignedOff'].setValue(true);
        this.formFifteen.controls['signoffBy'].disable();
        this.setValidation();
      }
    } else {
      this.isFilling = false;
      this.formFifteen.controls['auditDate'].setValue(null);
      this.formFifteen.controls['signoffBy'].setValue(null);
      this.formFifteen.controls['isSignedOff'].setValue(false);
      this.formFifteen.controls['signoffBy'].disable();
      this.removeValidation();
      
    }
  }

  // public checkCompletedBy() {
  //   if (this.formFifteen.controls['auditedBy'].value != this.currentUserId) {
  //     this.formFifteen.controls['signoffBy'].setValue(null);
  //   }
  //   this.completeForm()
  // }

  public addRecordButtonClick(records?: any): void {
    if (records) {
      (<FormArray>this.formFifteen.get('form15Records')).push(
        this.addRecord(records)
      );
    } else {
      (<FormArray>this.formFifteen.get('form15Records')).push(this.addRecord());
    }
  }

  public remove(i: number) {
    (<FormArray>this.formFifteen.get('form15Records')).removeAt(i);
    if (this.formFifteen.controls['auditedBy'].value == this.currentUserId ||this.currentUserId == this.formFifteen.controls['signoffBy'].value) {
      if ((<FormArray>this.formFifteen.get('form15Records')).length == 0) {
        this.addRecordButtonClick();
      }
    }
  }

  public setTime(index: number) {
    let time = (<FormArray>this.formFifteen.get('form15Records')).at(index)['controls']['recordDateTime1'].value;
    let date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    time = formatDate(date + 'T' + time, 'yyyy-MM-ddTHH:mm:ss', 'en');
    let newTime = new Date(time).toISOString();
    (<FormArray>this.formFifteen.get('form15Records')).at(index)['controls']['recordDateTime1'].setValue(newTime);
  }

  public setTime2(index: number) {
    let time = (<FormArray>this.formFifteen.get('form15Records')).at(index)['controls']['recordDateTime2'].value;
    let date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    time = formatDate(date + 'T' + time, 'yyyy-MM-ddTHH:mm:ss', 'en');
    let newTime = new Date(time).toISOString();
  
    (<FormArray>this.formFifteen.get('form15Records'))
      .at(index)
    ['controls']['recordDateTime2'].setValue(newTime);
  }

  public onSubmit() {
    this.SetLoading(true);
    if (this.currentUserId == this.formFifteen.controls['auditedBy'].value || this.currentUserRole == UserType.SuperUser || this.currentUserRole == UserType.Admin) {
      if (Number(this.currentUserId) == Number(this.formFifteen.controls['signoffBy'].value)) {
        this.formFifteen.controls['signoffBy'].enable();
        this.formFifteen.controls['isSignedOff'].setValue(true);
        if (this.createForm) {
          let medicationSpotForm = new MedicationSpotCheck();
          medicationSpotForm.patientId = this.serviceUserData.id;
          medicationSpotForm.auditDate = new Date(new Date(this.formFifteen.controls['auditDate'].value).getTime() + 7 * 24 * 60 * 60 * 1000);

          medicationSpotForm.auditedBy = this.formFifteen.controls['auditedBy'].value;
          medicationSpotForm.locationId = this.serviceUserData.locationId;
          medicationSpotForm.careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
          medicationSpotForm.createdAt = new Date();
          medicationSpotForm.createdBy = this.currentUserId;
          this.formFifteenService.addForm(medicationSpotForm).subscribe();
        }
      }
      if ((<FormArray>this.formFifteen.get('form15Records')).length > 0) {
        this.formFifteen.get('form15Records').value.forEach((element, index) => {
          this.setTime(index);
          this.setTime2(index);
        });
      }

      if (this.isEdit) {

        this.updateForm();
      } else {
        this.addForm();
      }
    }
  }

  public goBack() {
    if (this.isReload) {
      // location.reload();
      this.router.navigate([Constants.routes.dashboard()]);

    } else
      this.getForms.emit();
  }

  public changeSignoff() {
    if (this.currentUserRole == UserType.SuperUser || this.currentUserRole == UserType.Admin) {
      this.formFifteen.controls['signoffBy'].setValue(this.currentUserId);
    }
  }

  private addRecord(records?: any): FormGroup {
    if (records) {
      return this.fb.group({
        id: [records.id],
        recordDateTime1: [formatDate(records.recordDateTime1 + 'Z', 'hh:mm', 'en', 'local'), Validators.required],
        action1: [records.action1, Validators.required],
        recordDateTime2: [formatDate(records.recordDateTime2 + 'Z', 'hh:mm', 'en', 'local'), Validators.required],
        action2: [records.action2, Validators.required],
      });
    } else {
      return this.fb.group({
        id: [0],
        recordDateTime1: [null, Validators.required],
        action1: [true, Validators.required],
        recordDateTime2: [null, Validators.required],
        action2: [true, Validators.required],
      });
    }
  }

  private addForm() {
    this.SetLoading(true);
    this.formFifteenService.addForm(this.formFifteen.value).subscribe(
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
    if (this.formFifteen.controls['signoffBy'].value == this.currentUserId) {
      // this.formFifteen.controls['isSignedOff'].value(true);
      message = 'Updated and signed off successfully';
    }

    this.formFifteenService.updateForm(this.formFifteen.value).subscribe(
      (response) => {
        if (response) {
          alert(message);
          this.goBack();
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
      (err) => {
        console.error('could not fetch locations ::' + err.error);
      }
    );
  }

  private getUsers(locationId) {
    if (locationId) {
      let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
      this.userService.getByLocation(locationId, careHomeId).subscribe((response) => {
        if (response) {
          this.userList = response.filter((x) => x.userType != UserType.Auditor);
        }
      },
        (err) => {
          console.error('could not fetch users::' + err.error);
        });
    }
  }

  private getForm15(medicationId: number) {
    if (medicationId) {
      this.SetLoading(true);
      this.formFifteenService.getForm(medicationId).subscribe((response) => {
        if (response) {
          this.setValues(response);
        }
        this.SetLoading(false);
      },
        (err) => {
          this.SetLoading(false);
          console.error('could not fetch users::' + err.error);
        });
    }

  }

  private setValues(data) {
    this.isEdit = true;
    if (data) {
      this.formFifteen = this.fb.group({
        id: [data.id],
        patientId: [data.patientId],
        auditedBy: [data.auditedBy, Validators.required],
        auditDate: [data.auditDate ? formatDate(data.auditDate, 'yyyy-MM-dd', 'en') : null,],
        signoffBy: [data.signoffBy],
        isSignedOff: [data.isSignedOff],
        locationId: [data.locationId],
        careHomeId: [data.careHomeId],
        createdBy: [data.createdBy],
        createdAt: [
          data.createdAt
            ? formatDate(data.createdAt, 'yyyy-MM-dd', 'en')
            : null,
        ],
        updateBy: [this.currentUserId],
        updateAt: [new Date().toISOString()],
        form15Records: this.fb.array([]),
      });
      if (data.form15Records && data.form15Records.length > 0) {
        data.form15Records.forEach((element) => {
          this.addRecordButtonClick(element);
        });
      } else {
        this.addRecordButtonClick();
      }
      this.getUsers(this.formFifteen.controls['locationId'].value);

    }
    this.completeForm();
  }


  private setValidation() {
    this.formFifteen.controls['auditDate'].setValidators(Validators.required);
    this.formFifteen.controls['auditDate'].updateValueAndValidity();
    this.formFifteen.controls['signoffBy'].setValidators(Validators.required);
    this.formFifteen.controls['signoffBy'].updateValueAndValidity();
    if ((<FormArray>this.formFifteen.get('form15Records')).length == 0) {
      this.addRecordButtonClick();
    }
  }

  private removeValidation() {
    this.formFifteen.controls['auditDate'].clearValidators();
    this.formFifteen.controls['auditDate'].updateValueAndValidity();
    this.formFifteen.controls['signoffBy'].clearValidators();
    this.formFifteen.controls['signoffBy'].updateValueAndValidity();
    (<FormArray>this.formFifteen.get('form15Records')).clear();
  }
}
