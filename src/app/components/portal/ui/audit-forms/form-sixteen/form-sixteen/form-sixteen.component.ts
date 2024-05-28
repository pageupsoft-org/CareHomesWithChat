import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormSixteenService } from 'src/app/services/form-sixteen.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { Satisfaction } from 'src/app/shared/enums/satisfaction.enum';
import { AuditFormSixteen } from 'src/app/shared/models/audit-form-sixteen';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/util/Constants';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-form-sixteen',
  templateUrl: './form-sixteen.component.html',
  styleUrls: ['./form-sixteen.component.scss']
})
export class FormSixteenComponent extends BaseComponent implements OnInit {

  public locationList: Array<Location> = [];
  public userList: Array<User> = [];
  public allUserList: Array<User> = [];
  public auditForm: FormGroup;
  public isEdit: boolean = false;
  public isFilling: boolean = false;
  public createForm: boolean = false;
  public satisfaction: any;

  constructor(
    private locationService: LocationServices,
    private userService: UserService,
    private formSixteenService: FormSixteenService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.getLocations();
    this.getAllUsers();
    this.satisfaction = EnumConverter.ConvertEnumToArray(Satisfaction);
    
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.getFormSixteen(this.route.snapshot.params['id']);
    } else {
      this.auditForm = this.fb.group({
        id: [0],
        auditDate: [null],
        auditedBy: [null, Validators.required],
        generalComment: ['', Validators.compose([Validators.maxLength(300), Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,300}$")])],
        signoffBy: [null],
        isSignedOff: [false],
        locationId: [null, Validators.required],
        careHomeId: [careHomeId],
        createdBy: [this.currentUserId],
        createdAt: [new Date().toISOString()],

        form16Records: this.fb.array([this.addMoreRecord()]),
      });
      this.completeForm();
    }
  }

  public addMoreRecordClick(record?: any): void {
    if (record) {
      (<FormArray>this.auditForm.get('form16Records')).push(this.addMoreRecord(record));
    } else {
      (<FormArray>this.auditForm.get('form16Records')).push(this.addMoreRecord());
    }
  }

  public remove(i: number) {
    (<FormArray>this.auditForm.get('form16Records')).removeAt(i);
    if (this.auditForm.controls['auditedBy'].value == this.currentUserId ||
      this.currentUserId == this.auditForm.controls['signoffBy'].value
    ) {
      if (
        (<FormArray>this.auditForm.get('form16Records')).length == 0
      ) {
        this.addMoreRecordClick();
      }
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
          let formSixteen = new AuditFormSixteen();
          let date = new Date(this.auditForm.controls['auditDate'].value);
          formSixteen.auditDate = new Date(date.setDate(date.getDate() + 7));
          formSixteen.auditedBy = this.auditForm.controls['auditedBy'].value;
          formSixteen.locationId = this.auditForm.controls['locationId'].value;
          formSixteen.careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
          formSixteen.createdAt = new Date();
          formSixteen.createdBy = this.currentUserId;
          this.formSixteenService.addForm(formSixteen).subscribe();
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

  private addMoreRecord(record?: any): FormGroup {
    if (record) {
      return this.fb.group({
        id: [record.id],
        location: [record.location, Validators.compose([Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,30}$"), Validators.maxLength(30), Validators.required])],
        doorlocks: [record.doorlocks, Validators.compose([Validators.required])],
        furnitureFittings: [record.furnitureFittings, Validators.compose([Validators.required])],
        harzardousItem: [record.harzardousItem, Validators.compose([Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,30}$"), Validators.maxLength(30), Validators.required])],
        actionRequired: [record.actionRequired, Validators.compose([Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,30}$"), Validators.maxLength(30), Validators.required])],
        targetDate: [record.targetDate, Validators.compose([Validators.required])],
        actionedBy: [record.actionedBy, Validators.compose([Validators.required])],
        completedBy: [record.completedBy, Validators.compose([Validators.required])],
      });
    } else {
      return this.fb.group({
        id: [0],
        location: ['', Validators.compose([Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,30}$"), Validators.maxLength(30), Validators.required])],
        doorlocks: ["", Validators.compose([Validators.required])],
        furnitureFittings: ["", Validators.compose([Validators.required])],
        harzardousItem: ["", Validators.compose([Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,30}$"), Validators.maxLength(30), Validators.required])],
        actionRequired: ["", Validators.compose([Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,30}$"), Validators.maxLength(30), Validators.required])],
        targetDate: ["", Validators.compose([Validators.required])],
        actionedBy: ["", Validators.compose([Validators.required])],
        completedBy: ['', Validators.compose([Validators.required])]
      });
    }
  }

  private addForm() {
    this.SetLoading(true);
    this.formSixteenService.addForm(this.auditForm.value).subscribe(
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
    this.formSixteenService.updateForm(this.auditForm.value).subscribe(
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

  private setValidation() {

    if ((<FormArray>this.auditForm.get('form16Records')).length == 0) {
      this.addMoreRecordClick();
    }

    this.auditForm.controls['auditDate'].setValidators(Validators.required);
    this.auditForm.controls['auditDate'].updateValueAndValidity();
    this.auditForm.controls['signoffBy'].setValidators(Validators.required);
    this.auditForm.controls['signoffBy'].updateValueAndValidity();
  }

  private removeValidation() {
    (<FormArray>this.auditForm.get('form16Records')).clear();
    this.auditForm.controls['auditDate'].clearValidators();
    this.auditForm.controls['auditDate'].updateValueAndValidity();
    this.auditForm.controls['signoffBy'].clearValidators();
    this.auditForm.controls['signoffBy'].updateValueAndValidity();
  }

  private getFormSixteen(formId) {
    this.SetLoading(true);
    this.formSixteenService.getForm(formId).subscribe((response) => {
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

  private setFormValue(formValue: AuditFormSixteen) {
    this.auditForm = this.fb.group({
      id: [formValue.id],
      auditDate: [formValue.auditDate],
      auditedBy: [formValue.auditedBy, Validators.required],
      generalComment: [formValue.generalComment, Validators.compose([Validators.maxLength(300), Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,300}$")])],
      signoffBy: [formValue.signoffBy],
      isSignedOff: [formValue.isSignedOff],
      locationId: [formValue.locationId, Validators.required],
      careHomeId: [formValue.careHomeId],
      createdBy: [formValue.createdBy],
      createdAt: [formValue.createdAt],
      form16Records: this.fb.array([]),
    });
    if (formValue.form16Records.length > 0) {
      formValue.form16Records.forEach((element) => {
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
