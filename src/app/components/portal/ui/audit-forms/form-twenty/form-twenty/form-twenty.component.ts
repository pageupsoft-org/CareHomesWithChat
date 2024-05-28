import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormTwentyService } from 'src/app/services/form-twenty.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { RiskEntry } from 'src/app/shared/enums/risk-entry.enum';
import { AuditFormTwenty } from 'src/app/shared/models/audit-form-twenty';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/util/Constants';

@Component({
  selector: 'app-form-twenty',
  templateUrl: './form-twenty.component.html',
  styleUrls: ['./form-twenty.component.scss'],
})
export class FormTwentyComponent extends BaseComponent implements OnInit {
  @Output() getForms: EventEmitter<any> = new EventEmitter<any>();

  public locationList: Array<Location> = [];
  public userList: Array<User> = [];
  public allUserList: Array<User> = [];
  public auditForm: FormGroup;
  public riskAction = RiskEntry;
  public isEdit: boolean = false;
  public isFilling: boolean = false;
  public createForm: boolean = false;

  constructor(
    private locationService: LocationServices,
    private userService: UserService,
    private formtwentyService: FormTwentyService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getLocations();
    this.getAllUsers();
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.getFormTwenty(this.route.snapshot.params['id']);
    
    } else {
      this.auditForm = this.fb.group({
        id: [0],
        auditDate: [null],
        auditedBy: [null, Validators.required],

        windowInstallationsMaintainResponse: [RiskEntry.Yes],
        windowInstallationsMaintainAction: [null, Validators.required],
        windowInstallationsMaintainDueDate: [null, Validators.required],
        windowInstallationsMaintainActionBy: [null, Validators.required],

        restrictedToOpeningResponse: [RiskEntry.Yes],
        restrictedToOpeningAction: [null, Validators.required],
        restrictedToOpeningDueDate: [null, Validators.required],
        restrictedToOpeningActionBy: [null, Validators.required],

        bottomEdgeOfOpenableWindowResponse: [RiskEntry.Yes],
        bottomEdgeOfOpenableWindowAction: [null, Validators.required],
        bottomEdgeOfOpenableWindowDueDate: [null, Validators.required],
        bottomEdgeOfOpenableWindowActionBy: [null, Validators.required],

        avoidUnauthorisedAccessResponse: [RiskEntry.Yes],
        avoidUnauthorisedAccessAction: [null, Validators.required],
        avoidUnauthorisedAccessDueDate: [null, Validators.required],
        avoidUnauthorisedAccessActionBy: [null, Validators.required],

        preventExcAmtsOfMovementResponse: [RiskEntry.Yes],
        preventExcAmtsOfMovementAction: [null, Validators.required],
        preventExcAmtsOfMovementDueDate: [null, Validators.required],
        preventExcAmtsOfMovementActionBy: [null, Validators.required],

        suitableGlazingMasticResponse: [RiskEntry.Yes],
        suitableGlazingMasticAction: [null, Validators.required],
        suitableGlazingMasticDueDate: [null, Validators.required],
        suitableGlazingMasticActionBy: [null, Validators.required],

        fittedWidOpeningRestrictorResponse: [RiskEntry.Yes],
        fittedWidOpeningRestrictorAction: [null, Validators.required],
        fittedWidOpeningRestrictorDueDate: [null, Validators.required],
        fittedWidOpeningRestrictorActionBy: [null, Validators.required],

        robustToWithstandDamageResponse: [RiskEntry.Yes],
        robustToWithstandDamageAction: [null, Validators.required],
        robustToWithstandDamageDueDate: [null, Validators.required],
        robustToWithstandDamageActionBy: [null, Validators.required],

        tamperProofFittingsResponse: [RiskEntry.Yes],
        tamperProofFittingsAction: [null, Validators.required],
        tamperProofFittingsDueDate: [null, Validators.required],
        tamperProofFittingsActionBy: [null, Validators.required],

        fittedSufficientlyRobustResponse: [RiskEntry.Yes],
        fittedSufficientlyRobustAction: [null, Validators.required],
        fittedSufficientlyRobustDueDate: [null, Validators.required],
        fittedSufficientlyRobustActionBy: [null, Validators.required],

        restrictedAccessToUpperFloorsResponse: [RiskEntry.Yes],
        restrictedAccessToUpperFloorsAction: [null, Validators.required],
        restrictedAccessToUpperFloorsDueDate: [null, Validators.required],
        restrictedAccessToUpperFloorsActionBy: [null, Validators.required],

        climbOverBarrierResponse: [RiskEntry.Yes],
        climbOverBarrierAction: [null, Validators.required],
        climbOverBarrierDueDate: [null, Validators.required],
        climbOverBarrierActionBy: [null, Validators.required],

        fittingsFunctioningEffectivelyResponse: [RiskEntry.Yes],
        fittingsFunctioningEffectivelyAction: [null, Validators.required],
        fittingsFunctioningEffectivelyDueDate: [null, Validators.required],
        fittingsFunctioningEffectivelyActionBy: [null, Validators.required],

        providingAdequateTrainingResponse: [RiskEntry.Yes],
        providingAdequateTrainingAction: [null, Validators.required],
        providingAdequateTrainingDueDate: [null, Validators.required],
        providingAdequateTrainingActionBy: [null, Validators.required],


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
    if (this.currentUserId == this.auditForm.controls['auditedBy'].value ||this.currentUserRole == this.userType.SuperUser || this.currentUserRole == this.userType.Admin) {
      if (Number(this.currentUserId) ==Number(this.auditForm.controls['signoffBy'].value)) {
        this.auditForm.controls['isSignedOff'].setValue(true);
        this.auditForm.controls['signoffBy'].enable();
        if (this.createForm) {
          let formTwenty = new AuditFormTwenty();
          let date = new Date(this.auditForm.controls['auditDate'].value);
          formTwenty.auditDate = new Date(date.setMonth(date.getMonth() + 1));
          // formTwenty.auditDate = new Date(new Date(this.auditForm.controls['auditDate'].value).setMonth(new Date(this.auditForm.controls['auditDate'].value).getMonth() + 1));
          formTwenty.auditedBy = this.auditForm.controls['auditedBy'].value;
          formTwenty.locationId = this.auditForm.controls['locationId'].value;
          formTwenty.careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
          formTwenty.createdAt = new Date();
          formTwenty.createdBy = this.currentUserId;
          this.formtwentyService.addForm(formTwenty).subscribe();
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
    this.formtwentyService.addForm(this.auditForm.value).subscribe(
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
    this.formtwentyService.updateForm(this.auditForm.value).subscribe(
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

  private getAllUsers() {
    this.SetLoading(true);
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    this.userService.getUsers(careHomeId).subscribe(
      (response) => {
        if (response) {
          this.allUserList = response.filter(
            (x) => x.userType != this.userType.Auditor
          );
        }
        this.SetLoading(false);
      },
      (err) => {
        console.error('could not fetch users::' + err.error);
        this.SetLoading(false);
      }
    );
  }

  private getFormTwenty(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formtwentyService.getForm(id).subscribe(
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

    this.auditForm.controls['windowInstallationsMaintainResponse'].setValidators(Validators.required);
    this.auditForm.controls['windowInstallationsMaintainResponse'].updateValueAndValidity();
    this.auditForm.controls['windowInstallationsMaintainAction'].setValidators(Validators.required);
    this.auditForm.controls['windowInstallationsMaintainAction'].updateValueAndValidity();
    this.auditForm.controls['windowInstallationsMaintainDueDate'].setValidators(Validators.required);
    this.auditForm.controls['windowInstallationsMaintainDueDate'].updateValueAndValidity();
    this.auditForm.controls['windowInstallationsMaintainActionBy'].setValidators(Validators.required);
    this.auditForm.controls['windowInstallationsMaintainActionBy'].updateValueAndValidity();

    this.auditForm.controls['restrictedToOpeningResponse'].setValidators(Validators.required);
    this.auditForm.controls['restrictedToOpeningResponse'].updateValueAndValidity();
    this.auditForm.controls['restrictedToOpeningAction'].setValidators(Validators.required);
    this.auditForm.controls['restrictedToOpeningAction'].updateValueAndValidity();
    this.auditForm.controls['restrictedToOpeningDueDate'].setValidators(Validators.required);
    this.auditForm.controls['restrictedToOpeningDueDate'].updateValueAndValidity();
    this.auditForm.controls['restrictedToOpeningActionBy'].setValidators(Validators.required);
    this.auditForm.controls['restrictedToOpeningActionBy'].updateValueAndValidity();

    this.auditForm.controls['bottomEdgeOfOpenableWindowResponse'].setValidators(Validators.required);
    this.auditForm.controls['bottomEdgeOfOpenableWindowResponse'].updateValueAndValidity();
    this.auditForm.controls['bottomEdgeOfOpenableWindowAction'].setValidators(Validators.required);
    this.auditForm.controls['bottomEdgeOfOpenableWindowAction'].updateValueAndValidity();
    this.auditForm.controls['bottomEdgeOfOpenableWindowDueDate'].setValidators(Validators.required);
    this.auditForm.controls['bottomEdgeOfOpenableWindowDueDate'].updateValueAndValidity();
    this.auditForm.controls['bottomEdgeOfOpenableWindowActionBy'].setValidators(Validators.required);
    this.auditForm.controls['bottomEdgeOfOpenableWindowActionBy'].updateValueAndValidity();

    this.auditForm.controls['avoidUnauthorisedAccessResponse'].setValidators(Validators.required);
    this.auditForm.controls['avoidUnauthorisedAccessResponse'].updateValueAndValidity();
    this.auditForm.controls['avoidUnauthorisedAccessAction'].setValidators(Validators.required);
    this.auditForm.controls['avoidUnauthorisedAccessAction'].updateValueAndValidity();
    this.auditForm.controls['avoidUnauthorisedAccessDueDate'].setValidators(Validators.required);
    this.auditForm.controls['avoidUnauthorisedAccessDueDate'].updateValueAndValidity();
    this.auditForm.controls['avoidUnauthorisedAccessActionBy'].setValidators(Validators.required);
    this.auditForm.controls['avoidUnauthorisedAccessActionBy'].updateValueAndValidity();

    this.auditForm.controls['preventExcAmtsOfMovementResponse'].setValidators(Validators.required);
    this.auditForm.controls['preventExcAmtsOfMovementResponse'].updateValueAndValidity();
    this.auditForm.controls['preventExcAmtsOfMovementAction'].setValidators(Validators.required);
    this.auditForm.controls['preventExcAmtsOfMovementAction'].updateValueAndValidity();
    this.auditForm.controls['preventExcAmtsOfMovementDueDate'].setValidators(Validators.required);
    this.auditForm.controls['preventExcAmtsOfMovementDueDate'].updateValueAndValidity();
    this.auditForm.controls['preventExcAmtsOfMovementActionBy'].setValidators(Validators.required);
    this.auditForm.controls['preventExcAmtsOfMovementActionBy'].updateValueAndValidity();

    this.auditForm.controls['suitableGlazingMasticResponse'].setValidators(Validators.required);
    this.auditForm.controls['suitableGlazingMasticResponse'].updateValueAndValidity();
    this.auditForm.controls['suitableGlazingMasticAction'].setValidators(Validators.required);
    this.auditForm.controls['suitableGlazingMasticAction'].updateValueAndValidity();
    this.auditForm.controls['suitableGlazingMasticDueDate'].setValidators(Validators.required);
    this.auditForm.controls['suitableGlazingMasticDueDate'].updateValueAndValidity();
    this.auditForm.controls['suitableGlazingMasticActionBy'].setValidators(Validators.required);
    this.auditForm.controls['suitableGlazingMasticActionBy'].updateValueAndValidity();

    this.auditForm.controls['fittedWidOpeningRestrictorResponse'].setValidators(Validators.required);
    this.auditForm.controls['fittedWidOpeningRestrictorResponse'].updateValueAndValidity();
    this.auditForm.controls['fittedWidOpeningRestrictorAction'].setValidators(Validators.required);
    this.auditForm.controls['fittedWidOpeningRestrictorAction'].updateValueAndValidity();
    this.auditForm.controls['fittedWidOpeningRestrictorDueDate'].setValidators(Validators.required);
    this.auditForm.controls['fittedWidOpeningRestrictorDueDate'].updateValueAndValidity();
    this.auditForm.controls['fittedWidOpeningRestrictorActionBy'].setValidators(Validators.required);
    this.auditForm.controls['fittedWidOpeningRestrictorActionBy'].updateValueAndValidity();

    this.auditForm.controls['robustToWithstandDamageResponse'].setValidators(Validators.required);
    this.auditForm.controls['robustToWithstandDamageResponse'].updateValueAndValidity();
    this.auditForm.controls['robustToWithstandDamageAction'].setValidators(Validators.required);
    this.auditForm.controls['robustToWithstandDamageAction'].updateValueAndValidity();
    this.auditForm.controls['robustToWithstandDamageDueDate'].setValidators(Validators.required);
    this.auditForm.controls['robustToWithstandDamageDueDate'].updateValueAndValidity();
    this.auditForm.controls['robustToWithstandDamageActionBy'].setValidators(Validators.required);
    this.auditForm.controls['robustToWithstandDamageActionBy'].updateValueAndValidity();

    this.auditForm.controls['tamperProofFittingsResponse'].setValidators(Validators.required);
    this.auditForm.controls['tamperProofFittingsResponse'].updateValueAndValidity();
    this.auditForm.controls['tamperProofFittingsAction'].setValidators(Validators.required);
    this.auditForm.controls['tamperProofFittingsAction'].updateValueAndValidity();
    this.auditForm.controls['tamperProofFittingsDueDate'].setValidators(Validators.required);
    this.auditForm.controls['tamperProofFittingsDueDate'].updateValueAndValidity();
    this.auditForm.controls['tamperProofFittingsActionBy'].setValidators(Validators.required);
    this.auditForm.controls['tamperProofFittingsActionBy'].updateValueAndValidity();

    this.auditForm.controls['fittedSufficientlyRobustResponse'].setValidators(Validators.required);
    this.auditForm.controls['fittedSufficientlyRobustResponse'].updateValueAndValidity();
    this.auditForm.controls['fittedSufficientlyRobustAction'].setValidators(Validators.required);
    this.auditForm.controls['fittedSufficientlyRobustAction'].updateValueAndValidity();
    this.auditForm.controls['fittedSufficientlyRobustDueDate'].setValidators(Validators.required);
    this.auditForm.controls['fittedSufficientlyRobustDueDate'].updateValueAndValidity();
    this.auditForm.controls['fittedSufficientlyRobustActionBy'].setValidators(Validators.required);
    this.auditForm.controls['fittedSufficientlyRobustActionBy'].updateValueAndValidity();

    this.auditForm.controls['restrictedAccessToUpperFloorsResponse'].setValidators(Validators.required);
    this.auditForm.controls['restrictedAccessToUpperFloorsResponse'].updateValueAndValidity();
    this.auditForm.controls['restrictedAccessToUpperFloorsAction'].setValidators(Validators.required);
    this.auditForm.controls['restrictedAccessToUpperFloorsAction'].updateValueAndValidity();
    this.auditForm.controls['restrictedAccessToUpperFloorsDueDate'].setValidators(Validators.required);
    this.auditForm.controls['restrictedAccessToUpperFloorsDueDate'].updateValueAndValidity();
    this.auditForm.controls['restrictedAccessToUpperFloorsActionBy'].setValidators(Validators.required);
    this.auditForm.controls['restrictedAccessToUpperFloorsActionBy'].updateValueAndValidity();

    this.auditForm.controls['climbOverBarrierResponse'].setValidators(Validators.required);
    this.auditForm.controls['climbOverBarrierResponse'].updateValueAndValidity();
    this.auditForm.controls['climbOverBarrierAction'].setValidators(Validators.required);
    this.auditForm.controls['climbOverBarrierAction'].updateValueAndValidity();
    this.auditForm.controls['climbOverBarrierDueDate'].setValidators(Validators.required);
    this.auditForm.controls['climbOverBarrierDueDate'].updateValueAndValidity();
    this.auditForm.controls['climbOverBarrierActionBy'].setValidators(Validators.required);
    this.auditForm.controls['climbOverBarrierActionBy'].updateValueAndValidity();

    this.auditForm.controls['fittingsFunctioningEffectivelyResponse'].setValidators(Validators.required);
    this.auditForm.controls['fittingsFunctioningEffectivelyResponse'].updateValueAndValidity();
    this.auditForm.controls['fittingsFunctioningEffectivelyAction'].setValidators(Validators.required);
    this.auditForm.controls['fittingsFunctioningEffectivelyAction'].updateValueAndValidity();
    this.auditForm.controls['fittingsFunctioningEffectivelyDueDate'].setValidators(Validators.required);
    this.auditForm.controls['fittingsFunctioningEffectivelyDueDate'].updateValueAndValidity();
    this.auditForm.controls['fittingsFunctioningEffectivelyActionBy'].setValidators(Validators.required);
    this.auditForm.controls['fittingsFunctioningEffectivelyActionBy'].updateValueAndValidity();

    this.auditForm.controls['providingAdequateTrainingResponse'].setValidators(Validators.required);
    this.auditForm.controls['providingAdequateTrainingResponse'].updateValueAndValidity();
    this.auditForm.controls['providingAdequateTrainingAction'].setValidators(Validators.required);
    this.auditForm.controls['providingAdequateTrainingAction'].updateValueAndValidity();
    this.auditForm.controls['providingAdequateTrainingDueDate'].setValidators(Validators.required);
    this.auditForm.controls['providingAdequateTrainingDueDate'].updateValueAndValidity();
    this.auditForm.controls['providingAdequateTrainingActionBy'].setValidators(Validators.required);
    this.auditForm.controls['providingAdequateTrainingActionBy'].updateValueAndValidity();

  }

  private removeValidation() {
    this.auditForm.controls['auditDate'].clearValidators();
    this.auditForm.controls['auditDate'].updateValueAndValidity();
    this.auditForm.controls['signoffBy'].clearValidators();
    this.auditForm.controls['signoffBy'].updateValueAndValidity();


    this.auditForm.controls['windowInstallationsMaintainResponse'].clearValidators();
    this.auditForm.controls['windowInstallationsMaintainResponse'].updateValueAndValidity();
    this.auditForm.controls['windowInstallationsMaintainAction'].clearValidators();
    this.auditForm.controls['windowInstallationsMaintainAction'].updateValueAndValidity();
    this.auditForm.controls['windowInstallationsMaintainDueDate'].clearValidators();
    this.auditForm.controls['windowInstallationsMaintainDueDate'].updateValueAndValidity();
    this.auditForm.controls['windowInstallationsMaintainActionBy'].clearValidators();
    this.auditForm.controls['windowInstallationsMaintainActionBy'].updateValueAndValidity();

    this.auditForm.controls['restrictedToOpeningResponse'].clearValidators();
    this.auditForm.controls['restrictedToOpeningResponse'].updateValueAndValidity();
    this.auditForm.controls['restrictedToOpeningAction'].clearValidators();
    this.auditForm.controls['restrictedToOpeningAction'].updateValueAndValidity();
    this.auditForm.controls['restrictedToOpeningDueDate'].clearValidators();
    this.auditForm.controls['restrictedToOpeningDueDate'].updateValueAndValidity();
    this.auditForm.controls['restrictedToOpeningActionBy'].clearValidators();
    this.auditForm.controls['restrictedToOpeningActionBy'].updateValueAndValidity();

    this.auditForm.controls['bottomEdgeOfOpenableWindowResponse'].clearValidators();
    this.auditForm.controls['bottomEdgeOfOpenableWindowResponse'].updateValueAndValidity();
    this.auditForm.controls['bottomEdgeOfOpenableWindowAction'].clearValidators();
    this.auditForm.controls['bottomEdgeOfOpenableWindowAction'].updateValueAndValidity();
    this.auditForm.controls['bottomEdgeOfOpenableWindowDueDate'].clearValidators();
    this.auditForm.controls['bottomEdgeOfOpenableWindowDueDate'].updateValueAndValidity();
    this.auditForm.controls['bottomEdgeOfOpenableWindowActionBy'].clearValidators();
    this.auditForm.controls['bottomEdgeOfOpenableWindowActionBy'].updateValueAndValidity();

    this.auditForm.controls['avoidUnauthorisedAccessResponse'].clearValidators();
    this.auditForm.controls['avoidUnauthorisedAccessResponse'].updateValueAndValidity();
    this.auditForm.controls['avoidUnauthorisedAccessAction'].clearValidators();
    this.auditForm.controls['avoidUnauthorisedAccessAction'].updateValueAndValidity();
    this.auditForm.controls['avoidUnauthorisedAccessDueDate'].clearValidators();
    this.auditForm.controls['avoidUnauthorisedAccessDueDate'].updateValueAndValidity();
    this.auditForm.controls['avoidUnauthorisedAccessActionBy'].clearValidators();
    this.auditForm.controls['avoidUnauthorisedAccessActionBy'].updateValueAndValidity();

    this.auditForm.controls['preventExcAmtsOfMovementResponse'].clearValidators();
    this.auditForm.controls['preventExcAmtsOfMovementResponse'].updateValueAndValidity();
    this.auditForm.controls['preventExcAmtsOfMovementAction'].clearValidators();
    this.auditForm.controls['preventExcAmtsOfMovementAction'].updateValueAndValidity();
    this.auditForm.controls['preventExcAmtsOfMovementDueDate'].clearValidators();
    this.auditForm.controls['preventExcAmtsOfMovementDueDate'].updateValueAndValidity();
    this.auditForm.controls['preventExcAmtsOfMovementActionBy'].clearValidators();
    this.auditForm.controls['preventExcAmtsOfMovementActionBy'].updateValueAndValidity();

    this.auditForm.controls['suitableGlazingMasticResponse'].clearValidators();
    this.auditForm.controls['suitableGlazingMasticResponse'].updateValueAndValidity();
    this.auditForm.controls['suitableGlazingMasticAction'].clearValidators();
    this.auditForm.controls['suitableGlazingMasticAction'].updateValueAndValidity();
    this.auditForm.controls['suitableGlazingMasticDueDate'].clearValidators();
    this.auditForm.controls['suitableGlazingMasticDueDate'].updateValueAndValidity();
    this.auditForm.controls['suitableGlazingMasticActionBy'].clearValidators();
    this.auditForm.controls['suitableGlazingMasticActionBy'].updateValueAndValidity();

    this.auditForm.controls['fittedWidOpeningRestrictorResponse'].clearValidators();
    this.auditForm.controls['fittedWidOpeningRestrictorResponse'].updateValueAndValidity();
    this.auditForm.controls['fittedWidOpeningRestrictorAction'].clearValidators();
    this.auditForm.controls['fittedWidOpeningRestrictorAction'].updateValueAndValidity();
    this.auditForm.controls['fittedWidOpeningRestrictorDueDate'].clearValidators();
    this.auditForm.controls['fittedWidOpeningRestrictorDueDate'].updateValueAndValidity();
    this.auditForm.controls['fittedWidOpeningRestrictorActionBy'].clearValidators();
    this.auditForm.controls['fittedWidOpeningRestrictorActionBy'].updateValueAndValidity();

    this.auditForm.controls['robustToWithstandDamageResponse'].clearValidators();
    this.auditForm.controls['robustToWithstandDamageResponse'].updateValueAndValidity();
    this.auditForm.controls['robustToWithstandDamageAction'].clearValidators();
    this.auditForm.controls['robustToWithstandDamageAction'].updateValueAndValidity();
    this.auditForm.controls['robustToWithstandDamageDueDate'].clearValidators();
    this.auditForm.controls['robustToWithstandDamageDueDate'].updateValueAndValidity();
    this.auditForm.controls['robustToWithstandDamageActionBy'].clearValidators();
    this.auditForm.controls['robustToWithstandDamageActionBy'].updateValueAndValidity();

    this.auditForm.controls['tamperProofFittingsResponse'].clearValidators();
    this.auditForm.controls['tamperProofFittingsResponse'].updateValueAndValidity();
    this.auditForm.controls['tamperProofFittingsAction'].clearValidators();
    this.auditForm.controls['tamperProofFittingsAction'].updateValueAndValidity();
    this.auditForm.controls['tamperProofFittingsDueDate'].clearValidators();
    this.auditForm.controls['tamperProofFittingsDueDate'].updateValueAndValidity();
    this.auditForm.controls['tamperProofFittingsActionBy'].clearValidators();
    this.auditForm.controls['tamperProofFittingsActionBy'].updateValueAndValidity();

    this.auditForm.controls['fittedSufficientlyRobustResponse'].clearValidators();
    this.auditForm.controls['fittedSufficientlyRobustResponse'].updateValueAndValidity();
    this.auditForm.controls['fittedSufficientlyRobustAction'].clearValidators();
    this.auditForm.controls['fittedSufficientlyRobustAction'].updateValueAndValidity();
    this.auditForm.controls['fittedSufficientlyRobustDueDate'].clearValidators();
    this.auditForm.controls['fittedSufficientlyRobustDueDate'].updateValueAndValidity();
    this.auditForm.controls['fittedSufficientlyRobustActionBy'].clearValidators();
    this.auditForm.controls['fittedSufficientlyRobustActionBy'].updateValueAndValidity();

    this.auditForm.controls['restrictedAccessToUpperFloorsResponse'].clearValidators();
    this.auditForm.controls['restrictedAccessToUpperFloorsResponse'].updateValueAndValidity();
    this.auditForm.controls['restrictedAccessToUpperFloorsAction'].clearValidators();
    this.auditForm.controls['restrictedAccessToUpperFloorsAction'].updateValueAndValidity();
    this.auditForm.controls['restrictedAccessToUpperFloorsDueDate'].clearValidators();
    this.auditForm.controls['restrictedAccessToUpperFloorsDueDate'].updateValueAndValidity();
    this.auditForm.controls['restrictedAccessToUpperFloorsActionBy'].clearValidators();
    this.auditForm.controls['restrictedAccessToUpperFloorsActionBy'].updateValueAndValidity();

    this.auditForm.controls['climbOverBarrierResponse'].clearValidators();
    this.auditForm.controls['climbOverBarrierResponse'].updateValueAndValidity();
    this.auditForm.controls['climbOverBarrierAction'].clearValidators();
    this.auditForm.controls['climbOverBarrierAction'].updateValueAndValidity();
    this.auditForm.controls['climbOverBarrierDueDate'].clearValidators();
    this.auditForm.controls['climbOverBarrierDueDate'].updateValueAndValidity();
    this.auditForm.controls['climbOverBarrierActionBy'].clearValidators();
    this.auditForm.controls['climbOverBarrierActionBy'].updateValueAndValidity();

    this.auditForm.controls['fittingsFunctioningEffectivelyResponse'].clearValidators();
    this.auditForm.controls['fittingsFunctioningEffectivelyResponse'].updateValueAndValidity();
    this.auditForm.controls['fittingsFunctioningEffectivelyAction'].clearValidators();
    this.auditForm.controls['fittingsFunctioningEffectivelyAction'].updateValueAndValidity();
    this.auditForm.controls['fittingsFunctioningEffectivelyDueDate'].clearValidators();
    this.auditForm.controls['fittingsFunctioningEffectivelyDueDate'].updateValueAndValidity();
    this.auditForm.controls['fittingsFunctioningEffectivelyActionBy'].clearValidators();
    this.auditForm.controls['fittingsFunctioningEffectivelyActionBy'].updateValueAndValidity();

    this.auditForm.controls['providingAdequateTrainingResponse'].clearValidators();
    this.auditForm.controls['providingAdequateTrainingResponse'].updateValueAndValidity();
    this.auditForm.controls['providingAdequateTrainingAction'].clearValidators();
    this.auditForm.controls['providingAdequateTrainingAction'].updateValueAndValidity();
    this.auditForm.controls['providingAdequateTrainingDueDate'].clearValidators();
    this.auditForm.controls['providingAdequateTrainingDueDate'].updateValueAndValidity();
    this.auditForm.controls['providingAdequateTrainingActionBy'].clearValidators();
    this.auditForm.controls['providingAdequateTrainingActionBy'].updateValueAndValidity();

  }

  private setFormValue(formTwentyValue: AuditFormTwenty) {
    this.auditForm = this.fb.group({
      id: [formTwentyValue.id],
      auditDate: [formTwentyValue.auditDate],
      auditedBy: [formTwentyValue.auditedBy, Validators.required],

      windowInstallationsMaintainResponse: [formTwentyValue.windowInstallationsMaintainResponse],
      windowInstallationsMaintainAction: [formTwentyValue.windowInstallationsMaintainAction, Validators.maxLength(200)],
      windowInstallationsMaintainDueDate: [formTwentyValue.windowInstallationsMaintainDueDate, Validators.required],
      windowInstallationsMaintainActionBy: [formTwentyValue.windowInstallationsMaintainActionBy, Validators.required],

      restrictedToOpeningResponse: [formTwentyValue.restrictedToOpeningResponse],
      restrictedToOpeningAction: [formTwentyValue.restrictedToOpeningAction, Validators.maxLength(200)],
      restrictedToOpeningDueDate: [formTwentyValue.restrictedToOpeningDueDate, Validators.required],
      restrictedToOpeningActionBy: [formTwentyValue.restrictedToOpeningActionBy, Validators.required],

      bottomEdgeOfOpenableWindowResponse: [formTwentyValue.bottomEdgeOfOpenableWindowResponse],
      bottomEdgeOfOpenableWindowAction: [formTwentyValue.bottomEdgeOfOpenableWindowAction, Validators.maxLength(200)],
      bottomEdgeOfOpenableWindowDueDate: [formTwentyValue.bottomEdgeOfOpenableWindowDueDate, Validators.required],
      bottomEdgeOfOpenableWindowActionBy: [formTwentyValue.bottomEdgeOfOpenableWindowActionBy, Validators.required],

      avoidUnauthorisedAccessResponse: [formTwentyValue.avoidUnauthorisedAccessResponse],
      avoidUnauthorisedAccessAction: [formTwentyValue.avoidUnauthorisedAccessAction, Validators.maxLength(200)],
      avoidUnauthorisedAccessDueDate: [formTwentyValue.avoidUnauthorisedAccessDueDate, Validators.required],
      avoidUnauthorisedAccessActionBy: [formTwentyValue.avoidUnauthorisedAccessActionBy, Validators.required],

      preventExcAmtsOfMovementResponse: [formTwentyValue.preventExcAmtsOfMovementResponse],
      preventExcAmtsOfMovementAction: [formTwentyValue.preventExcAmtsOfMovementAction, Validators.maxLength(200)],
      preventExcAmtsOfMovementDueDate: [formTwentyValue.preventExcAmtsOfMovementDueDate, Validators.required],
      preventExcAmtsOfMovementActionBy: [formTwentyValue.preventExcAmtsOfMovementActionBy, Validators.required],

      suitableGlazingMasticResponse: [formTwentyValue.suitableGlazingMasticResponse],
      suitableGlazingMasticAction: [formTwentyValue.suitableGlazingMasticAction, Validators.maxLength(200)],
      suitableGlazingMasticDueDate: [formTwentyValue.suitableGlazingMasticDueDate, Validators.required],
      suitableGlazingMasticActionBy: [formTwentyValue.suitableGlazingMasticActionBy, Validators.required],

      fittedWidOpeningRestrictorResponse: [formTwentyValue.fittedWidOpeningRestrictorResponse],
      fittedWidOpeningRestrictorAction: [formTwentyValue.fittedWidOpeningRestrictorAction, Validators.maxLength(200)],
      fittedWidOpeningRestrictorDueDate: [formTwentyValue.fittedWidOpeningRestrictorDueDate, Validators.required],
      fittedWidOpeningRestrictorActionBy: [formTwentyValue.fittedWidOpeningRestrictorActionBy, Validators.required],

      robustToWithstandDamageResponse: [formTwentyValue.robustToWithstandDamageResponse],
      robustToWithstandDamageAction: [formTwentyValue.robustToWithstandDamageAction, Validators.maxLength(200)],
      robustToWithstandDamageDueDate: [formTwentyValue.robustToWithstandDamageDueDate, Validators.required],
      robustToWithstandDamageActionBy: [formTwentyValue.robustToWithstandDamageActionBy, Validators.required],

      tamperProofFittingsResponse: [formTwentyValue.tamperProofFittingsResponse],
      tamperProofFittingsAction: [formTwentyValue.tamperProofFittingsAction, Validators.maxLength(200)],
      tamperProofFittingsDueDate: [formTwentyValue.tamperProofFittingsDueDate, Validators.required],
      tamperProofFittingsActionBy: [formTwentyValue.tamperProofFittingsActionBy, Validators.required],

      fittedSufficientlyRobustResponse: [formTwentyValue.fittedSufficientlyRobustResponse],
      fittedSufficientlyRobustAction: [formTwentyValue.fittedSufficientlyRobustAction, Validators.maxLength(200)],
      fittedSufficientlyRobustDueDate: [formTwentyValue.fittedSufficientlyRobustDueDate, Validators.required],
      fittedSufficientlyRobustActionBy: [formTwentyValue.fittedSufficientlyRobustActionBy, Validators.required],

      restrictedAccessToUpperFloorsResponse: [formTwentyValue.restrictedAccessToUpperFloorsResponse],
      restrictedAccessToUpperFloorsAction: [formTwentyValue.restrictedAccessToUpperFloorsAction, Validators.maxLength(200)],
      restrictedAccessToUpperFloorsDueDate: [formTwentyValue.restrictedAccessToUpperFloorsDueDate, Validators.required],
      restrictedAccessToUpperFloorsActionBy: [formTwentyValue.restrictedAccessToUpperFloorsActionBy, Validators.required],

      climbOverBarrierResponse: [formTwentyValue.climbOverBarrierResponse],
      climbOverBarrierAction: [formTwentyValue.climbOverBarrierAction, Validators.maxLength(200)],
      climbOverBarrierDueDate: [formTwentyValue.climbOverBarrierDueDate, Validators.required],
      climbOverBarrierActionBy: [formTwentyValue.climbOverBarrierActionBy, Validators.required],

      fittingsFunctioningEffectivelyResponse: [formTwentyValue.fittingsFunctioningEffectivelyResponse],
      fittingsFunctioningEffectivelyAction: [formTwentyValue.fittingsFunctioningEffectivelyAction, Validators.maxLength(200)],
      fittingsFunctioningEffectivelyDueDate: [formTwentyValue.fittingsFunctioningEffectivelyDueDate, Validators.required],
      fittingsFunctioningEffectivelyActionBy: [formTwentyValue.fittingsFunctioningEffectivelyActionBy, Validators.required],

      providingAdequateTrainingResponse: [formTwentyValue.providingAdequateTrainingResponse],
      providingAdequateTrainingAction: [formTwentyValue.providingAdequateTrainingAction, Validators.maxLength(200)],
      providingAdequateTrainingDueDate: [formTwentyValue.providingAdequateTrainingDueDate, Validators.required],
      providingAdequateTrainingActionBy: [formTwentyValue.providingAdequateTrainingActionBy, Validators.required],



      signoffBy: [formTwentyValue.signoffBy],
      isSignedOff: [formTwentyValue.isSignedOff],
      locationId: [formTwentyValue.locationId, Validators.required],
      careHomeId: [formTwentyValue.careHomeId],
      createdBy: [formTwentyValue.createdBy],
      createdAt: [formTwentyValue.createdAt],
      updatedBy: [formTwentyValue.createdBy],
    });
    this.completeForm();

  }
}
