import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { UserType } from 'src/app/shared/enums/user-type.enum';
import { Location } from 'src/app/shared/models/location';
import { RiskEntry } from 'src/app/shared/enums/risk-entry.enum';
import { User } from 'src/app/shared/models/user';
import { MedicationAuditForm } from 'src/app/shared/forms/medication-audit-form';
import { MedicationAudit } from 'src/app/shared/models/medication-audit';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { FormThirteenService } from 'src/app/services/form-thirteen.service';
import { Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Constants } from 'src/app/util/Constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-thirteen',
  templateUrl: './form-thirteen.component.html',
  styleUrls: ['./form-thirteen.component.scss'],
})
export class FormThirteenComponent extends BaseComponent implements OnInit {
  @Input() medicationAudit: MedicationAudit;
  @Input() serviceUserData: PatientAdmission;
  @Input() isReload: boolean;
  @Output() showFormsThirteen: EventEmitter<any> = new EventEmitter<any>();

  public locationList: Array<Location> = [];
  public userList: Array<User> = [];
  public riskAction = RiskEntry;
  public medicationAuditForm: MedicationAuditForm;
  public isEdit: boolean = false;
  public isFilling = false;
  public createFrom: boolean = false;

  constructor(
    private locationService: LocationServices,
    private userService: UserService,
    private formThirteenService: FormThirteenService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.getLocations();
    if (!this.serviceUserData) {
      return;
    }
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    if (this.medicationAudit) {
      this.isEdit = true;
      this.medicationAuditForm = new MedicationAuditForm(this.medicationAudit);
      this.medicationAuditForm.updatedBy.setValue(this.currentUserId);
      this.medicationAuditForm.updatedAt = new Date();
      this.completeForm();

      this.getUsers(this.medicationAuditForm.controls['locationId'].value);

      if (this.currentUserId == this.medicationAuditForm.auditedBy.value) {
        this.medicationAuditForm.auditDate.setValue(new Date());
        this.medicationAuditForm.signoffBy.setValidators([Validators.required]);
      }
    } else {
      this.isEdit = false;
      this.medicationAuditForm = new MedicationAuditForm();
      this.medicationAuditForm.patientId.setValue(this.serviceUserData.id);
      this.medicationAuditForm.locationId.setValue(this.serviceUserData.locationId);
      this.medicationAuditForm.careHomeId.setValue(careHomeId);
      this.medicationAuditForm.createdBy.setValue(this.currentUserId);
      this.medicationAuditForm.auditedBy.setValue(this.serviceUserData.careCoordinators[0]['careCoordinatorId']);
      this.medicationAuditForm.auditDate.setValue(null);
      this.medicationAuditForm.createdAt = new Date();
      this.medicationAuditForm.signoffBy.disable();
      // if (this.currentUserId == this.medicationAuditForm.auditedBy.value) {
      //   this.medicationAuditForm.signoffBy.setValue(this.currentUserId);
      // }
      this.completeForm();
      this.getUsers(this.medicationAuditForm.controls['locationId'].value);
    }
  }

  public completeForm(event?: any) {
    if (this.currentUserId == this.medicationAuditForm.auditedBy.value) {
      this.isFilling = true;
      if (this.currentUserRole == UserType.SuperUser || this.currentUserRole == UserType.Admin) {
        this.medicationAuditForm.signoffBy.setValue(this.currentUserId);
        this.medicationAuditForm.signoffBy.disable();
        this.medicationAuditForm.isSignedOff = true;
        this.medicationAuditForm.auditDate.setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
      } else {
        this.medicationAuditForm.auditDate.setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
      }
      this.setValidation();
    } else if (this.currentUserId == this.medicationAuditForm.signoffBy.value && this.isEdit) {
      if (event) {
        // this.auditForm.controls['auditedBy'].setValue(this.previousAuditor);
        this.isFilling = false;
        this.medicationAuditForm.controls['auditDate'].setValue(null);
        this.medicationAuditForm.controls['signoffBy'].setValue(null);
        this.medicationAuditForm.isSignedOff= false;
        this.medicationAuditForm.controls['signoffBy'].disable();
        this.removeValidation();
      } else {
        this.isFilling = true;
        this.medicationAuditForm.isSignedOff = true;
        this.medicationAuditForm.signoffBy.disable();
        this.setValidation();
      }
    } else {
      this.isFilling = false;
      this.medicationAuditForm.auditDate.setValue(null);
      this.medicationAuditForm.signoffBy.setValue(null);
      this.medicationAuditForm.isSignedOff = false;
      this.medicationAuditForm.signoffBy.disable();

      this.removeValidation();
    }
  }

  public onSubmit() {
    // return;
    if (this.currentUserId == this.medicationAuditForm.auditedBy.value ||this.currentUserRole == UserType.SuperUser ||this.currentUserRole == UserType.Admin) {
      if (this.currentUserId == this.medicationAuditForm.signoffBy.value) {
        this.medicationAuditForm.isSignedOff = true;
        if (this.createFrom) {
          let medicationForm = new MedicationAudit();
          medicationForm.patientId = this.serviceUserData.id;
          medicationForm.auditDate = new Date(
            new Date(this.medicationAuditForm.auditDate.value).setMonth(
              new Date(this.medicationAuditForm.auditDate.value).getMonth() + 1
            )
          );
          medicationForm.auditedBy = this.medicationAuditForm.auditedBy.value;
          medicationForm.locationId = this.serviceUserData.locationId;
          medicationForm.careHomeId = Number(
            JSON.parse(localStorage.getItem('_identity')).careHomeId
          );
          medicationForm.createdAt = new Date();
          medicationForm.createdBy = this.currentUserId;
          
          this.formThirteenService.addForm(medicationForm).subscribe();
        }
      }
      if (this.isEdit) {
        this.updateForm();
      } else {
        this.addForm(this.medicationAuditForm.save());
      }
    }

  }

  public goBack() {
    if (this.isReload) {
      // location.reload();
      this.router.navigate([Constants.routes.dashboard()]);

    } else
      this.showFormsThirteen.emit()
  }

  private addForm(formData) {
    this.SetLoading(true);
    this.formThirteenService.addForm(formData).subscribe(
      (response) => {
        if (response) {
          alert('Form submitted successfully');
          this.goBack();
        }
        this.SetLoading(false);
      },
      (err) => {
        console.log(err.error);
        this.SetLoading(false);
      }
    );
  }

  private updateForm() {
    this.SetLoading(true);
    let message = 'Updated and saved successfully';
    if (this.medicationAuditForm.signoffBy.value == this.currentUserId) {
      this.medicationAuditForm.isSignedOff = true;
      message = 'Updated and signed off successfully';
    }
    this.formThirteenService
      .updateForm(this.medicationAuditForm.save())
      .subscribe((response) => {
        if (response) {
          alert(message);
          this.goBack();
        }
        this.SetLoading(false);
      },
        (err) => {
          console.log(err.error);
          this.SetLoading(false);
        }
      );
  }

  private getLocations() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.locationService.getLocations(careHomeId).subscribe((response) => {
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
      this.userService.getByLocation(locationId,careHomeId).subscribe((response) => {
        if (response) {
          this.userList = response.filter((x) => x.userType != UserType.Auditor);
        }
      },
        (err) => {
          console.error('could not fetch users::' + err.error);
        });
    }
  }

  private setValidation() {
    this.medicationAuditForm.signoffBy.setValidators(Validators.required);
    this.medicationAuditForm.signoffBy.updateValueAndValidity();
    this.medicationAuditForm.auditDate.setValidators(Validators.required);
    this.medicationAuditForm.auditDate.updateValueAndValidity();
    this.medicationAuditForm.medicationAdministrationRecord.setValidators(
      Validators.required
    );
    this.medicationAuditForm.medicationAdministrationRecord.updateValueAndValidity();
    this.medicationAuditForm.treatmentAttached.setValidators(
      Validators.required
    );
    this.medicationAuditForm.treatmentAttached.updateValueAndValidity();
    this.medicationAuditForm.startAndEndDate.setValidators(Validators.required);
    this.medicationAuditForm.startAndEndDate.updateValueAndValidity();
    this.medicationAuditForm.handwrittenMedicines.setValidators(
      Validators.required
    );
    this.medicationAuditForm.handwrittenMedicines.updateValueAndValidity();
    this.medicationAuditForm.medicationAdministeredSigned.setValidators(
      Validators.required
    );
    this.medicationAuditForm.medicationAdministeredSigned.updateValueAndValidity();
    this.medicationAuditForm.signedOnBack.setValidators(Validators.required);
    this.medicationAuditForm.signedOnBack.updateValueAndValidity();
    this.medicationAuditForm.administeredReason.setValue(RiskEntry.No);
    // this.medicationAuditForm.administeredReason.setValidators(Validators.required);
    // this.medicationAuditForm.administeredReason.updateValueAndValidity();
    this.medicationAuditForm.dailyCounting.setValidators(Validators.required);
    this.medicationAuditForm.dailyCounting.updateValueAndValidity();
    this.medicationAuditForm.nightCounting.setValidators(Validators.required);
    this.medicationAuditForm.nightCounting.updateValueAndValidity();
    this.medicationAuditForm.medicationReceivedDocument.setValidators(
      Validators.required
    );
    this.medicationAuditForm.medicationReceivedDocument.updateValueAndValidity();
    this.medicationAuditForm.medicationsDisposed.setValidators(
      Validators.required
    );
    this.medicationAuditForm.medicationsDisposed.updateValueAndValidity();
    this.medicationAuditForm.expiryDateForPrompts.setValidators(
      Validators.required
    );
    this.medicationAuditForm.expiryDateForPrompts.updateValueAndValidity();
    this.medicationAuditForm.openAndEndDate.setValidators(Validators.required);
    this.medicationAuditForm.openAndEndDate.updateValueAndValidity();
    this.medicationAuditForm.medicationsStored.setValidators(
      Validators.required
    );
    this.medicationAuditForm.medicationsStored.updateValueAndValidity();
  }

  private removeValidation() {
    this.medicationAuditForm.signoffBy.clearValidators();
    this.medicationAuditForm.signoffBy.updateValueAndValidity();
    this.medicationAuditForm.auditDate.clearValidators();
    this.medicationAuditForm.auditDate.updateValueAndValidity();
    this.medicationAuditForm.medicationAdministrationRecord.clearValidators();
    this.medicationAuditForm.medicationAdministrationRecord.updateValueAndValidity();
    this.medicationAuditForm.medicationAdministrationRecord.setValue(
      RiskEntry.No
    );
    this.medicationAuditForm.treatmentAttached.clearValidators();
    this.medicationAuditForm.treatmentAttached.updateValueAndValidity();
    this.medicationAuditForm.treatmentAttached.setValue(RiskEntry.No);
    this.medicationAuditForm.startAndEndDate.clearValidators();
    this.medicationAuditForm.startAndEndDate.updateValueAndValidity();
    this.medicationAuditForm.startAndEndDate.setValue(RiskEntry.No);
    this.medicationAuditForm.handwrittenMedicines.clearValidators();
    this.medicationAuditForm.handwrittenMedicines.updateValueAndValidity();
    this.medicationAuditForm.handwrittenMedicines.setValue(RiskEntry.No);
    this.medicationAuditForm.medicationAdministeredSigned.clearValidators();
    this.medicationAuditForm.medicationAdministeredSigned.updateValueAndValidity();
    this.medicationAuditForm.medicationAdministeredSigned.setValue(
      RiskEntry.No
    );
    this.medicationAuditForm.signedOnBack.clearValidators();
    this.medicationAuditForm.signedOnBack.updateValueAndValidity();
    this.medicationAuditForm.signedOnBack.setValue(RiskEntry.No);
    // this.medicationAuditForm.administeredReason.clearValidators();
    // this.medicationAuditForm.administeredReason.updateValueAndValidity();
    this.medicationAuditForm.administeredReason.setValue(RiskEntry.No);
    this.medicationAuditForm.dailyCounting.clearValidators();
    this.medicationAuditForm.dailyCounting.updateValueAndValidity();
    this.medicationAuditForm.dailyCounting.setValue(RiskEntry.No);
    this.medicationAuditForm.nightCounting.clearValidators();
    this.medicationAuditForm.nightCounting.updateValueAndValidity();
    this.medicationAuditForm.nightCounting.setValue(RiskEntry.No);
    this.medicationAuditForm.medicationReceivedDocument.clearValidators();
    this.medicationAuditForm.medicationReceivedDocument.updateValueAndValidity();
    this.medicationAuditForm.medicationReceivedDocument.setValue(RiskEntry.No);
    this.medicationAuditForm.medicationsDisposed.clearValidators();
    this.medicationAuditForm.medicationsDisposed.updateValueAndValidity();
    this.medicationAuditForm.medicationsDisposed.setValue(RiskEntry.No);
    this.medicationAuditForm.expiryDateForPrompts.clearValidators();
    this.medicationAuditForm.expiryDateForPrompts.updateValueAndValidity();
    this.medicationAuditForm.expiryDateForPrompts.setValue(RiskEntry.No);
    this.medicationAuditForm.openAndEndDate.clearValidators();
    this.medicationAuditForm.openAndEndDate.updateValueAndValidity();
    this.medicationAuditForm.openAndEndDate.setValue(RiskEntry.No);
    this.medicationAuditForm.medicationsStored.clearValidators();
    this.medicationAuditForm.medicationsStored.updateValueAndValidity();
    this.medicationAuditForm.medicationsStored.setValue(RiskEntry.No);
  }
}
