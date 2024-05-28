import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormTenService } from 'src/app/services/form-ten.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { ApplianceName } from 'src/app/shared/enums/appliance-name.enum';
import { AreaName } from 'src/app/shared/enums/area-name.enum';
import { FloorName } from 'src/app/shared/enums/floor-name.enum';
import { AuditFormTen } from 'src/app/shared/models/audit-form-ten';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/util/Constants';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-form-ten',
  templateUrl: './form-ten.component.html',
  styleUrls: ['./form-ten.component.scss'],
})
export class FormTenComponent extends BaseComponent implements OnInit {
  @Output() getForms: EventEmitter<any> = new EventEmitter<any>();

  public locationList: Array<Location> = [];
  public userList: Array<User> = [];
  public previousAuditor: number;
  public auditForm: FormGroup;
  public isEdit: boolean = false;
  public isFilling: boolean = false;
  public createForm: boolean = false;
  public floors: Array<any> = [];
  public areas: Array<any> = [];
  public appliances: Array<any> = [];

  constructor(
    private locationService: LocationServices,
    private userService: UserService,
    private formtenService: FormTenService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.floors = this.getFloor();
    this.areas = this.getArea();
    this.appliances = this.getAppliances();
    this.getLocations();
    // this.getUsers();
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.getFormTen(this.route.snapshot.params['id']);
    } else {
      this.auditForm = this.fb.group({
        id: [0],
        auditDate: [null],
        auditedBy: [null, Validators.required],
        floor: [null, Validators.required],
        area: [null, Validators.required],
        appliance: [null, Validators.required],
        comments: [null, Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,30}$")],
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

  public getSelected() {
    this.previousAuditor = this.auditForm.controls['auditedBy'].value;
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

  public onSubmit() {
    this.SetLoading(true);
    if (this.currentUserId == this.auditForm.controls['auditedBy'].value || this.currentUserRole == this.userType.SuperUser || this.currentUserRole == this.userType.Admin) {
      if (Number(this.currentUserId) == Number(this.auditForm.controls['signoffBy'].value)) {
        this.auditForm.controls['isSignedOff'].setValue(true);
        this.auditForm.controls['signoffBy'].enable();
        if (this.createForm) {
          let formTen = new AuditFormTen();
          formTen.auditDate = new Date(new Date(this.auditForm.controls['auditDate'].value).setMonth(new Date(this.auditForm.controls['auditDate'].value).getMonth() + 1));
          formTen.auditedBy = this.auditForm.controls['auditedBy'].value;
          formTen.locationId = this.auditForm.controls['locationId'].value;
          formTen.careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
          formTen.createdAt = new Date();
          formTen.createdBy = this.currentUserId;
          this.formtenService.addForm(formTen).subscribe();
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
    if (this.currentUserRole == this.userType.SuperUser || this.currentUserRole == this.userType.Admin) {
      this.auditForm.controls['signoffBy'].setValue(this.currentUserId);
    }
  }

  private addForm() {
    this.SetLoading(true);
    this.formtenService.addForm(this.auditForm.value).subscribe(
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
    this.formtenService.updateForm(this.auditForm.value).subscribe(
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

  private getFormTen(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formtenService.getForm(id).subscribe(
        (response) => {
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

    this.auditForm.controls['auditDate'].setValidators(Validators.required);
    this.auditForm.controls['auditDate'].updateValueAndValidity();
    this.auditForm.controls['signoffBy'].setValidators(Validators.required);
    this.auditForm.controls['signoffBy'].updateValueAndValidity();

    this.auditForm.controls['floor'].setValidators(Validators.required);
    this.auditForm.controls['floor'].updateValueAndValidity();

    this.auditForm.controls['area'].setValidators(Validators.required);
    this.auditForm.controls['area'].updateValueAndValidity();

    this.auditForm.controls['appliance'].setValidators(Validators.required);
    this.auditForm.controls['appliance'].updateValueAndValidity();

    this.auditForm.controls['comments'].setValidators(Validators.required);
    this.auditForm.controls['comments'].updateValueAndValidity();

  }

  private removeValidation() {
    this.auditForm.controls['auditDate'].clearValidators();
    this.auditForm.controls['auditDate'].updateValueAndValidity();
    this.auditForm.controls['signoffBy'].clearValidators();
    this.auditForm.controls['signoffBy'].updateValueAndValidity();

    this.auditForm.controls['floor'].clearValidators();
    this.auditForm.controls['floor'].updateValueAndValidity();

    this.auditForm.controls['area'].clearValidators();
    this.auditForm.controls['area'].updateValueAndValidity();

    this.auditForm.controls['appliance'].clearValidators();
    this.auditForm.controls['appliance'].updateValueAndValidity();

    this.auditForm.controls['comments'].clearValidators();
    this.auditForm.controls['comments'].updateValueAndValidity();
  }

  private setFormValue(formTenValue: AuditFormTen) {
    this.auditForm = this.fb.group({
      id: [formTenValue.id],
      auditDate: [formTenValue.auditDate],
      auditedBy: [formTenValue.auditedBy, Validators.required],

      floor: [formTenValue.floor, Validators.required],
      area: [formTenValue.area, Validators.required],
      appliance: [formTenValue.appliance, Validators.required],
      comments: [formTenValue.comments],
      signoffBy: [formTenValue.signoffBy],
      isSignedOff: [formTenValue.isSignedOff],
      locationId: [formTenValue.locationId, Validators.required],
      careHomeId: [formTenValue.careHomeId],
      createdBy: [formTenValue.createdBy],
      createdAt: [formTenValue.createdAt],
      updatedBy: [formTenValue.createdBy],
    });
    this.completeForm();

  }

  private getFloor() {
    return EnumConverter.ConvertEnumToArray(FloorName);
  }
  private getArea() {
    return EnumConverter.ConvertEnumToArray(AreaName);
  }
  private getAppliances() {
    return EnumConverter.ConvertEnumToArray(ApplianceName);
  }
}
