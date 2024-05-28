import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormTwelveService } from 'src/app/services/form-twelve.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { AuditFormNine } from 'src/app/shared/models/audit-form-nine';
import { AuditFormTwelve } from 'src/app/shared/models/audit-form-twelve';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/util/Constants';

@Component({
  selector: 'app-form-twelve',
  templateUrl: './form-twelve.component.html',
  styleUrls: ['./form-twelve.component.scss'],
})
export class FormTwelveComponent extends BaseComponent implements OnInit {
  public locationList: Array<Location> = [];
  public userList: Array<User> = [];
  public allUserList: Array<User> = [];
  public auditForm: FormGroup;
  public isEdit: boolean = false;
  public createForm: boolean = false;
  public isFilling: boolean = false;

  constructor(
    private locationService: LocationServices,
    private userService: UserService,
    private formTwelveService: FormTwelveService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.getLocations();
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.getFormTwelve(this.route.snapshot.params['id']);
    } else {
      this.auditForm = this.fb.group({
        id: [0],
        auditDate: [null],
        auditedBy: [null, Validators.required],
        signoffBy: [null],
        isSignedOff: [false],
        locationId: [null, Validators.required],
        careHomeId: [careHomeId],
        createdBy: [this.currentUserId],
        createdAt: [new Date().toISOString()],

        form12Records: this.fb.array([this.addMoreRecord()]),
      });
      this.completeForm();
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

  public addMoreRecordClick(record?: any): void {
    if (record) {
      (<FormArray>this.auditForm.get('form12Records')).push(
        this.addMoreRecord(record)
      );
    } else {
      (<FormArray>this.auditForm.get('form12Records')).push(
        this.addMoreRecord()
      );
    }
  }

  public remove(i: number) {
    (<FormArray>this.auditForm.get('form12Records')).removeAt(i);
    // if(this.auditForm.this.medicationAuditForm.controls['signoffBy'].)
    if (
      this.auditForm.controls['auditedBy'].value == this.currentUserId ||
      this.currentUserId == this.auditForm.controls['signoffBy'].value
    ) {
      if ((<FormArray>this.auditForm.get('form12Records')).length == 0) {
        this.addMoreRecordClick();
      }
    }
  }

  public completeForm(event?: any) {
    if (this.auditForm.controls['auditedBy'].value == this.currentUserId) {
      // user going to fill form
      this.isFilling = true;
      if (this.currentUserRole == this.userType.SuperUser ||this.currentUserRole == this.userType.Admin) {
        this.auditForm.controls['signoffBy'].disable(); //disable sign off by and set current user id
        this.auditForm.controls['signoffBy'].setValue(this.currentUserId);
        this.auditForm.controls['isSignedOff'].setValue(true);
        this.auditForm.controls['auditDate'].setValue(new Date().toISOString());
      } else {
        this.auditForm.controls['auditDate'].setValue(new Date().toISOString());
      }
      this.setValidation();
    } else if (
      this.currentUserId == this.auditForm.controls['signoffBy'].value &&
      this.isEdit
    ) {
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
    if (
      this.currentUserId == this.auditForm.controls['auditedBy'].value ||
      this.currentUserRole == this.userType.SuperUser ||
      this.currentUserRole == this.userType.Admin
    ) {
      if (
        Number(this.currentUserId) ==
        Number(this.auditForm.controls['signoffBy'].value)
      ) {
        this.auditForm.controls['isSignedOff'].setValue(true);
        this.auditForm.controls['signoffBy'].enable();
        if (this.createForm) {
          let formTwelve = new AuditFormTwelve();
          let date = new Date(this.auditForm.controls['auditDate'].value);
          formTwelve.auditDate = new Date(date.setDate(date.getDate() + 7));
          // formTwelve.auditDate = new Date(new Date(this.auditForm.controls['auditDate'].value).setMonth(new Date(this.auditForm.controls['auditDate'].value).getMonth() +1));
          formTwelve.auditedBy = this.auditForm.controls['auditedBy'].value;
          formTwelve.locationId = this.auditForm.controls['locationId'].value;
          formTwelve.careHomeId = Number(
            JSON.parse(localStorage.getItem('_identity')).careHomeId
          );
          formTwelve.createdAt = new Date();
          formTwelve.createdBy = this.currentUserId;
          this.formTwelveService.addForm(formTwelve).subscribe();
        }
      }
      if (this.isEdit) {
        this.updateForm();
      } else {
        this.addForm();
      }
    }
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
    this.formTwelveService.addForm(this.auditForm.value).subscribe(
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
    this.formTwelveService.updateForm(this.auditForm.value).subscribe(
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

  private addMoreRecord(record?: any): FormGroup {
    if (record) {
      return this.fb.group({
        id: [record.id],
        windowRestrictorLocation: [
          record.windowRestrictorLocation,
          Validators.required,
        ],
        isApplicable: [record.isApplicable, Validators.required],
        isRestrictorPresent: [record.isRestrictorPresent, Validators.required],
        isRestrictorFunctional: [
          record.isRestrictorFunctional,
          Validators.required,
        ],
        signOfDamage: [record.signOfDamage, Validators.required],
        isRestrictorDefective: [
          record.isRestrictorDefective,
          Validators.required,
        ],
        isActionRequired: [record.isActionRequired, Validators.required],
        actionRequired: [record.actionRequired, Validators.required],
        dateActionRequired: [record.dateActionRequired, Validators.required],
        dateActionCompleted: [record.dateActionCompleted, Validators.required],
        actionCompletedBy: [record.actionCompletedBy, Validators.required],
      });
    } else {
      return this.fb.group({
        id: [0],
        windowRestrictorLocation: ['', Validators.required],
        isApplicable: [false, Validators.required],
        isRestrictorPresent: [false, Validators.required],
        isRestrictorFunctional: [false, Validators.required],
        signOfDamage: [false, Validators.required],
        isRestrictorDefective: [false, Validators.required],
        isActionRequired: [false, Validators.required],
        actionRequired: ['', Validators.required],
        dateActionRequired: [null, Validators.required],
        dateActionCompleted: ['', Validators.required],
        actionCompletedBy: ['', Validators.required],
      });
    }
  }

  private getLocations() {
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    this.locationService.getLocations(careHomeId).subscribe(
      (response) => {
        if (response.length > 0) {
          // this.locationList = response;
          if (this.currentUserRole != this.userType.Admin) {
            let locationIds = JSON.parse(
              localStorage.getItem('_identity')
            ).locationIds;
            locationIds.forEach((element) => {
              this.locationList.push(
                response.filter((x) => x.id == element)[0]
              );
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
      let careHomeId = Number(
        JSON.parse(localStorage.getItem('_identity')).careHomeId
      );
      this.userService.getByLocation(locationId, careHomeId).subscribe(
        (response) => {
          if (response) {
            this.userList = response.filter(
              (x) => x.userType != this.userType.Auditor
            );
          }
          this.SetLoading(false);
        },
        (err) => {
          this.SetLoading(false);
          console.error('could not fetch users::' + err.error);
        }
      );
    }
  }

  private setValidation() {
    this.auditForm.controls['auditDate'].setValidators(Validators.required);
    this.auditForm.controls['auditDate'].updateValueAndValidity();
    this.auditForm.controls['signoffBy'].setValidators(Validators.required);
    this.auditForm.controls['signoffBy'].updateValueAndValidity();
    if ((<FormArray>this.auditForm.get('form12Records')).length == 0) {
      this.addMoreRecordClick();
    }
  }

  private removeValidation() {
    this.auditForm.controls['auditDate'].clearValidators();
    this.auditForm.controls['auditDate'].updateValueAndValidity();
    this.auditForm.controls['signoffBy'].clearValidators();
    this.auditForm.controls['signoffBy'].updateValueAndValidity();

    (<FormArray>this.auditForm.get('form12Records')).clear();
  }

  private getFormTwelve(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formTwelveService.getForm(id).subscribe(
        (response) => {
          if (response) {
            this.getUsers(response.locationId);
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

  private setFormValue(formTwelveValue: AuditFormTwelve) {
    this.auditForm = this.fb.group({
      id: [formTwelveValue.id],
      auditDate: [formTwelveValue.auditDate],
      auditedBy: [formTwelveValue.auditedBy, Validators.required],
      signoffBy: [formTwelveValue.signoffBy],
      isSignedOff: [formTwelveValue.isSignedOff],
      locationId: [formTwelveValue.locationId, Validators.required],
      careHomeId: [formTwelveValue.careHomeId],
      createdBy: [formTwelveValue.createdBy],
      createdAt: [formTwelveValue.createdAt],
      form12Records: this.fb.array([]),
    });
    if (formTwelveValue.form12Records.length > 0) {
      formTwelveValue.form12Records.forEach((element) => {
        this.addMoreRecordClick(element);
      });
    } else {
      this.addMoreRecordClick();
    }
    this.completeForm();
  }

  private getAllUsers() {
    this.SetLoading(true);
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe((response) => {
      if (response) {
        this.allUserList = response.filter((x) => x.userType != this.userType.Auditor);
      }
      this.SetLoading(false);
    },
      (err) => {
        this.SetLoading(false);
        console.error('could not fetch users::' + err.error);
      });

  }
}
