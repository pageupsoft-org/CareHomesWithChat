import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormTwoService } from 'src/app/services/form-two.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { Consequences } from 'src/app/shared/enums/consequences.enum';
import { IncidentOccurStage } from 'src/app/shared/enums/incident-occur-stage.enum';
import { IncidentTypeFormTwo } from 'src/app/shared/enums/incident-type-form-two.enum';
import { InjuriesType } from 'src/app/shared/enums/injuries-type.enum';
import { MedicationIncidentCodes } from 'src/app/shared/enums/medication-incident-codes.enum';
import { NatureOfActivity } from 'src/app/shared/enums/nature-of-activityts.enum';
import { OtherFactors } from 'src/app/shared/enums/other-factors.enum';
import { Status } from 'src/app/shared/enums/status.enum';
import { ViolentIncidents } from 'src/app/shared/enums/violent-incidents';
import { AuditFormTwo } from 'src/app/shared/models/audit-form-two';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/util/Constants';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-form-two',
  templateUrl: './form-two.component.html',
  styleUrls: ['./form-two.component.scss'],
})
export class FormTwoComponent extends BaseComponent implements OnInit {
  public locationList: Array<Location> = [];
  public userList: Array<User> = [];
  public adminList: Array<User> = [];

  public formPartA: FormGroup;
  public formPartB: FormGroup;
  public formPartC: FormGroup;
  public status: any;
  public incidentType: any;
  public incidentTypeEnum = IncidentTypeFormTwo;
  public volientIncidents: any;
  public volientIncidentsEnum = ViolentIncidents;
  public natureOfActivity: any;
  public natureOfActivityEnum = NatureOfActivity;
  public otherFactors: any;
  public otherFactorsEnum = OtherFactors;
  public injuryType: any;
  public injuryTypeEnum = InjuriesType;
  public consequencse: any;
  public consequencseEnum = Consequences;
  public incidentOccurStage: any;
  public incidentOccurStageEnum = IncidentOccurStage;
  public incidentCodes: any;
  public incidentCodesEnum = MedicationIncidentCodes;
  public isEdit: boolean = false;
  public isFilling: boolean = false;
  public createForm: boolean = false;
  public active: number = 1;
  public currentDate: Date = new Date();
  file: File = null; // Variable to store file
  private auditForm: AuditFormTwo;
  public selectedItems: User[] = [];
  fetchedUserList: string[] = [];
  public dropdownSettings: IDropdownSettings = {};

  showMin = true;
  showSec = true;

  constructor(
    private locationService: LocationServices,
    private userService: UserService,
    private formTwoService: FormTwoService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { super(); }

  ngOnInit(): void {

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'firstName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
    };

    this.getLocations();
    // this.getUsers();
    this.enumConvert();
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);

    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.getFormTwo(this.route.snapshot.params['id']);
    } else {
      this.formPartA = this.fb.group({
        id: [0],
        auditedBy: [null, Validators.required],
        signoffBy: [null],
        auditDate: [null],
        isSignedOff: [false],
        locationId: [null, Validators.required],
        careHomeId: [careHomeId],
        createdBy: [this.currentUserId],
        createdAt: [new Date().toISOString()],
        // part A

        fullName: ['', Validators.compose([Validators.required, Validators.maxLength(250), Validators.minLength(2), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,80}$")])],
        address: ['', Validators.compose([Validators.required, Validators.maxLength(250)])],
        postCode: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
        telephoneNumber: ['', Validators.compose([Validators.maxLength(11), Validators.pattern("^(\d)*$")])],
        signature: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(80), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,80}$")])],
        dateReported: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required],

        status: [Status.serviceUser, Validators.required],
        accidentPersonName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(250), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,80}$")])],
        accidentPersonAddress: ['', Validators.compose([Validators.required, Validators.maxLength(250)])],
        accidentPersonPostCode: ['', Validators.compose([Validators.maxLength(20)])],
        actionAtIncidentTime: ['', Validators.compose([Validators.maxLength(5000)])],

        incidentDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required],
        incidentLocation: [0, Validators.required],
        whatHappened: ['', Validators.compose([Validators.required, Validators.maxLength(5000)])],
        whatWasTheCause: ['', Validators.compose([Validators.maxLength(2000), Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,2000}$")])],
        isAnyInjuries: [false, Validators.required],
        immediateActionTaken: ['', Validators.compose([Validators.required, Validators.maxLength(5000)])],

        isAnyWitnesses: [false, Validators.required],
        witnesses: this.fb.array([this.addWitness()]),

        incidentType: [IncidentTypeFormTwo.HandlingOfObject, Validators.required],
        otherIncidentSpecify: ['', Validators.compose([Validators.maxLength(5000)])],

        violentIncidents: [ViolentIncidents.PhysicalAssault],
        natureOfActivity: [NatureOfActivity.SupportingAssisting],
        otherNatureActivitySpecify: ['', Validators.compose([Validators.maxLength(5000)])],
        otherFactors: [OtherFactors.CarerClientAlone],

        thirdPartyName: ['', Validators.compose([Validators.maxLength(80), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,80}$")])],
        thirdPartyAddress: ['', Validators.compose([Validators.maxLength(5000)])],
        thirdPartyPostCode: ['', Validators.compose([Validators.maxLength(20)])],
        thirdPartyStatus: [Status.serviceUser, Validators.required],
        injuryDetails: ['', Validators.compose([Validators.maxLength(5000)])],
        injuryType: [InjuriesType.CutAbrasion, Validators.required],
        injuryDetailsOtherSpecify: ['', Validators.compose([Validators.maxLength(5000)])],

        consequences: [Consequences.None, Validators.required],
        consequencesOtherSpecify: ['', Validators.compose([Validators.maxLength(5000)])],

        specifyInformedPerson: [''],

        nameOfDrug: ['', Validators.compose([Validators.maxLength(250), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,80}$")])],
        incidentOccurStage: [IncidentOccurStage.Prescribing, Validators.required],
        incidentOccurOtherSpecify: ['', Validators.compose([Validators.maxLength(5000)])],

        medicationIncidentCodes: [MedicationIncidentCodes.AdverseDrugReaction, Validators.required],
        medicationIncidentOtherSpecify: ['', Validators.compose([Validators.maxLength(5000)])],

        // new fields of accidental person
        accidentPersonDateOfBirth: ['', Validators.required],
        accidentPersonPhone: ['', Validators.compose([Validators.maxLength(11), Validators.pattern("^[0-9].{9,10}$")])],
        accidentPersonEmail: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')])],
        accidentPersonEmergencyName: ['', Validators.compose([Validators.required, Validators.maxLength(250), Validators.minLength(2), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,80}$")])],
        accidentPersonEmergencyRelationship: ['', Validators.compose([Validators.required, Validators.maxLength(250), Validators.minLength(2), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,80}$")])],
        accidentPersonEmergencyPhone: ['', Validators.compose([Validators.maxLength(11), Validators.pattern("^[0-9].{9,10}$")])],

        // new fields of incident details
        timeOfIncident: [null, Validators.required],
        incidentLocationSpecificArea: ['', Validators.compose([Validators.required, Validators.maxLength(250)])],

      });


      // part B
      this.formPartB = this.fb.group({
        doesRegulation: [true, Validators.required],
        cmhtInformed: [true, Validators.required],
        ccgInformed: [true, Validators.required],
        safeguardingAuthoritiesNotified: [true, Validators.required],
        policeinvolved: [true, Validators.required],
        incidentDocument: [''],
        incidentDocumentFileName: [],
        incidentDocumentAsBase64: [],
        riskScore: [1, Validators.compose([Validators.max(25), Validators.min(1), Validators.minLength(2)])],
        sendEmailUserIds: [[], Validators.required]
      });
      // part C
      this.formPartC = this.fb.group({
        immediateActionsTaken: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(5000)])],
        plannedFutureActions: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(5000)])],

        actionPlanDocument: [],
        actionPlanDocumentFileName: [],
        actionPlanDocumentAsBase64: [],

        isRIDDORReportable: [true, Validators.required],
        dateManagerCalled: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required],
      });
      if (this.currentUserRole == this.userType.User) {
        this.formPartA.controls['auditedBy'].setValue(this.currentUserId);
        this.formPartA.controls['auditedBy'].disable();
      }
      this.completeForm();
    }
  }

  public checkCallManager() {
    if (this.formPartC.controls['yesRIDDORReportable'].value) {
      this.formPartC.controls['dateManagerCalled'].setValue(new Date().toISOString());
    }
  }

  public completeForm(event?: any) {

    if (this.currentUserRole == this.userType.Admin) { // admin going to fill form
      this.formPartA.controls['auditDate'].setValue(new Date().toISOString());

      if (this.currentUserId == this.formPartA.controls['auditedBy'].value) {
        this.formPartA.controls['signoffBy'].setValue(this.currentUserId);
        this.formPartA.controls['signoffBy'].disable(); //disable sign off by and set current user id
        this.formPartA.controls['isSignedOff'].setValue(true);
        this.isFilling = true;
      }
      else {
        this.isFilling = false;
        this.formPartA.controls['signoffBy'].setValue(null);
        this.formPartA.controls['signoffBy'].enable();
        this.formPartA.controls['isSignedOff'].setValue(false);

      }
      this.setValidation();
    }

    else if (this.currentUserRole == this.userType.SuperUser) {
      this.formPartA.controls['auditDate'].setValue(new Date().toISOString());
      if (this.currentUserId == this.formPartA.controls['auditedBy'].value || this.currentUserId == this.formPartA.controls['signoffBy'].value) {
        this.formPartA.controls['isSignedOff'].setValue(false);
        this.isFilling = true;
      }
      else {
        this.isFilling = false;
      }
      this.setValidation();
    }

    else if (this.currentUserRole == this.userType.User) {
      this.formPartA.controls['auditDate'].setValue(new Date().toISOString());
      if (this.currentUserId == this.formPartA.controls['auditedBy'].value) {
        this.formPartA.controls['isSignedOff'].setValue(false);
        this.isFilling = true;
      }
      else {
        this.isFilling = false;
      }
      this.setValidation();
    }

    else if (this.currentUserId == this.formPartA.controls['signoffBy'].value && this.isEdit) {
      if (event) {
        this.isFilling = false;
        this.formPartA.controls['auditDate'].setValue(null);
        this.formPartA.controls['signoffBy'].setValue(null);
        this.formPartA.controls['isSignedOff'].setValue(false);
        this.formPartA.controls['signoffBy'].disable();
        this.removeValidation();
      } else {
        this.isFilling = true;
        this.formPartA.controls['isSignedOff'].setValue(true);
        this.formPartA.controls['signoffBy'].disable();
        this.setValidation();
      }
    }

    else {
      this.isFilling = false;
      this.formPartA.controls['auditDate'].setValue(null);
      this.formPartA.controls['signoffBy'].setValue(null);
      this.formPartA.controls['isSignedOff'].setValue(false);
      this.formPartA.controls['signoffBy'].disable();
      this.removeValidation();
    }
  }

  public addButtonWitness(witness?: any): void {
    if (witness) {
      (<FormArray>this.formPartA.get('witnesses')).push(
        this.addWitness(witness)
      );
    } else {
      (<FormArray>this.formPartA.get('witnesses')).push(this.addWitness());
    }
  }

  public remove(i: number) {
    (<FormArray>this.formPartA.get('witnesses')).removeAt(i);

  }

  public selectFile(event, formPart: string) {
    if (event.target && event.target.files.length > 0) {
      // if (formPart == 'C' && (this.currentUserRole == this.userType.User || this.currentUserRole == this.userType.Auditor)) {
      //   return alert("You don't have permission for this")
      // }
      if (formPart == 'C' && (this.currentUserRole == this.userType.Auditor)) {
        return alert("You don't have permission for this")
      }
      let file = event.target.files[0];
      if (file && (event.target.files[0].type.match('application/pdf') || event.target.files[0].type.match('application/msword'))) {
        this.file = file;
        //method to send the file path

        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event: any) => {
          if (formPart == 'B') {
            this.formPartB.controls['incidentDocumentFileName'].setValue(this.file.name);
            this.formPartB.controls['incidentDocumentAsBase64'].setValue(event.target.result)
          } else {
            this.formPartC.controls['actionPlanDocumentFileName'].setValue(this.file.name);
            this.formPartC.controls['actionPlanDocumentAsBase64'].setValue(event.target.result)
          }
        };
      } else {
        alert('support only .PDF and .docs files');
        return false;
      }
    }
  }

  public onTabChange(index) {
    this.active = index;
  }

  public goBack() {
    if (this.route.snapshot.queryParams["fromDashboard"]) {
      this.router.navigate([Constants.routes.dashboard()]);
    }
    else
      window.history.back();
  }

//   private setIncidentOfTime() {
//     let rawTimeValue = this.formPartA.value.timeOfIncident; // 'HH:MM' string
//     let [hours, minutes] = rawTimeValue.split(':').map(Number);
//     this.formPartA.controls['timeOfIncident'].setValue({ hours, minutes });
// }

  public onSubmit() {

    // console.log(this.formPartA.value);
    // return;
    this.SetLoading(true);

      // Format the timeOfIncident before merging forms
      const formattedTime = this.getFormattedTime();
      this.formPartA.controls['timeOfIncident'].setValue(formattedTime);

    this.formPartA.controls['auditedBy'].enable();
    if (this.currentUserId == this.formPartA.controls['auditedBy'].value || this.currentUserRole == this.userType.SuperUser || this.currentUserRole == this.userType.Admin) {
      if (Number(this.currentUserId) == Number(this.formPartA.controls['signoffBy'].value)) {
        this.formPartA.controls['isSignedOff'].setValue(true);
        this.formPartA.controls['signoffBy'].enable();
        ///
        // if admin/super user want to create a form for next referal date automatically.
        if (this.createForm) {
          let formTwo = new AuditFormTwo();
          formTwo.auditDate = new Date(new Date(this.formPartA.controls['auditDate'].value).setMonth(new Date(this.formPartA.controls['auditDate'].value).getMonth() + 1));
          formTwo.auditedBy = this.formPartA.controls['auditedBy'].value;
          formTwo.locationId = this.formPartA.controls['locationId'].value;
          formTwo.careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
          formTwo.createdAt = new Date();
          formTwo.createdBy = this.currentUserId;
          this.formTwoService.addForm(formTwo).subscribe();
        }
      }

      ///
      // to merge all forms in a single entity.
      this.auditForm = new AuditFormTwo();
      this.auditForm = {
        ...this.formPartA.value,
        ...this.formPartB.value,
        ...this.formPartC.value,
      }
      if (this.isEdit) {
        // if (this.route.snapshot.params['id']) {
        this.updateForm();
      } else {
        this.addForm();
      }
    }
  }

  private addForm() {
    this.SetLoading(true);
    this.formTwoService.addForm(this.auditForm).subscribe((response) => {
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
    if (this.formPartA.controls['signoffBy'].value == this.currentUserId) {
      message = 'Updated and signed off successfully';
    }
    this.formTwoService.updateForm(this.auditForm).subscribe((response) => {
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

  private addWitness(witness?: any): FormGroup {
    if (witness) {
      return this.fb.group({
        id: [witness.id],
        witnessFullName: [witness.witnessFullName,
        Validators.compose([
          Validators.maxLength(250)
        ]),
        ],
        witnessAddress: [
          witness.witnessAddress,
          Validators.compose([
            Validators.maxLength(5000)
          ]),
        ],
        witnessPostCode: [witness.witnessPostCode],
        witnessTelephoneNumber: [
          witness.witnessTelephoneNumber,
          Validators.compose([Validators.maxLength(11), Validators.pattern("^(\d)*$")]),
        ],
        witnessStatus: [witness.witnessStatus, Validators.required],
        attachStatement: [
          witness.attachStatement,
          Validators.compose([
            Validators.maxLength(5000)
          ]),
        ],
      });
    } else {
      return this.fb.group({
        id: [0],
        witnessFullName: [
          '',
          Validators.compose([
            Validators.maxLength(250),
            Validators.pattern('^[a-zA-Z][a-zA-Z ]{1,60}$'),
          ]),
        ],
        witnessAddress: [
          '',
          Validators.compose([
            Validators.maxLength(5000)
          ]),
        ],
        witnessPostCode: [''],
        witnessTelephoneNumber: [
          '',
          Validators.compose([
            Validators.pattern('^[0-9].{9,10}$'),
          ]),
        ],
        witnessStatus: [Status.serviceUser],
        attachStatement: [
          '',
          Validators.compose([
            Validators.maxLength(300),
            Validators.pattern('^[a-zA-Z][a-zA-Z ]{1,300}$'),
          ]),
        ],
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

  public getUsers(formTwoRes: any, isSetForm: boolean, locationId?: number) {
    // There are two way to get locationId, first is to get directly from "locationId" or from getting it from the object
    const selectedLocationId = locationId || formTwoRes?.locationId;
    if (selectedLocationId) {
      this.SetLoading(true);
      let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
      this.userService.getByLocation(selectedLocationId, careHomeId).subscribe((response) => {
        if (response) {
          // this.userList = response.filter((x) => x.userType != this.userType.Auditor);
          // Filter users to show only those with roleType 3 (admin)
          this.adminList = response.filter((x) => x.userType === 1 || x.userType === 2 && !(x.userType === 2 && x.id === this.currentUserId));
          // Otherwise, filter out Auditors
          // this.userList = response.filter((x)=> x.userType != this.currentUserId);
          this.userList = response;

          if (isSetForm) { this.setFormValue(formTwoRes); }
        }
        this.SetLoading(false);
      },
        (err) => {
          this.SetLoading(false);
          console.error('could not fetch users::' + err.error);
        });
    }
  }

  private getFormTwo(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formTwoService.getForm(id).subscribe((response) => {
        if (response) {
          // We need to set form that's why we share true 
          this.getUsers(response, true, null);
          // Change
          // this.setFormValue(response);
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

  private enumConvert() {
    this.status = EnumConverter.ConvertEnumToArray(Status);
    this.incidentType = EnumConverter.ConvertEnumToArray(IncidentTypeFormTwo);
    this.volientIncidents = EnumConverter.ConvertEnumToArray(ViolentIncidents);
    this.natureOfActivity = EnumConverter.ConvertEnumToArray(NatureOfActivity);
    this.otherFactors = EnumConverter.ConvertEnumToArray(OtherFactors);
    this.injuryType = EnumConverter.ConvertEnumToArray(InjuriesType);
    this.consequencse = EnumConverter.ConvertEnumToArray(Consequences);
    this.incidentOccurStage =
      EnumConverter.ConvertEnumToArray(IncidentOccurStage);
    this.incidentCodes = EnumConverter.ConvertEnumToArray(
      MedicationIncidentCodes
    );
  }

  private setValidation() {
    this.formPartA.controls['auditDate'].setValidators(Validators.required);
    this.formPartA.controls['auditDate'].updateValueAndValidity();
    this.formPartA.controls['signoffBy'].setValidators(Validators.required);
    this.formPartA.controls['signoffBy'].updateValueAndValidity();
    this.formPartA.controls['auditedBy'].setValidators(Validators.required);
    this.formPartA.controls['auditedBy'].updateValueAndValidity();


    // part C
    if (this.currentUserRole == this.userType.Admin || this.currentUserRole == this.userType.SuperUser || this.currentUserRole == this.userType.User) {
      this.formPartC.controls['immediateActionsTaken'].setValidators(Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(5000)]));
      this.formPartC.controls['immediateActionsTaken'].updateValueAndValidity();
      this.formPartC.controls['plannedFutureActions'].setValidators(Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(5000)]));
      this.formPartC.controls['plannedFutureActions'].updateValueAndValidity();
      this.formPartC.controls['dateManagerCalled'].setValidators(Validators.compose([Validators.required]));
      this.formPartC.controls['dateManagerCalled'].updateValueAndValidity();
      this.formPartC.controls['isRIDDORReportable'].enable();
      // this.formPartC.controls['isRIDDORReportable'].setValue(true);
      this.formPartC.controls['isRIDDORReportable'].updateValueAndValidity();

    } else {
      this.formPartC.controls['immediateActionsTaken'].disable();
      this.formPartC.controls['immediateActionsTaken'].updateValueAndValidity();
      this.formPartC.controls['plannedFutureActions'].disable();
      this.formPartC.controls['plannedFutureActions'].updateValueAndValidity();
      this.formPartC.controls['dateManagerCalled'].disable();
      this.formPartC.controls['dateManagerCalled'].updateValueAndValidity();
      // this.formPartC.controls['disable'].disable();
      this.formPartC.controls['dateManagerCalled'].updateValueAndValidity();
      this.formPartC.controls['isRIDDORReportable'].disable();
      this.formPartC.controls['isRIDDORReportable'].updateValueAndValidity();
    }

    // part B
    // this.formPartB.controls['riskScore'].setValue(1);
    this.formPartB.controls['riskScore'].setValidators(Validators.compose([Validators.required, Validators.max(25), Validators.min(1)]));
    this.formPartB.controls['riskScore'].updateValueAndValidity();
    this.formPartB.controls['sendEmailUserIds'].updateValueAndValidity();


    // part A

    this.formPartA.controls['fullName'].setValidators(Validators.compose([Validators.required, Validators.maxLength(250), Validators.minLength(2), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,80}$")]));
    this.formPartA.controls['fullName'].updateValueAndValidity();
    this.formPartA.controls['address'].setValidators(Validators.compose([Validators.required, Validators.maxLength(250)]));
    this.formPartA.controls['address'].updateValueAndValidity();
    this.formPartA.controls['postCode'].setValidators(Validators.compose([Validators.required, Validators.maxLength(20)]));
    this.formPartA.controls['postCode'].updateValueAndValidity();
    this.formPartA.controls['telephoneNumber'].setValidators(Validators.compose([Validators.maxLength(11), Validators.pattern("^[0-9].{9,10}$")]));
    this.formPartA.controls['telephoneNumber'].updateValueAndValidity();
    this.formPartA.controls['signature'].setValidators(Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(80), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,80}$")]));
    this.formPartA.controls['signature'].updateValueAndValidity();
    this.formPartA.controls['dateReported'].setValidators(Validators.required);
    this.formPartA.controls['dateReported'].updateValueAndValidity();

    this.formPartA.controls['accidentPersonEmergencyName'].setValidators(Validators.compose([Validators.required, Validators.maxLength(250), Validators.minLength(2), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,80}$")]));
    this.formPartA.controls['accidentPersonEmergencyName'].updateValueAndValidity();

    this.formPartA.controls['accidentPersonDateOfBirth'].setValidators(Validators.required);
    this.formPartA.controls['accidentPersonDateOfBirth'].updateValueAndValidity();

    this.formPartA.controls['accidentPersonPhone'].setValidators(Validators.compose([Validators.maxLength(11), Validators.pattern("^[0-9].{9,10}$")]));
    this.formPartA.controls['accidentPersonPhone'].updateValueAndValidity();

    this.formPartA.controls['accidentPersonEmail'].setValidators(Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]));
    this.formPartA.controls['accidentPersonEmail'].updateValueAndValidity();

    this.formPartA.controls['accidentPersonEmergencyRelationship'].setValidators(Validators.compose([Validators.required, Validators.maxLength(250), Validators.minLength(2), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,80}$")]));
    this.formPartA.controls['accidentPersonEmergencyRelationship'].updateValueAndValidity();

    this.formPartA.controls['accidentPersonEmergencyPhone'].setValidators(Validators.compose([Validators.maxLength(11), Validators.pattern("^[0-9].{9,10}$")]));
    this.formPartA.controls['accidentPersonEmergencyPhone'].updateValueAndValidity();

    this.formPartA.controls['timeOfIncident'].setValidators(Validators.required);
    this.formPartA.controls['timeOfIncident'].updateValueAndValidity();

    this.formPartA.controls['incidentLocationSpecificArea'].setValidators(Validators.compose([Validators.required, Validators.maxLength(250), Validators.minLength(2), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,80}$")]));
    this.formPartA.controls['incidentLocationSpecificArea'].updateValueAndValidity();
  }

  private removeValidation() {
    this.formPartA.controls['auditDate'].clearValidators();
    this.formPartA.controls['auditDate'].updateValueAndValidity();
    this.formPartA.controls['signoffBy'].clearValidators();
    this.formPartA.controls['signoffBy'].updateValueAndValidity();

    // part C
    this.formPartC.controls['immediateActionsTaken'].clearValidators();
    this.formPartC.controls['immediateActionsTaken'].updateValueAndValidity();
    this.formPartC.controls['plannedFutureActions'].clearValidators();
    this.formPartC.controls['plannedFutureActions'].updateValueAndValidity();



    // part B
    this.formPartB.controls['riskScore'].setValue(1);
    this.formPartB.controls['riskScore'].clearValidators();
    this.formPartB.controls['riskScore'].updateValueAndValidity();

    this.formPartB.controls['doesRegulation'].setValue(true);
    this.formPartB.controls['cmhtInformed'].setValue(true);
    this.formPartB.controls['ccgInformed'].setValue(true);
    this.formPartB.controls['safeguardingAuthoritiesNotified'].setValue(true);
    this.formPartB.controls['policeinvolved'].setValue(true);

    this.formPartB.controls['sendEmailUserIds'].clearValidators();
    this.formPartB.controls['sendEmailUserIds'].updateValueAndValidity();
    //  part A

    this.formPartA.controls['fullName'].clearValidators();
    this.formPartA.controls['fullName'].updateValueAndValidity();
    this.formPartA.controls['address'].clearValidators();
    this.formPartA.controls['address'].updateValueAndValidity();
    this.formPartA.controls['postCode'].clearValidators();
    this.formPartA.controls['postCode'].updateValueAndValidity();
    this.formPartA.controls['telephoneNumber'].clearValidators();
    this.formPartA.controls['telephoneNumber'].updateValueAndValidity();
    this.formPartA.controls['signature'].clearValidators();
    this.formPartA.controls['signature'].updateValueAndValidity();
    this.formPartA.controls['dateReported'].clearValidators();
    this.formPartA.controls['dateReported'].updateValueAndValidity();
    (<FormArray>this.formPartA.get('witnesses')).clear();

    this.formPartA.controls['accidentPersonDateOfBirth'].clearValidators();
    this.formPartA.controls['accidentPersonDateOfBirth'].updateValueAndValidity();

    this.formPartA.controls['accidentPersonPhone'].clearValidators();
    this.formPartA.controls['accidentPersonPhone'].updateValueAndValidity();

    this.formPartA.controls['accidentPersonEmail'].clearValidators();
    this.formPartA.controls['accidentPersonEmail'].updateValueAndValidity();

    this.formPartA.controls['accidentPersonEmergencyName'].clearValidators();
    this.formPartA.controls['accidentPersonEmergencyName'].updateValueAndValidity();

    this.formPartA.controls['accidentPersonEmergencyRelationship'].clearValidators();
    this.formPartA.controls['accidentPersonEmergencyRelationship'].updateValueAndValidity();

    this.formPartA.controls['accidentPersonEmergencyPhone'].updateValueAndValidity();
    this.formPartA.controls['accidentPersonEmergencyPhone'].clearValidators();

    this.formPartA.controls['timeOfIncident'].updateValueAndValidity();
    this.formPartA.controls['timeOfIncident'].clearValidators();

    this.formPartA.controls['incidentLocationSpecificArea'].clearValidators();
    this.formPartA.controls['incidentLocationSpecificArea'].updateValueAndValidity();
  }

  private setFormValue(formTwo: AuditFormTwo) {
    this.formPartA = this.fb.group({
      id: [formTwo.id],
      auditedBy: [formTwo.auditedBy, Validators.required],
      signoffBy: [formTwo.signoffBy],
      auditDate: [formTwo.auditDate],
      isSignedOff: [formTwo.isSignedOff],
      locationId: [formTwo.locationId, Validators.required],
      careHomeId: [formTwo.careHomeId],
      createdBy: [formTwo.createdBy],
      createdAt: [formTwo.createdAt],
      // part A

      fullName: [formTwo.fullName, Validators.compose([Validators.required, Validators.maxLength(250), Validators.minLength(2), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,80}$")])],
      address: [formTwo.address, Validators.compose([Validators.required, Validators.maxLength(250)])],
      postCode: [formTwo.postCode, Validators.compose([Validators.required, Validators.maxLength(20)])],
      telephoneNumber: [formTwo.telephoneNumber, Validators.compose([Validators.maxLength(11), Validators.pattern("^[0-9]{9,10}$")])],
      signature: [formTwo.signature, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(80), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,80}$")])],
      dateReported: [(formTwo.dateReported) ? formatDate(formTwo.dateReported, 'yyyy-MM-dd', 'en') : null],

      status: [formTwo.status, Validators.required],
      accidentPersonName: [formTwo.accidentPersonName, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(250), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,80}$")])],
      accidentPersonAddress: [formTwo.accidentPersonAddress, Validators.compose([Validators.required, Validators.maxLength(250), Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,200}$")])],
      accidentPersonPostCode: [formTwo.accidentPersonPostCode, Validators.compose([Validators.maxLength(20)])],
      actionAtIncidentTime: [formTwo.actionAtIncidentTime, Validators.compose([Validators.maxLength(200), Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,200}$")])],

      incidentDate: [(formTwo.incidentDate) ? formatDate(formTwo.incidentDate, 'yyyy-MM-dd', 'en') : null, Validators.required],
      incidentLocation: [formTwo.incidentLocation, Validators.required],
      whatHappened: [formTwo.whatHappened, Validators.compose([Validators.required, Validators.maxLength(5000)])],
      whatWasTheCause: [formTwo.whatWasTheCause, Validators.compose([Validators.maxLength(5000)])],
      isAnyInjuries: [formTwo.isAnyInjuries, Validators.required],
      immediateActionTaken: [formTwo.immediateActionTaken, Validators.compose([Validators.required, Validators.maxLength(5000)])],

      isAnyWitnesses: [formTwo.isAnyWitnesses, Validators.required],
      witnesses: this.fb.array([]),

      incidentType: [formTwo.incidentType, Validators.required],
      otherIncidentSpecify: [formTwo.otherIncidentSpecify, Validators.compose([Validators.maxLength(5000)])],

      violentIncidents: [formTwo.violentIncidents],
      natureOfActivity: [formTwo.natureOfActivity],
      otherNatureActivitySpecify: [formTwo.otherNatureActivitySpecify, Validators.compose([Validators.maxLength(5000)])],
      otherFactors: [formTwo.otherFactors],

      thirdPartyName: [formTwo.thirdPartyName, Validators.compose([Validators.maxLength(250), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,80}$")])],
      thirdPartyAddress: [formTwo.thirdPartyAddress, Validators.compose([Validators.maxLength(5000)])],
      thirdPartyPostCode: [formTwo.thirdPartyPostCode, Validators.compose([Validators.maxLength(20)])],
      thirdPartyStatus: [formTwo.thirdPartyStatus, Validators.required],
      injuryDetails: [formTwo.injuryDetails, Validators.compose([Validators.maxLength(5000)])],
      injuryType: [formTwo.injuryType, Validators.required],
      injuryDetailsOtherSpecify: [formTwo.injuryDetailsOtherSpecify, Validators.compose([Validators.maxLength(5000)])],

      consequences: [formTwo.consequences, Validators.required],
      consequencesOtherSpecify: [formTwo.consequencesOtherSpecify, Validators.compose([Validators.maxLength(5000)])],

      specifyInformedPerson: [formTwo.specifyInformedPerson],

      nameOfDrug: [formTwo.nameOfDrug, Validators.compose([Validators.maxLength(250), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,80}$")])],
      incidentOccurStage: [formTwo.incidentOccurStage, Validators.required],
      incidentOccurOtherSpecify: [formTwo.incidentOccurOtherSpecify, Validators.compose([Validators.maxLength(5000)])],

      medicationIncidentCodes: [formTwo.medicationIncidentCodes, Validators.required],
      medicationIncidentOtherSpecify: [formTwo.medicationIncidentOtherSpecify, Validators.compose([Validators.maxLength(5000)])],

      // new fields of accidental person
      accidentPersonDateOfBirth: [formTwo.accidentPersonDateOfBirth, Validators.required],
      accidentPersonPhone: [formTwo.accidentPersonPhone, Validators.compose([Validators.maxLength(11), Validators.pattern("^[0-9]{9,10}$")])],
      accidentPersonEmail: [formTwo.accidentPersonEmail, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')])],
      accidentPersonEmergencyName: [formTwo.accidentPersonEmergencyName, Validators.compose([Validators.required, Validators.maxLength(250), Validators.minLength(2), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,80}$")])],
      accidentPersonEmergencyRelationship: [formTwo.accidentPersonEmergencyRelationship, Validators.compose([Validators.required, Validators.maxLength(250), Validators.minLength(2), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,80}$")])],
      accidentPersonEmergencyPhone: [formTwo.accidentPersonEmergencyPhone, Validators.compose([Validators.maxLength(11), Validators.pattern("^[0-9].{9,10}$")])],

      // new fields of incident details
      timeOfIncident: [formTwo.timeOfIncident, Validators.required],
      incidentLocationSpecificArea: [formTwo.incidentLocationSpecificArea, Validators.compose([Validators.required, Validators.maxLength(250), Validators.pattern("^[a-zA-Z][a-zA-Z 0-9_.,/#&'()]{1,200}$")])],

    });
    // part B
    this.formPartB = this.fb.group({
      doesRegulation: [formTwo.doesRegulation, Validators.required],
      cmhtInformed: [formTwo.cmhtInformed, Validators.required],
      ccgInformed: [formTwo.ccgInformed, Validators.required],
      safeguardingAuthoritiesNotified: [formTwo.safeguardingAuthoritiesNotified, Validators.required],
      policeinvolved: [formTwo.policeinvolved, Validators.required],
      incidentDocument: [(formTwo.incidentDocument) ? formTwo.incidentDocument : ''],
      incidentDocumentFileName: [],
      incidentDocumentAsBase64: [],

      riskScore: [formTwo.riskScore, Validators.compose([Validators.required, Validators.max(25), Validators.min(1), Validators.minLength(2)])],
      sendEmailUserIds: [(formTwo.sendEmailUserIds), Validators.required]
    });
    // part C
    this.formPartC = this.fb.group({
      // auditedBy: [formTwo.auditedBy, Validators.required],
      // signoffBy: [formTwo.signoffBy],
      immediateActionsTaken: [formTwo.immediateActionsTaken, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(5000)])],
      plannedFutureActions: [formTwo.plannedFutureActions, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(5000)])],
      actionPlanDocument: [formTwo.actionPlanDocument],
      actionPlanDocumentFileName: [],
      actionPlanDocumentAsBase64: [],

      isRIDDORReportable: [formTwo.isRIDDORReportable, Validators.required],
      dateManagerCalled: [(formTwo.dateManagerCalled) ? formatDate(formTwo.dateManagerCalled, 'yyyy-MM-dd', 'en') : null, Validators.required],

    });

    // Change
    this.selectedItems = formTwo.sendEmailUserIds.map(userId => {
      return this.userList.find(user => user.id === userId);
    });

    if (formTwo.witnesses.length > 0) {
      formTwo.witnesses.forEach((element) => {
        this.addButtonWitness(element);
      });
    } else {
      this.addButtonWitness();
    }
    if (this.currentUserRole == this.userType.User) {
      // this.formPartA.controls['auditedBy'].setValue(this.currentUserId);
      this.formPartA.controls['auditedBy'].disable();

    }
    this.completeForm();
  }

  onItemSelect(item: any) {
    let selectedIds = this.formPartB.get('sendEmailUserIds').value || []; // Get the current value of sendEmailUserIds array

    // Check if the selected item's id is not already in the array before pushing it
    if (!selectedIds.includes(item.id)) {
      selectedIds.push(item.id); // Assuming the selected item has an 'id' property

      // Update the form control with the new array value
      this.formPartB.get('sendEmailUserIds').setValue(selectedIds);
    }
  }

  OnItemDeSelect(item: any) {
    let selectedIds = this.formPartB.get('sendEmailUserIds').value || []; // Get the current value of sendEmailUserIds array

    // Filter out the deselected item's id from the array
    selectedIds = selectedIds.filter((id: any) => id !== item.id);

    // Update the form control with the new array value
    this.formPartB.get('sendEmailUserIds').setValue(selectedIds);
  }

  onSelectAll(items: any[]) {
    // Extract ids from all selected items
    let selectedIds = items.map((item: any) => item.id);

    // Update the form control with the new array value
    this.formPartB.get('sendEmailUserIds').setValue(selectedIds);
  }

  onDeSelectAll(items: any[]) {
    // Clear the sendEmailUserIds array when all items are deselected
    this.formPartB.get('sendEmailUserIds').setValue([]);
  }

  public removeSignOffBy() {
    if (this.formPartB.controls['riskScore'].value > 10) {
      // this.formPartA.controls['signoffBy'].setValue(null);
    }
    else {
      this.formPartB.controls['sendEmailUserIds'].disable();
      this.formPartB.controls['sendEmailUserIds'].setValue(null);
    }
  }


  toggleMinutes(): void {
    this.showMin = !this.showMin;
  }
 
  toggleSeconds(): void {
    this.showSec = !this.showSec;
  }

  
// Method to format time as HH:mm:ss
private getFormattedTime(): string {
  const date = this.formPartA.controls['timeOfIncident'].value;
  return date ? this.formatTime(date) : '';
}

// Method to format Date object to HH:mm:ss string
private formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}
}
