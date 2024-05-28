import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormSevenService } from 'src/app/services/form-seven.service';
import { LocationServices } from 'src/app/services/location.service';
import { PatientService } from 'src/app/services/patient.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { RiskEntry } from 'src/app/shared/enums/risk-entry.enum';
import { AuditFormSeven } from 'src/app/shared/models/audit-form-seven';
import { Location } from 'src/app/shared/models/location';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { RecordFilterParameter } from 'src/app/shared/models/RecordFilterParameter';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/util/Constants';

@Component({
  selector: 'app-form-seven',
  templateUrl: './form-seven.component.html',
  styleUrls: ['./form-seven.component.scss'],
})
export class FormSevenComponent extends BaseComponent implements OnInit {
  @Output() getForms: EventEmitter<any> = new EventEmitter<any>();

  public locationList: Array<Location> = [];
  public userList: Array<User> = [];
  public allUserList: Array<User> = [];
  public patientsList: Array<PatientAdmission> = [];
  public auditForm: FormGroup;
  public riskAction = RiskEntry;
  public isEdit: boolean = false;
  public isFilling: boolean = false;
  public createForm: boolean = false;

  constructor(private locationService: LocationServices,private userService: UserService,private patientService: PatientService,private formsevenService: FormSevenService,private fb: FormBuilder,private route: ActivatedRoute,private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.getLocations();
    this.getAllUsers();
    this.getPatients();
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.getFormSeven(this.route.snapshot.params['id']);
    } else {
      this.auditForm = this.fb.group({
        id: [0],
        auditDate: [null],
        auditedBy: [null, Validators.required],
        exerciseScenario: [null],

        alarmActivatedTime: ['0.01'],
        alarmActivatedComment: [null, Validators.maxLength(200)],
        staffResponseTime: ['0.01'],
        staffResponseComment: [null, Validators.maxLength(200)],
        verifiesEmergencyTime: ['0.01'],
        verifiesEmergencyComment: [null, Validators.maxLength(200)],
        emergencyServiceTime: ['0.01'],
        emergencyServiceComment: [null, Validators.maxLength(200)],
        evacuationBeginsTime: ['0.01'],
        evacuationBeginsComment: [null, Validators.maxLength(200)],
        checkAllAreasTime: ['0.01'],
        checkAllAreasComment: [null, Validators.maxLength(200)],
        arriveAssemblyAreaTime: ['0.01'],
        arriveAssemblyAreaComment: [null, Validators.maxLength(200)],
        staffCheckOccupantsTime: ['0.01'],
        staffCheckOccupantsComment: [null, Validators.maxLength(200)],
        reportEmergencyServicesTime: ['0.01'],
        reportEmergencyServicesComment: [null, Validators.maxLength(200)],
        exerciseCompletedTime: ['0.01'],
        exerciseCompletedComment: [null, Validators.maxLength(200)],
        totalEvacuationTime: ['0.10'],

        wasAlaramActivated: [RiskEntry.No],
        wasAlaramActivatedComments: [null, Validators.maxLength(5000)],
        staffFollowAppropriateEmergencyProcedures: [RiskEntry.No],
        staffFollowAppropriateEmergencyProceduresComments: [
          null,
          Validators.maxLength(5000),
        ],
        wasEmergencyConfined: [RiskEntry.No],
        wasEmergencyConfinedComments: [null, Validators.maxLength(5000)],
        emergencyServicesNotified: [RiskEntry.No],
        emergencyServicesNotifiedComments: [null, Validators.maxLength(5000)],
        areasOfHouseSearched: [RiskEntry.No],
        areasOfHouseSearchedComments: [null, Validators.maxLength(5000)],
        staffAppropriateIdentification: [RiskEntry.No],
        staffAppropriateIdentificationComments: [
          null,
          Validators.maxLength(5000),
        ],
        evacuationOfOccupants: [RiskEntry.No],
        evacuationOfOccupantsComments: [null, Validators.maxLength(5000)],
        mobilityImpairedPersons: [RiskEntry.No],
        mobilityImpairedPersonsComments: [null, Validators.maxLength(5000)],
        anyoneRefuseToFollow: [RiskEntry.No],
        anyoneRefuseToFollowComments: [null, Validators.maxLength(5000)],
        appropriateEvacuationRoute: [RiskEntry.No],
        appropriateEvacuationRouteComments: [null, Validators.maxLength(5000)],
        occupantsProceed: [RiskEntry.No],
        occupantsProceedComments: [null, Validators.maxLength(5000)],
        occupantsAccounted: [RiskEntry.No],
        occupantsAccountedComments: [null, Validators.maxLength(200)],
        didAnyoneReenter: [RiskEntry.No],
        didAnyoneReenterComments: [null, Validators.maxLength(5000)],
        didStaffPersonLiaise: [RiskEntry.No],
        didStaffPersonLiaiseComments: [null, Validators.maxLength(5000)],
        emergencyServicesReceive: [RiskEntry.No],
        emergencyServicesReceiveComments: [null, Validators.maxLength(5000)],

        additionalComments: [
          '',
          Validators.compose([
            Validators.maxLength(5000),
            Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,300}$"),
          ]),
        ],

        signoffBy: [null],
        isSignedOff: [false],
        locationId: [null, Validators.required],
        careHomeId: [careHomeId],
        createdBy: [this.currentUserId],
        createdAt: [new Date().toISOString()],
        // part A
        staffs: this.fb.array([this.addMoreStaff()]),
        // part B
        serviceUsers: this.fb.array([this.addMorePatinet()]),
        // part F
        debriefs: this.fb.array([this.addMoreDebrief()]),
      });
      this.completeForm();
    }
  }

  public removeStaff(i: number) {
    (<FormArray>this.auditForm.get('staffs')).removeAt(i);
    if (
      this.auditForm.controls['auditedBy'].value == this.currentUserId ||
      this.currentUserId == this.auditForm.controls['signoffBy'].value
    ) {
      if ((<FormArray>this.auditForm.get('staffs')).length == 0) {
        this.addMoreStaffClick();
      }
    }
  }

  public removePatient(i: number) {
    (<FormArray>this.auditForm.get('serviceUsers')).removeAt(i);
  
    if (
      this.auditForm.controls['auditedBy'].value == this.currentUserId ||
      this.currentUserId == this.auditForm.controls['signoffBy'].value
    ) {
      if ((<FormArray>this.auditForm.get('serviceUsers')).length == 0) {
        this.addMorePatientClick();
      }
    }
  }

  public removeDebrief(i: number) {
    (<FormArray>this.auditForm.get('debriefs')).removeAt(i);
    if (
      this.auditForm.controls['auditedBy'].value == this.currentUserId ||
      this.currentUserId == this.auditForm.controls['signoffBy'].value
    ) {
      if ((<FormArray>this.auditForm.get('debriefs')).length == 0) {
        this.addMoreDebriefClick();
      }
    }
  }

  public addMoreStaffClick(staff?: any): void {
    if (staff) {
      (<FormArray>this.auditForm.get('staffs')).push(this.addMoreStaff(staff));
    } else {
      (<FormArray>this.auditForm.get('staffs')).push(this.addMoreStaff());
    }
  }

  public addMorePatientClick(Patinet?: any): void {
    if (Patinet) {
      (<FormArray>this.auditForm.get('serviceUsers')).push(
        this.addMorePatinet(Patinet)
      );
    } else {
      (<FormArray>this.auditForm.get('serviceUsers')).push(
        this.addMorePatinet()
      );
    }
  }

  public addMoreDebriefClick(debrief?: any): void {
    if (debrief) {
      (<FormArray>this.auditForm.get('debriefs')).push(
        this.addMoreDebrief(debrief)
      );
    } else {
      (<FormArray>this.auditForm.get('debriefs')).push(this.addMoreDebrief());
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
        if ((<FormArray>this.auditForm.get('staffs')).length == 0) {
          this.addMoreStaffClick();
        }
        if ((<FormArray>this.auditForm.get('serviceUsers')).length == 0) {
          this.addMorePatientClick();
        }
        if ((<FormArray>this.auditForm.get('debriefs')).length == 0) {
          this.addMoreDebriefClick();
        }
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
        (<FormArray>this.auditForm.get('staffs')).clear();
        (<FormArray>this.auditForm.get('serviceUsers')).clear();
        (<FormArray>this.auditForm.get('debriefs')).clear();
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
      (<FormArray>this.auditForm.get('staffs')).clear();
      (<FormArray>this.auditForm.get('serviceUsers')).clear();
      (<FormArray>this.auditForm.get('debriefs')).clear();
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
          let formSeven = new AuditFormSeven();
          formSeven.auditDate = new Date(
            new Date(this.auditForm.controls['auditDate'].value).setMonth(
              new Date(this.auditForm.controls['auditDate'].value).getMonth() +
              1
            )
          );
          formSeven.auditedBy = this.auditForm.controls['auditedBy'].value;
          formSeven.locationId = this.auditForm.controls['locationId'].value;
          formSeven.careHomeId = Number(
            JSON.parse(localStorage.getItem('_identity')).careHomeId
          );
          formSeven.createdAt = new Date();
          formSeven.createdBy = this.currentUserId;
          this.formsevenService.addForm(formSeven).subscribe();
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

  public totalTime() {
    var time1 = String(this.auditForm.controls['alarmActivatedTime'].value);
    var time2 = String(this.auditForm.controls['staffResponseTime'].value);
    var time3 = String(this.auditForm.controls['verifiesEmergencyTime'].value);
    var time4 = String(this.auditForm.controls['emergencyServiceTime'].value);
    var time5 = String(this.auditForm.controls['evacuationBeginsTime'].value);
    var time6 = String(this.auditForm.controls['checkAllAreasTime'].value);
    var time7 = String(this.auditForm.controls['arriveAssemblyAreaTime'].value);
    var time8 = String(this.auditForm.controls['staffCheckOccupantsTime'].value);
    var time9 = String(this.auditForm.controls['reportEmergencyServicesTime'].value);
    var time10 = String(this.auditForm.controls['exerciseCompletedTime'].value);

    var minute = 0;
    var second = 0;

    var splitTime1 = time1.split('.');
    var splitTime2 = time2.split('.');
    var splitTime3 = time3.split('.');
    var splitTime4 = time4.split('.');
    var splitTime5 = time5.split('.');
    var splitTime6 = time6.split('.');
    var splitTime7 = time7.split('.');
    var splitTime8 = time8.split('.');
    var splitTime9 = time9.split('.');
    var splitTime10 = time10.split('.');

    // minute = (parseInt(splitTime1[0]))+parseInt(splitTime2[0]);
    // second = (parseInt(splitTime1[1]))+parseInt(splitTime2[1]);

    minute = Number(
      parseInt(splitTime1[0]) +
      parseInt(splitTime2[0]) +
      parseInt(splitTime3[0]) +
      parseInt(splitTime4[0]) +
      parseInt(splitTime5[0]) +
      parseInt(splitTime6[0]) +
      parseInt(splitTime7[0]) +
      parseInt(splitTime8[0]) +
      parseInt(splitTime9[0]) +
      parseInt(splitTime10[0])
    );

    second = Number(
      parseInt(splitTime1[1]) +
      parseInt(splitTime2[1]) +
      parseInt(splitTime3[1]) +
      parseInt(splitTime4[1]) +
      parseInt(splitTime5[1]) +
      parseInt(splitTime6[1]) +
      parseInt(splitTime7[1]) +
      parseInt(splitTime8[1]) +
      parseInt(splitTime9[1]) +
      parseInt(splitTime10[1])
    );

    minute = minute + Math.ceil(second > 59 ? second / 60 : 0);
    minute = minute;
    second = second % 60;

    this.auditForm.controls['totalEvacuationTime'].setValue(minute + '.' + second);
    return minute + '.' + second;
  }

  private addMoreStaff(staff?: any): FormGroup {
    if (staff) {
      return this.fb.group({
        id: [staff.id],
        userId: [staff.userId, Validators.compose([Validators.required])],
        roleDuringExercise: [
          staff.roleDuringExercise,
          Validators.compose([
            Validators.maxLength(150),
            Validators.required,
            Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,150}$"),
          ]),
        ],
      });
    } else {
      return this.fb.group({
        id: [0],
        userId: [null, Validators.compose([Validators.required])],
        roleDuringExercise: [
          '',
          Validators.compose([
            Validators.maxLength(150),
            Validators.required,
            Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,150}$"),
          ]),
        ],
      });
    }
  }

  private addMorePatinet(patient?: any): FormGroup {
    if (patient) {
      return this.fb.group({
        id: [patient.id],
        patientId: [
          patient.patientId,
          Validators.compose([Validators.required]),
        ],
        observedResponse: [
          patient.observedResponse,
          Validators.compose([
            Validators.maxLength(150),
            Validators.required,
            Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,150}$"),
          ]),
        ],
      });
    } else {
      return this.fb.group({
        id: [0],
        patientId: [null, Validators.compose([Validators.required])],
        observedResponse: [
          '',
          Validators.compose([
            Validators.maxLength(150),
            Validators.required,
            Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,150}$"),
          ]),
        ],
      });
    }
  }

  private addMoreDebrief(debrief?: any): FormGroup {
    if (debrief) {
      return this.fb.group({
        id: [debrief.id],
        difficultiesObserved: [
          debrief.difficultiesObserved,
          Validators.compose([Validators.required]),
        ],
        furtherImprovement: [
          debrief.furtherImprovement,
          Validators.compose([
            Validators.maxLength(150),
            Validators.required,
            Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,150}$"),
          ]),
        ],
      });
    } else {
      return this.fb.group({
        id: [0],
        difficultiesObserved: [
          null,
          Validators.compose([
            Validators.maxLength(150),
            Validators.required,
            Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,150}$"),
          ]),
        ],
        furtherImprovement: [
          '',
          Validators.compose([
            Validators.maxLength(150),
            Validators.required,
            Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,150}$"),
          ]),
        ],
      });
    }
  }

  private addForm() {
    this.SetLoading(true);
    this.formsevenService.addForm(this.auditForm.value).subscribe(
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
    this.formsevenService.updateForm(this.auditForm.value).subscribe(
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

  private getPatients() {
    this.SetLoading(true);
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    let records = new RecordFilterParameter();
    records.paginate = false;

    this.patientService.getAllPatients(records, careHomeId).subscribe(
      (response) => {
        if (response) {
          this.patientsList = response.items;
        }
        this.SetLoading(false);
      },
      (err) => {
        this.SetLoading(false);
        console.error('could not fetch users::' + err.error);
      }
    );
  }

  private getFormSeven(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formsevenService.getForm(id).subscribe(
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

  private setValidation() {
    this.auditForm.controls['auditDate'].setValidators(Validators.required);
    this.auditForm.controls['auditDate'].updateValueAndValidity();
    this.auditForm.controls['signoffBy'].setValidators(Validators.required);
    this.auditForm.controls['signoffBy'].updateValueAndValidity();

    this.auditForm.controls['additionalComments'].setValidators(
      Validators.compose([
        Validators.maxLength(5000),
        Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,300}$"),
      ])
    );
    this.auditForm.controls['additionalComments'].updateValueAndValidity();

    this.auditForm.controls['exerciseScenario'].setValidators(
      Validators.required
    );
    this.auditForm.controls['exerciseScenario'].updateValueAndValidity();

    this.auditForm.controls['alarmActivatedTime'].setValue('0.01');
    this.auditForm.controls['alarmActivatedTime'].setValidators(
      Validators.compose([
        Validators.required,
        Validators.min(0.01),
        Validators.pattern('^[0-9]{1,3}[.]{1}[0-5]{1}[0-9]{1}$'),
      ])
    );
    this.auditForm.controls['alarmActivatedTime'].updateValueAndValidity();
    this.auditForm.controls['alarmActivatedComment'].setValidators(
      Validators.maxLength(200)
    );
    this.auditForm.controls['alarmActivatedComment'].updateValueAndValidity();
    this.auditForm.controls['staffResponseTime'].setValue('0.01');
    this.auditForm.controls['staffResponseTime'].setValidators(
      Validators.compose([
        Validators.required,
        Validators.min(0.01),
        Validators.pattern('^[0-9]{1,3}[.]{1}[0-5]{1}[0-9]{1}$'),
      ])
    );
    this.auditForm.controls['staffResponseTime'].updateValueAndValidity();
    this.auditForm.controls['staffResponseComment'].setValidators(
      Validators.maxLength(200)
    );
    this.auditForm.controls['staffResponseComment'].updateValueAndValidity();
    this.auditForm.controls['verifiesEmergencyTime'].setValue('0.01');
    this.auditForm.controls['verifiesEmergencyTime'].setValidators(
      Validators.compose([
        Validators.required,
        Validators.min(0.01),
        Validators.pattern('^[0-9]{1,3}[.]{1}[0-5]{1}[0-9]{1}$'),
      ])
    );
    this.auditForm.controls['verifiesEmergencyTime'].updateValueAndValidity();
    this.auditForm.controls['verifiesEmergencyComment'].setValidators(
      Validators.maxLength(200)
    );
    this.auditForm.controls[
      'verifiesEmergencyComment'
    ].updateValueAndValidity();
    this.auditForm.controls['emergencyServiceTime'].setValue('0.01');
    this.auditForm.controls['emergencyServiceTime'].setValidators(
      Validators.compose([
        Validators.required,
        Validators.min(0.01),
        Validators.pattern('^[0-9]{1,3}[.]{1}[0-5]{1}[0-9]{1}$'),
      ])
    );
    this.auditForm.controls['emergencyServiceTime'].updateValueAndValidity();
    this.auditForm.controls['emergencyServiceComment'].setValidators(
      Validators.maxLength(200)
    );
    this.auditForm.controls['emergencyServiceComment'].updateValueAndValidity();
    this.auditForm.controls['evacuationBeginsTime'].setValue('0.01');
    this.auditForm.controls['evacuationBeginsTime'].setValidators(
      Validators.compose([
        Validators.required,
        Validators.min(0.01),
        Validators.pattern('^[0-9]{1,3}[.]{1}[0-5]{1}[0-9]{1}$'),
      ])
    );
    this.auditForm.controls['evacuationBeginsTime'].updateValueAndValidity();
    this.auditForm.controls['evacuationBeginsComment'].setValidators(
      Validators.maxLength(200)
    );
    this.auditForm.controls['evacuationBeginsComment'].updateValueAndValidity();
    this.auditForm.controls['checkAllAreasTime'].setValue('0.01');
    this.auditForm.controls['checkAllAreasTime'].setValidators(
      Validators.compose([
        Validators.required,
        Validators.min(0.01),
        Validators.pattern('^[0-9]{1,3}[.]{1}[0-5]{1}[0-9]{1}$'),
      ])
    );
    this.auditForm.controls['checkAllAreasTime'].updateValueAndValidity();
    this.auditForm.controls['checkAllAreasComment'].setValidators(
      Validators.maxLength(200)
    );
    this.auditForm.controls['checkAllAreasComment'].updateValueAndValidity();
    this.auditForm.controls['arriveAssemblyAreaTime'].setValue('0.01');
    this.auditForm.controls['arriveAssemblyAreaTime'].setValidators(
      Validators.compose([
        Validators.required,
        Validators.min(0.01),
        Validators.pattern('^[0-9]{1,3}[.]{1}[0-5]{1}[0-9]{1}$'),
      ])
    );
    this.auditForm.controls['arriveAssemblyAreaTime'].updateValueAndValidity();
    this.auditForm.controls['arriveAssemblyAreaComment'].setValidators(
      Validators.maxLength(200)
    );
    this.auditForm.controls[
      'arriveAssemblyAreaComment'
    ].updateValueAndValidity();
    this.auditForm.controls['staffCheckOccupantsTime'].setValue('0.01');
    this.auditForm.controls['staffCheckOccupantsTime'].setValidators(
      Validators.compose([
        Validators.required,
        Validators.min(0.01),
        Validators.pattern('^[0-9]{1,3}[.]{1}[0-5]{1}[0-9]{1}$'),
      ])
    );
    this.auditForm.controls['staffCheckOccupantsTime'].updateValueAndValidity();
    this.auditForm.controls['staffCheckOccupantsComment'].setValidators(
      Validators.maxLength(200)
    );
    this.auditForm.controls[
      'staffCheckOccupantsComment'
    ].updateValueAndValidity();
    this.auditForm.controls['reportEmergencyServicesTime'].setValue('0.01');
    this.auditForm.controls['reportEmergencyServicesTime'].setValidators(
      Validators.compose([
        Validators.required,
        Validators.min(0.01),
        Validators.pattern('^[0-9]{1,3}[.]{1}[0-5]{1}[0-9]{1}$'),
      ])
    );
    this.auditForm.controls[
      'reportEmergencyServicesTime'
    ].updateValueAndValidity();
    this.auditForm.controls['reportEmergencyServicesComment'].setValidators(
      Validators.maxLength(200)
    );
    this.auditForm.controls[
      'reportEmergencyServicesComment'
    ].updateValueAndValidity();
    this.auditForm.controls['exerciseCompletedTime'].setValue('0.01');
    this.auditForm.controls['exerciseCompletedTime'].setValidators(
      Validators.compose([
        Validators.required,
        Validators.min(0.01),
        Validators.pattern('^[0-9]{1,3}[.]{1}[0-5]{1}[0-9]{1}$'),
      ])
    );
    this.auditForm.controls['exerciseCompletedTime'].updateValueAndValidity();
    this.auditForm.controls['exerciseCompletedComment'].setValidators(
      Validators.maxLength(200)
    );
    this.auditForm.controls[
      'exerciseCompletedComment'
    ].updateValueAndValidity();
    this.auditForm.controls['totalEvacuationTime'].setValidators(
      Validators.required
    );
    this.auditForm.controls['totalEvacuationTime'].updateValueAndValidity();

    this.auditForm.controls['wasAlaramActivated'].setValidators(
      Validators.required
    );
    this.auditForm.controls['wasAlaramActivated'].updateValueAndValidity();
    this.auditForm.controls['wasAlaramActivatedComments'].setValidators(
      Validators.maxLength(5000)
    );
    this.auditForm.controls[
      'wasAlaramActivatedComments'
    ].updateValueAndValidity();
    this.auditForm.controls[
      'staffFollowAppropriateEmergencyProcedures'
    ].setValidators(Validators.required);
    this.auditForm.controls[
      'staffFollowAppropriateEmergencyProcedures'
    ].updateValueAndValidity();
    this.auditForm.controls[
      'staffFollowAppropriateEmergencyProceduresComments'
    ].setValidators(Validators.maxLength(5000));
    this.auditForm.controls[
      'staffFollowAppropriateEmergencyProceduresComments'
    ].updateValueAndValidity();
    this.auditForm.controls['wasEmergencyConfined'].setValidators(
      Validators.required
    );
    this.auditForm.controls['wasEmergencyConfined'].updateValueAndValidity();
    this.auditForm.controls['wasEmergencyConfinedComments'].setValidators(
      Validators.maxLength(5000)
    );
    this.auditForm.controls[
      'wasEmergencyConfinedComments'
    ].updateValueAndValidity();
    this.auditForm.controls['emergencyServicesNotified'].setValidators(
      Validators.required
    );
    this.auditForm.controls[
      'emergencyServicesNotified'
    ].updateValueAndValidity();
    this.auditForm.controls['emergencyServicesNotifiedComments'].setValidators(
      Validators.maxLength(5000)
    );
    this.auditForm.controls[
      'emergencyServicesNotifiedComments'
    ].updateValueAndValidity();
    this.auditForm.controls['areasOfHouseSearched'].setValidators(
      Validators.required
    );
    this.auditForm.controls['areasOfHouseSearched'].updateValueAndValidity();
    this.auditForm.controls['areasOfHouseSearchedComments'].setValidators(
      Validators.maxLength(5000)
    );
    this.auditForm.controls[
      'areasOfHouseSearchedComments'
    ].updateValueAndValidity();
    this.auditForm.controls['staffAppropriateIdentification'].setValidators(
      Validators.required
    );
    this.auditForm.controls[
      'staffAppropriateIdentification'
    ].updateValueAndValidity();
    this.auditForm.controls[
      'staffAppropriateIdentificationComments'
    ].setValidators(Validators.maxLength(5000));
    this.auditForm.controls[
      'staffAppropriateIdentificationComments'
    ].updateValueAndValidity();
    this.auditForm.controls['evacuationOfOccupants'].setValidators(
      Validators.required
    );
    this.auditForm.controls['evacuationOfOccupants'].updateValueAndValidity();
    this.auditForm.controls['evacuationOfOccupantsComments'].setValidators(
      Validators.maxLength(5000)
    );
    this.auditForm.controls[
      'evacuationOfOccupantsComments'
    ].updateValueAndValidity();
    this.auditForm.controls['mobilityImpairedPersons'].setValidators(
      Validators.required
    );
    this.auditForm.controls['mobilityImpairedPersons'].updateValueAndValidity();
    this.auditForm.controls['mobilityImpairedPersonsComments'].setValidators(
      Validators.maxLength(5000)
    );
    this.auditForm.controls[
      'mobilityImpairedPersonsComments'
    ].updateValueAndValidity();
    this.auditForm.controls['anyoneRefuseToFollow'].setValidators(
      Validators.required
    );
    this.auditForm.controls['anyoneRefuseToFollow'].updateValueAndValidity();
    this.auditForm.controls['anyoneRefuseToFollowComments'].setValidators(
      Validators.maxLength(5000)
    );
    this.auditForm.controls[
      'anyoneRefuseToFollowComments'
    ].updateValueAndValidity();
    this.auditForm.controls['appropriateEvacuationRoute'].setValidators(
      Validators.required
    );
    this.auditForm.controls[
      'appropriateEvacuationRoute'
    ].updateValueAndValidity();
    this.auditForm.controls['appropriateEvacuationRouteComments'].setValidators(
      Validators.maxLength(5000)
    );
    this.auditForm.controls[
      'appropriateEvacuationRouteComments'
    ].updateValueAndValidity();
    this.auditForm.controls['occupantsProceed'].setValidators(
      Validators.required
    );
    this.auditForm.controls['occupantsProceed'].updateValueAndValidity();
    this.auditForm.controls['occupantsProceedComments'].setValidators(
      Validators.maxLength(5000)
    );
    this.auditForm.controls[
      'occupantsProceedComments'
    ].updateValueAndValidity();
    this.auditForm.controls['occupantsAccounted'].setValidators(
      Validators.required
    );
    this.auditForm.controls['occupantsAccounted'].updateValueAndValidity();
    this.auditForm.controls['occupantsAccountedComments'].setValidators(
      Validators.maxLength(200)
    );
    this.auditForm.controls[
      'occupantsAccountedComments'
    ].updateValueAndValidity();
    this.auditForm.controls['didAnyoneReenter'].setValidators(
      Validators.required
    );
    this.auditForm.controls['didAnyoneReenter'].updateValueAndValidity();
    this.auditForm.controls['didAnyoneReenterComments'].setValidators(
      Validators.maxLength(5000)
    );
    this.auditForm.controls[
      'didAnyoneReenterComments'
    ].updateValueAndValidity();
    this.auditForm.controls['didStaffPersonLiaise'].setValidators(
      Validators.required
    );
    this.auditForm.controls['didStaffPersonLiaise'].updateValueAndValidity();
    this.auditForm.controls['didStaffPersonLiaiseComments'].setValidators(
      Validators.maxLength(5000)
    );
    this.auditForm.controls[
      'didStaffPersonLiaiseComments'
    ].updateValueAndValidity();
    this.auditForm.controls['emergencyServicesReceive'].setValidators(
      Validators.required
    );
    this.auditForm.controls[
      'emergencyServicesReceive'
    ].updateValueAndValidity();
    this.auditForm.controls['emergencyServicesReceiveComments'].setValidators(
      Validators.maxLength(5000)
    );
    this.auditForm.controls[
      'emergencyServicesReceiveComments'
    ].updateValueAndValidity();
  }

  private removeValidation() {
    this.auditForm.controls['auditDate'].clearValidators();
    this.auditForm.controls['auditDate'].updateValueAndValidity();
    this.auditForm.controls['signoffBy'].clearValidators();
    this.auditForm.controls['signoffBy'].updateValueAndValidity();

    this.auditForm.controls['exerciseScenario'].clearValidators();
    this.auditForm.controls['exerciseScenario'].updateValueAndValidity();

    // this.auditForm.controls['alarmActivatedTime'].setValue(null);
    this.auditForm.controls['alarmActivatedTime'].clearValidators();
    this.auditForm.controls['alarmActivatedTime'].updateValueAndValidity();
    // this.auditForm.controls['staffResponseTime'].setValue(null);
    this.auditForm.controls['staffResponseTime'].clearValidators();
    this.auditForm.controls['staffResponseTime'].updateValueAndValidity();
    // this.auditForm.controls['verifiesEmergencyTime'].setValue(null);
    this.auditForm.controls['verifiesEmergencyTime'].clearValidators();
    this.auditForm.controls['verifiesEmergencyTime'].updateValueAndValidity();
    // this.auditForm.controls['emergencyServiceTime'].setValue(null);
    this.auditForm.controls['emergencyServiceTime'].clearValidators();
    this.auditForm.controls['emergencyServiceTime'].updateValueAndValidity();
    // this.auditForm.controls['evacuationBeginsTime'].setValue(null);
    this.auditForm.controls['evacuationBeginsTime'].clearValidators();
    this.auditForm.controls['evacuationBeginsTime'].updateValueAndValidity();
    // this.auditForm.controls['checkAllAreasTime'].setValue(null);
    this.auditForm.controls['checkAllAreasTime'].clearValidators();
    this.auditForm.controls['checkAllAreasTime'].updateValueAndValidity();
    // this.auditForm.controls['arriveAssemblyAreaTime'].setValue(null);
    this.auditForm.controls['arriveAssemblyAreaTime'].clearValidators();
    this.auditForm.controls['arriveAssemblyAreaTime'].updateValueAndValidity();
    // this.auditForm.controls['staffCheckOccupantsTime'].setValue(null);
    this.auditForm.controls['staffCheckOccupantsTime'].clearValidators();
    this.auditForm.controls['staffCheckOccupantsTime'].updateValueAndValidity();
    // this.auditForm.controls['reportEmergencyServicesTime'].setValue(null);
    this.auditForm.controls['reportEmergencyServicesTime'].clearValidators();
    this.auditForm.controls[
      'reportEmergencyServicesTime'
    ].updateValueAndValidity();
    // this.auditForm.controls['exerciseCompletedTime'].setValue(null);
    this.auditForm.controls['exerciseCompletedTime'].clearValidators();
    this.auditForm.controls['exerciseCompletedTime'].updateValueAndValidity();
    this.auditForm.controls['exerciseCompletedComment'].setValidators(
      Validators.maxLength(200)
    );
    this.auditForm.controls[
      'exerciseCompletedComment'
    ].updateValueAndValidity();
    this.auditForm.controls['totalEvacuationTime'].clearValidators();
    this.auditForm.controls['totalEvacuationTime'].updateValueAndValidity();

    this.auditForm.controls['wasAlaramActivated'].clearValidators();
    this.auditForm.controls['wasAlaramActivated'].updateValueAndValidity();
    this.auditForm.controls[
      'staffFollowAppropriateEmergencyProcedures'
    ].clearValidators();
    this.auditForm.controls[
      'staffFollowAppropriateEmergencyProcedures'
    ].updateValueAndValidity();
    this.auditForm.controls['wasEmergencyConfined'].clearValidators();
    this.auditForm.controls['wasEmergencyConfined'].updateValueAndValidity();
    this.auditForm.controls['emergencyServicesNotified'].clearValidators();
    this.auditForm.controls[
      'emergencyServicesNotified'
    ].updateValueAndValidity();
    this.auditForm.controls['areasOfHouseSearched'].clearValidators();
    this.auditForm.controls['areasOfHouseSearched'].updateValueAndValidity();
    this.auditForm.controls['staffAppropriateIdentification'].clearValidators();
    this.auditForm.controls[
      'staffAppropriateIdentification'
    ].updateValueAndValidity();
    this.auditForm.controls['evacuationOfOccupants'].clearValidators();
    this.auditForm.controls['evacuationOfOccupants'].updateValueAndValidity();
    this.auditForm.controls['mobilityImpairedPersons'].clearValidators();
    this.auditForm.controls['mobilityImpairedPersons'].updateValueAndValidity();
    this.auditForm.controls['anyoneRefuseToFollow'].clearValidators();
    this.auditForm.controls['anyoneRefuseToFollow'].updateValueAndValidity();
    this.auditForm.controls['appropriateEvacuationRoute'].clearValidators();
    this.auditForm.controls[
      'appropriateEvacuationRoute'
    ].updateValueAndValidity();
    this.auditForm.controls['occupantsProceed'].clearValidators();
    this.auditForm.controls['occupantsProceed'].updateValueAndValidity();
    this.auditForm.controls['occupantsAccounted'].clearValidators();
    this.auditForm.controls['occupantsAccounted'].updateValueAndValidity();
    this.auditForm.controls['didAnyoneReenter'].clearValidators();
    this.auditForm.controls['didAnyoneReenter'].updateValueAndValidity();
    this.auditForm.controls['didStaffPersonLiaise'].clearValidators();
    this.auditForm.controls['didStaffPersonLiaise'].updateValueAndValidity();
    this.auditForm.controls['emergencyServicesReceive'].clearValidators();
    this.auditForm.controls[
      'emergencyServicesReceive'
    ].updateValueAndValidity();
  }

  private setFormValue(formSevenValue: AuditFormSeven) {
    this.auditForm = this.fb.group({
      id: [formSevenValue.id],
      auditDate: [formSevenValue.auditDate],
      auditedBy: [formSevenValue.auditedBy, Validators.required],
      exerciseScenario: [formSevenValue.exerciseScenario, Validators.maxLength(5000)],

      alarmActivatedTime: [formSevenValue.alarmActivatedTime],
      alarmActivatedComment: [
        formSevenValue.alarmActivatedComment,
        Validators.maxLength(250),
      ],
      staffResponseTime: [formSevenValue.staffResponseTime],
      staffResponseComment: [
        formSevenValue.staffResponseComment,
        Validators.maxLength(250),
      ],
      verifiesEmergencyTime: [formSevenValue.verifiesEmergencyTime],
      verifiesEmergencyComment: [
        formSevenValue.verifiesEmergencyComment,
        Validators.maxLength(250),
      ],
      emergencyServiceTime: [formSevenValue.emergencyServiceTime],
      emergencyServiceComment: [
        formSevenValue.emergencyServiceComment,
        Validators.maxLength(250),
      ],
      evacuationBeginsTime: [formSevenValue.evacuationBeginsTime],
      evacuationBeginsComment: [
        formSevenValue.evacuationBeginsComment,
        Validators.maxLength(250),
      ],
      checkAllAreasTime: [formSevenValue.checkAllAreasTime],
      checkAllAreasComment: [
        formSevenValue.checkAllAreasComment,
        Validators.maxLength(250),
      ],
      arriveAssemblyAreaTime: [formSevenValue.arriveAssemblyAreaTime],
      arriveAssemblyAreaComment: [
        formSevenValue.arriveAssemblyAreaComment,
        Validators.maxLength(250),
      ],
      staffCheckOccupantsTime: [formSevenValue.staffCheckOccupantsTime],
      staffCheckOccupantsComment: [
        formSevenValue.staffCheckOccupantsComment,
        Validators.maxLength(250),
      ],
      reportEmergencyServicesTime: [formSevenValue.reportEmergencyServicesTime],
      reportEmergencyServicesComment: [
        formSevenValue.reportEmergencyServicesComment,
        Validators.maxLength(250),
      ],
      exerciseCompletedTime: [formSevenValue.exerciseCompletedTime],
      exerciseCompletedComment: [
        formSevenValue.exerciseCompletedComment,
        Validators.maxLength(250),
      ],
      totalEvacuationTime: [formSevenValue.totalEvacuationTime],

      wasAlaramActivated: [
        formSevenValue.wasAlaramActivated,
        Validators.required,
      ],
      wasAlaramActivatedComments: [
        formSevenValue.wasAlaramActivatedComments,
        Validators.maxLength(5000),
      ],
      staffFollowAppropriateEmergencyProcedures: [
        formSevenValue.staffFollowAppropriateEmergencyProcedures,
        Validators.required,
      ],
      staffFollowAppropriateEmergencyProceduresComments: [
        formSevenValue.staffFollowAppropriateEmergencyProceduresComments,
        Validators.maxLength(5000),
      ],
      wasEmergencyConfined: [
        formSevenValue.wasEmergencyConfined,
        Validators.required,
      ],
      wasEmergencyConfinedComments: [
        formSevenValue.wasEmergencyConfinedComments,
        Validators.maxLength(5000),
      ],
      emergencyServicesNotified: [
        formSevenValue.emergencyServicesNotified,
        Validators.required,
      ],
      emergencyServicesNotifiedComments: [
        formSevenValue.emergencyServicesNotifiedComments,
        Validators.maxLength(5000),
      ],
      areasOfHouseSearched: [
        formSevenValue.areasOfHouseSearched,
        Validators.required,
      ],
      areasOfHouseSearchedComments: [
        formSevenValue.areasOfHouseSearchedComments,
        Validators.maxLength(5000),
      ],
      staffAppropriateIdentification: [
        formSevenValue.staffAppropriateIdentification,
        Validators.required,
      ],
      staffAppropriateIdentificationComments: [
        formSevenValue.staffAppropriateIdentificationComments,
        Validators.maxLength(5000),
      ],
      evacuationOfOccupants: [
        formSevenValue.evacuationOfOccupants,
        Validators.required,
      ],
      evacuationOfOccupantsComments: [
        formSevenValue.evacuationOfOccupantsComments,
        Validators.maxLength(5000),
      ],
      mobilityImpairedPersons: [
        formSevenValue.mobilityImpairedPersons,
        Validators.required,
      ],
      mobilityImpairedPersonsComments: [
        formSevenValue.mobilityImpairedPersonsComments,
        Validators.maxLength(5000),
      ],
      anyoneRefuseToFollow: [
        formSevenValue.anyoneRefuseToFollow,
        Validators.required,
      ],
      anyoneRefuseToFollowComments: [
        formSevenValue.anyoneRefuseToFollowComments,
        Validators.maxLength(5000),
      ],
      appropriateEvacuationRoute: [
        formSevenValue.appropriateEvacuationRoute,
        Validators.required,
      ],
      appropriateEvacuationRouteComments: [
        formSevenValue.appropriateEvacuationRouteComments,
        Validators.maxLength(5000),
      ],
      occupantsProceed: [formSevenValue.occupantsProceed, Validators.required],
      occupantsProceedComments: [
        formSevenValue.occupantsProceedComments,
        Validators.maxLength(5000),
      ],
      occupantsAccounted: [
        formSevenValue.occupantsAccounted,
        Validators.required,
      ],
      occupantsAccountedComments: [
        formSevenValue.occupantsAccountedComments,
        Validators.maxLength(250),
      ],
      didAnyoneReenter: [formSevenValue.didAnyoneReenter, Validators.required],
      didAnyoneReenterComments: [
        formSevenValue.didAnyoneReenterComments,
        Validators.maxLength(5000),
      ],
      didStaffPersonLiaise: [
        formSevenValue.didStaffPersonLiaise,
        Validators.required,
      ],
      didStaffPersonLiaiseComments: [
        formSevenValue.didStaffPersonLiaiseComments,
        Validators.maxLength(5000),
      ],
      emergencyServicesReceive: [
        formSevenValue.emergencyServicesReceive,
        Validators.required,
      ],
      emergencyServicesReceiveComments: [
        formSevenValue.emergencyServicesReceiveComments,
        Validators.maxLength(5000),
      ],

      additionalComments: [
        formSevenValue.additionalComments,
        Validators.compose([
          Validators.maxLength(5000),
          Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,300}$"),
        ]),
      ],
      signoffBy: [formSevenValue.signoffBy],
      isSignedOff: [formSevenValue.isSignedOff],
      locationId: [formSevenValue.locationId, Validators.required],
      careHomeId: [formSevenValue.careHomeId],
      createdBy: [formSevenValue.createdBy],
      createdAt: [formSevenValue.createdAt],
      updatedBy: [formSevenValue.createdBy],
      updatedAt: [new Date().toISOString()],
      // part A
      staffs: this.fb.array([]),
      // part B
      serviceUsers: this.fb.array([]),
      // part F
      debriefs: this.fb.array([]),
    });

    if (formSevenValue.staffs.length > 0) {
      formSevenValue.staffs.forEach((element) => {
        this.addMoreStaffClick(element);
      });
    }
    else {
      this.addMoreStaffClick();
    }
    if (formSevenValue.serviceUsers.length > 0) {
      formSevenValue.serviceUsers.forEach((element) => {
        this.addMorePatientClick(element);
      });
    }
    else {
      this.addMorePatientClick();
    }

    if (formSevenValue.debriefs.length > 0) {
      formSevenValue.debriefs.forEach((element) => {
        this.addMoreDebriefClick(element);
      });
    } else {
      this.addMoreDebriefClick();

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
