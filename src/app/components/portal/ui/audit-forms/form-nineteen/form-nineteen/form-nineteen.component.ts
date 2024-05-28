import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormNineteenService } from 'src/app/services/form-nineteen.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { UserType } from 'src/app/shared/enums/user-type.enum';
import { AuditFormNineteen } from 'src/app/shared/models/audit-form-nineteen';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/util/Constants';

@Component({
  selector: 'app-form-nineteen',
  templateUrl: './form-nineteen.component.html',
  styleUrls: ['./form-nineteen.component.scss']
})
export class FormNineteenComponent extends BaseComponent implements OnInit {

  public locationList: Array<Location> = [];
  public userList: Array<User> = [];
  public allUserList: Array<User> = [];
  public auditForm: FormGroup;
  public isEdit: boolean = false;
  public isFilling: boolean = false;
  public createForm: boolean = false;

  constructor(private locationService: LocationServices,
    private userService: UserService,
    private formNineteenService: FormNineteenService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) { super(); }

  ngOnInit(): void {
    this.getLocations();
    this.getAllUsers();
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.getFormNineteen(this.route.snapshot.params['id']);
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
        form19Records: this.fb.array([this.addRecord()])
      });
      this.completeForm();
    }
  }

  public completeForm(event?: any) {

    if (this.auditForm.controls['auditedBy'].value == this.currentUserId) {
      this.isFilling = true;
      if (this.currentUserRole == UserType.SuperUser || this.currentUserRole == UserType.Admin) {
        this.auditForm.controls['signoffBy'].disable();
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
        // this.auditForm.controls['signoffBy'].disable();
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

  public goBack() {
    if (this.route.snapshot.queryParams["fromDashboard"]) {
      this.router.navigate([Constants.routes.dashboard()]);
    }
    else
      window.history.back();
  }

  public getUsers(locationId: number) {
    if (locationId) {
      this.SetLoading(true);
      let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
      this.userService.getByLocation(locationId, careHomeId).subscribe((response) => {
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

  public remove(index: number) {
    (<FormArray>this.auditForm.get('form19Records')).removeAt(index);
    if ((<FormArray>this.auditForm.get('form19Records')).length == 0) {
      this.addRecordButtonClick();
    }
  }

  public onSubmit() {
    this.SetLoading(true);
    if (this.currentUserId == this.auditForm.controls['auditedBy'].value || this.currentUserRole == this.userType.SuperUser || this.currentUserRole == this.userType.Admin) {
      if (Number(this.currentUserId) == Number(this.auditForm.controls['signoffBy'].value)) {
        this.auditForm.controls['isSignedOff'].setValue(true);
        this.auditForm.controls['signoffBy'].enable();
        if (this.createForm) {
          let formEleven = new AuditFormNineteen();
          let date = new Date(this.auditForm.controls['auditDate'].value);
          formEleven.auditDate = new Date(date.setDate(date.getDate() + 7));
          // formEleven.auditDate = new Date(new Date(this.auditForm.controls['auditDate'].value).setMonth(new Date(this.auditForm.controls['auditDate'].value).getMonth() +1));
          formEleven.auditedBy = this.auditForm.controls['auditedBy'].value;
          formEleven.locationId = this.auditForm.controls['locationId'].value;
          formEleven.careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
          formEleven.createdAt = new Date();
          formEleven.createdBy = this.currentUserId;
          this.formNineteenService.addForm(formEleven).subscribe();
        }
      }
      if (this.isEdit) {
        this.updateForm();
      } else {
        this.addForm();
      }
    }
  }

  public addRecordButtonClick(record?: any): void {
    if (record) {
      (<FormArray>this.auditForm.get('form19Records')).push(this.addRecord(record));
    } else {
      (<FormArray>this.auditForm.get('form19Records')).push(this.addRecord(record = null));
    }
  }

  private addRecord(record?: any): FormGroup {
    if (record) {
      return this.fb.group({
        id: [record.id],
        area: [record.area, Validators.compose([Validators.required, Validators.maxLength(500)])],
        hazard: [record.hazard, Validators.compose([Validators.required])],
        whatIsHazard: [record.whatIsHazard, Validators.compose([Validators.required, Validators.maxLength(500)])],
        hazardIdentified: [record.hazardIdentified, Validators.compose([Validators.required])],
        followUpAction: [record.followUpAction, Validators.compose([Validators.required])],
        followUpDate: [record.followUpDate, Validators.compose([Validators.required])],
        actionedBy: [record.actionedBy, Validators.compose([Validators.required])],
        comment: [record.comment, Validators.compose([Validators.required])]
      });
    } else {
      return this.fb.group({
        id: [0],
        area: ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
        hazard: [true, Validators.compose([Validators.required])],
        whatIsHazard: ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
        hazardIdentified: [true, Validators.compose([Validators.required])],
        followUpAction: ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
        followUpDate: ['', Validators.compose([Validators.required])],
        actionedBy: ['', Validators.compose([Validators.required])],
        comment: ['', Validators.compose([Validators.required, Validators.maxLength(500)])]
      });
    }
  }

  private getFormNineteen(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formNineteenService.getForm(id).subscribe((response) => {
        if (response) {
          this.setFormValue(response);
          this.getUsers(response.locationId);

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

  private setValidation() {
    if ((<FormArray>this.auditForm.get('form19Records')).length == 0) {
      this.addRecordButtonClick();
    }
    this.auditForm.controls['auditDate'].setValidators(Validators.required);
    this.auditForm.controls['auditDate'].updateValueAndValidity();
    this.auditForm.controls['signoffBy'].setValidators(Validators.required);
    this.auditForm.controls['signoffBy'].updateValueAndValidity();
  }

  private removeValidation() {
    (<FormArray>this.auditForm.get('form19Records')).clear();
    this.auditForm.controls['auditDate'].clearValidators();
    this.auditForm.controls['auditDate'].updateValueAndValidity();
    this.auditForm.controls['signoffBy'].clearValidators();
    this.auditForm.controls['signoffBy'].updateValueAndValidity();
  }

  private setFormValue(formNinteenValue: AuditFormNineteen) {
    this.auditForm = this.fb.group({
      id: [formNinteenValue.id],
      auditDate: [formNinteenValue.auditDate],
      auditedBy: [formNinteenValue.auditedBy, Validators.required],

      signoffBy: [formNinteenValue.signoffBy],
      isSignedOff: [formNinteenValue.isSignedOff],
      locationId: [formNinteenValue.locationId, Validators.required],
      careHomeId: [formNinteenValue.careHomeId],
      createdBy: [this.currentUserId],
      createdAt: [new Date().toISOString()],
      form19Records: this.fb.array([])
    });

    if (formNinteenValue.form19Records && formNinteenValue.form19Records.length > 0) {
      formNinteenValue.form19Records.forEach((element) => {
        this.addRecordButtonClick(element);
      });
    }
    this.completeForm();

  }

  private addForm() {
    this.SetLoading(true);
    this.formNineteenService.addForm(this.auditForm.value).subscribe(
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
    this.formNineteenService.updateForm(this.auditForm.value).subscribe(
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
    this.locationService.getLocations(careHomeId).subscribe((response) => {
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
