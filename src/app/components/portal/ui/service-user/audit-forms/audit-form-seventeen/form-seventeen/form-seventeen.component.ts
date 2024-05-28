import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { UserType } from 'src/app/shared/enums/user-type.enum';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';
import { FormArray, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { FormSeventeenService } from 'src/app/services/form-seventeen.service';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { WeeklyMedicationStockCheck } from 'src/app/shared/models/weekly-medication-stock-check';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { Constants } from 'src/app/util/Constants';

@Component({
  selector: 'app-form-seventeen',
  templateUrl: './form-seventeen.component.html',
  styleUrls: ['./form-seventeen.component.scss'],
})
export class FormSeventeenComponent extends BaseComponent implements OnInit {
  @Input() serviceUserData: PatientAdmission;
  @Input() weeklyMedicationStock: WeeklyMedicationStockCheck;
  @Input() isReload: boolean;
  @Output() getForms: EventEmitter<any> = new EventEmitter<any>();

  public locationList: Array<Location> = [];
  public userList: Array<User> = [];
  public allUserList: Array<User> = [];
  public auditForm: FormGroup;
  public isEdit: boolean = false;
  public isFilling: boolean = false;
  public createForm: boolean = false;

  constructor(
    private locationService: LocationServices,
    private userService: UserService,
    private fb: FormBuilder,
    private formseventeenService: FormSeventeenService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    if (!this.serviceUserData) {
      return;
    }
    this.getLocations();
    this.getAllUsers();
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );

    if (this.weeklyMedicationStock && this.weeklyMedicationStock.id) {
      this.getForm17(this.weeklyMedicationStock.id);
    } else {
      this.auditForm = this.fb.group({
        id: [0],
        patientId: [this.serviceUserData.id],
        auditDate: [null],
        auditedBy: [this.serviceUserData.careCoordinators[0]['careCoordinatorId'], Validators.required,],
        signoffBy: [null],
        isSignedOff: [false],
        locationId: [this.serviceUserData.locationId],
        careHomeId: [careHomeId],
        createdBy: [this.currentUserId],
        createdAt: [new Date()],
        medicationStockRecords: this.fb.array([this.addStock()]),
      });

      this.getUsers(this.auditForm.controls['locationId'].value);
      this.completeForm();
    }
  }

  public remove(i: number) {
    (<FormArray>this.auditForm.get('medicationStockRecords')).removeAt(i);
    // if(this.auditForm.this.medicationAuditForm.controls['signoffBy'].)
    if (this.auditForm.controls['auditedBy'].value == this.currentUserId || this.currentUserId == this.auditForm.controls['signoffBy'].value) {
      if (
        (<FormArray>this.auditForm.get('medicationStockRecords')).length == 0
      ) {
        this.addStockButtonClick();
      }
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

  public onSubmit() {
    this.SetLoading(true);
    if (this.currentUserId == this.auditForm.controls['auditedBy'].value || this.currentUserRole == UserType.SuperUser || this.currentUserRole == UserType.Admin) {
      if (Number(this.currentUserId) == Number(this.auditForm.controls['signoffBy'].value)) {
        this.auditForm.controls['isSignedOff'].setValue(true);
        this.auditForm.controls['signoffBy'].enable();
        if (this.createForm) {
          let formSeventeen = new WeeklyMedicationStockCheck();
          formSeventeen.patientId = this.serviceUserData.id;
          formSeventeen.auditDate = new Date(
            new Date(this.auditForm.controls['auditDate'].value).setMonth(
              new Date(this.auditForm.controls['auditDate'].value).getMonth() + 1)
          );
          formSeventeen.auditedBy = this.auditForm.controls['auditedBy'].value;
          formSeventeen.locationId = this.serviceUserData.locationId;
          formSeventeen.careHomeId = Number(
            JSON.parse(localStorage.getItem('_identity')).careHomeId);
          formSeventeen.createdAt = new Date();
          formSeventeen.createdBy = this.currentUserId;

          this.formseventeenService.addForm(formSeventeen).subscribe();
        }
      }
      if ((<FormArray>this.auditForm.get('medicationStockRecords')).length > 0) {
        this.auditForm.get('medicationStockRecords').value.forEach((element, index) => {
          let newTime = this.convertTime(element.recordDateTime);

          (<FormArray>this.auditForm.get('medicationStockRecords')).at(index)['controls']['recordDateTime'].setValue(newTime);
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
      this.auditForm.controls['signoffBy'].setValue(this.currentUserId);
    }
  }

  private addForm() {
    this.SetLoading(true);
    this.formseventeenService.addForm(this.auditForm.value).subscribe(
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
    this.formseventeenService.updateForm(this.auditForm.value).subscribe(
      (response) => {
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

  public addStockButtonClick(stock?: any): void {
    if (stock) {
      (<FormArray>this.auditForm.get('medicationStockRecords')).push(
        this.addStock(stock)
      );
    } else {
      (<FormArray>this.auditForm.get('medicationStockRecords')).push(
        this.addStock()
      );
    }
  }

  private addStock(stock?: any): FormGroup {
    if (stock) {
   

      return this.fb.group({
        id: [stock.id],
        recordDateTime: [(stock.recordDateTime) ? formatDate(stock.recordDateTime + 'Z', 'yyyy-MM-ddThh:mm', 'en', 'local') : null, Validators.compose([Validators.required])],
        medicationAndStrength: [stock.medicationAndStrength, Validators.compose([Validators.maxLength(250), Validators.required,
        Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,80}$")])],
        expiryDate: [stock.expiryDate ? formatDate(stock.expiryDate, 'yyyy-MM-dd', 'en', 'local') : null, Validators.compose([Validators.required]),],
        tablets: [stock.tablets, Validators.compose([Validators.required])],
        inhaler: [stock.inhaler, Validators.compose([Validators.required])],
        liquid: [stock.liquid, Validators.compose([Validators.required])],
        depot: [stock.depot, Validators.compose([Validators.required])],
        totalAmount: [
          stock.totalAmount,
          Validators.compose([
            Validators.required,
            Validators.maxLength(8),
            Validators.pattern('^[0-9.]{0,8}$'),
          ]),
        ],
        sign: [stock.sign, Validators.compose([Validators.required])],
        counterSign: [
          stock.counterSign,
          Validators.compose([Validators.required]),
        ],
        comments: [
          stock.comments,
          Validators.compose([
            Validators.maxLength(250),
            Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,300}$"),
          ]),
        ],
      });
    } else {
      return this.fb.group({
        id: [0],
        recordDateTime: ['', Validators.compose([Validators.required])],
        medicationAndStrength: [
          '',
          Validators.compose([
            Validators.maxLength(80),
            Validators.required,
            Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,80}$"),
          ]),
        ],
        expiryDate: ['', Validators.compose([Validators.required])],
        tablets: [
          '',
          Validators.compose([Validators.required, Validators.maxLength(5)]),
        ],
        inhaler: [
          '',
          Validators.compose([Validators.required, Validators.maxLength(5)]),
        ],
        liquid: [
          '',
          Validators.compose([Validators.required, Validators.maxLength(5)]),
        ],
        depot: [
          '',
          Validators.compose([Validators.required, Validators.maxLength(5)]),
        ],
        totalAmount: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(8),
            Validators.pattern('^[0-9.]{0,8}$'),
          ]),
        ],
        sign: ['', Validators.compose([Validators.required])],
        counterSign: ['', Validators.compose([Validators.required])],
        comments: [
          '',
          Validators.compose([
            Validators.maxLength(300),
            Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,300}$"),
          ]),
        ],
      });
    }
  }

  private convertTime(time) {
    if (time) {
      time = formatDate(time, 'yyyy-MM-ddTHH:mm:ss', 'en', 'local');
      return new Date(time).toISOString();
    }
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

  private getForm17(form17Id: number) {
    this.formseventeenService.getForm(form17Id).subscribe((response) => {
      if (response) {
        this.setValues(response);
      }
    },
      (err) => {
        console.error('could not fetch locations ::' + err.error);
      }
    );
  }

  private setValues(data) {
    this.isEdit = true;
    this.auditForm = this.fb.group({
      id: [data.id],
      patientId: [data.patientId],
      auditDate: [
        data.auditDate ? formatDate(data.auditDate, 'yyyy-MM-dd', 'en') : null,
      ],
      auditedBy: [data.auditedBy],
      signoffBy: [data.signoffBy],
      isSignedOff: [data.isSignedOff],
      locationId: [data.locationId],
      careHomeId: [data.careHomeId],
      createdBy: [data.createdBy],
      createdAt: [data.createdAt ? formatDate(data.createdAt, 'yyyy-MM-dd', 'en') : null],
      updatedBy: [this.currentUserId],
      updatedAt: [new Date()],
      medicationStockRecords: this.fb.array([]),
    });
    if (data.medicationStockRecords != null && data.medicationStockRecords.length > 0) {
      data.medicationStockRecords.forEach((element) => {
        this.addStockButtonClick(element);
      });
    } else {
      this.addStockButtonClick();
    }
    this.getUsers(this.auditForm.controls['locationId'].value);

    this.completeForm();
    // if (this.currentUserRole == this.userType.User|| this.currentUserRole == this.userType.Auditor) {
    if (this.currentUserId == this.auditForm.controls['auditedBy'].value) {
      this.auditForm.controls.auditDate.setValue(formatDate(data.auditDate ? data.auditDate : new Date(), 'yyyy-MM-dd', 'en'));
      this.auditForm.controls['auditDate'].setValidators(Validators.required);
    }
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

  private setValidation() {
    this.auditForm.controls['auditDate'].setValidators(Validators.required);
    this.auditForm.controls['auditDate'].updateValueAndValidity();
    this.auditForm.controls['signoffBy'].setValidators(Validators.required);
    this.auditForm.controls['signoffBy'].updateValueAndValidity();
    if ((<FormArray>this.auditForm.get('medicationStockRecords')).length == 0) {
      this.addStockButtonClick();
    }
  }

  private removeValidation() {
    this.auditForm.controls['auditDate'].clearValidators();
    this.auditForm.controls['auditDate'].updateValueAndValidity();
    this.auditForm.controls['signoffBy'].clearValidators();
    this.auditForm.controls['signoffBy'].updateValueAndValidity();

    (<FormArray>this.auditForm.get('medicationStockRecords')).clear();
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
