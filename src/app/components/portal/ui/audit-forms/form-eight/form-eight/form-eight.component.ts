import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormEightService } from 'src/app/services/form-eight.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { UserType } from 'src/app/shared/enums/user-type.enum';
import { AuditFormEightForm } from 'src/app/shared/forms/audit-form-eight-form';
import { AuditFormEight } from 'src/app/shared/models/audit-form-eight';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/util/Constants';

@Component({
  selector: 'app-form-eight',
  templateUrl: './form-eight.component.html',
  styleUrls: ['./form-eight.component.scss']
})
export class FormEightComponent extends BaseComponent implements OnInit {

  public locationList: Array<Location> = [];
  public userList: Array<User> = [];
  public allUserList: Array<User> = [];
  public auditForm: AuditFormEightForm;
  public isEdit: boolean = false;
  public isFilling: boolean = false;
  public createForm: boolean = false;

  constructor(private locationService: LocationServices, private route: ActivatedRoute, private userService: UserService, private formEightService: FormEightService,
    private router: Router) { super() }

  ngOnInit(): void {
    this.getAllUsers();
    this.getLocations();
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.getFormEight(this.route.snapshot.params['id']);
    } else {
      this.isEdit = false;
      this.auditForm = new AuditFormEightForm();
      this.auditForm.careHomeId.setValue(careHomeId);
      this.auditForm.createdBy.setValue(this.currentUserId);
      this.auditForm.auditDate.setValue(null);
      this.auditForm.createdAt.setValue(new Date().toISOString());
      this.auditForm.signoffBy.disable();
      this.completeForm();
    }
  }

  public goBack() {
    if (this.route.snapshot.queryParams["fromDashboard"]) {
      this.router.navigate([Constants.routes.dashboard()]);
    }
    else
      window.history.back();
  }

  public completeForm(event?: any) {
    if (this.currentUserId == this.auditForm.auditedBy.value) {
      this.isFilling = true;
      if (this.currentUserRole == UserType.SuperUser || this.currentUserRole == UserType.Admin) {
        this.auditForm.signoffBy.setValue(this.currentUserId);
        this.auditForm.signoffBy.disable();
        this.auditForm.isSignedOff = true;
        this.auditForm.auditDate.setValue(new Date().toISOString());
      } else {
        this.auditForm.auditDate.setValue(new Date().toISOString());
      }
      this.setValidation();
    } else if (this.currentUserId == this.auditForm.signoffBy.value && this.isEdit) {
      if (event) {
        // this.auditForm.controls['auditedBy'].setValue(this.previousAuditor);
        this.isFilling = false;
        this.auditForm.auditDate.setValue(null);
        this.auditForm.signoffBy.setValue(null);
        this.auditForm.isSignedOff = false;
        this.auditForm.signoffBy.disable();
  
        this.removeValidation();
      } else {
        this.isFilling = true;
        this.auditForm.isSignedOff = true;
        this.auditForm.signoffBy.disable();
        this.setValidation();
      }
    } else {
      this.isFilling = false;
      this.auditForm.auditDate.setValue(null);
      this.auditForm.signoffBy.setValue(null);
      this.auditForm.isSignedOff = false;
      this.auditForm.signoffBy.disable();

      this.removeValidation();
    }
  }

  public onSubmit() {
    this.SetLoading(true);
    if (this.currentUserId == this.auditForm.controls['auditedBy'].value || this.currentUserRole == this.userType.SuperUser || this.currentUserRole == this.userType.Admin) {
      if (Number(this.currentUserId) == Number(this.auditForm.controls['signoffBy'].value)) {
        this.auditForm.isSignedOff = true;
        this.auditForm.controls['signoffBy'].enable();
        if (this.createForm) {
          let formEight = new AuditFormEight();
          formEight.auditDate = new Date(new Date(this.auditForm.controls['auditDate'].value).setMonth(new Date(this.auditForm.controls['auditDate'].value).getMonth() + 1));
          formEight.auditedBy = this.auditForm.controls['auditedBy'].value;
          formEight.locationId = this.auditForm.controls['locationId'].value;
          formEight.careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
          formEight.createdAt = new Date();
          formEight.createdBy = this.currentUserId;
          this.formEightService.addForm(formEight).subscribe();
        }
      }
      if (this.isEdit) {
        this.updateForm();
      } else {
        this.addForm();
      }
    }
  }

  private addForm() {
    this.SetLoading(true);
    this.formEightService.addForm(this.auditForm.value).subscribe((response) => {
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
    if (this.auditForm.signoffBy.value == this.currentUserId) {
      this.auditForm.isSignedOff = true;
      message = 'Updated and signed off successfully';
    }
    this.formEightService.updateForm(this.auditForm.save()).subscribe((response) => {
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
      });
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

  private setValidation() {
    this.auditForm.signoffBy.setValidators(Validators.required);
    this.auditForm.signoffBy.updateValueAndValidity();
    this.auditForm.auditDate.setValidators(Validators.required);
    this.auditForm.auditDate.updateValueAndValidity();
    this.setQuantitiesRequired();
    this.setCheckByRequired();
  }

  private removeValidation() {
    this.auditForm.signoffBy.clearValidators();
    this.auditForm.signoffBy.updateValueAndValidity();
    this.auditForm.auditDate.clearValidators();
    this.auditForm.auditDate.updateValueAndValidity();
    this.setQuantitiesOptional();
    this.setCheckbyOptional();
  }

  private setQuantitiesRequired() {
    this.auditForm.blanketAccidentQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.blanketAccidentQuantity.updateValueAndValidity();
    this.auditForm.cottonBallsQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.cottonBallsQuantity.updateValueAndValidity();
    this.auditForm.disposableGlovesQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.disposableGlovesQuantity.updateValueAndValidity();
    this.auditForm.bottleHardPlasticQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.bottleHardPlasticQuantity.updateValueAndValidity();
    this.auditForm.crepeBandageQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.crepeBandageQuantity.updateValueAndValidity();
    this.auditForm.eyePadSterileQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.eyePadSterileQuantity.updateValueAndValidity();
    this.auditForm.freezerBagsQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.freezerBagsQuantity.updateValueAndValidity();
    this.auditForm.instantColdPackQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.instantColdPackQuantity.updateValueAndValidity();
    this.auditForm.jellyBeansQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.jellyBeansQuantity.updateValueAndValidity();
    this.auditForm.listOfMedicalQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.listOfMedicalQuantity.updateValueAndValidity();
    this.auditForm.medicalEmergencyQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.medicalEmergencyQuantity.updateValueAndValidity();
    this.auditForm.nonAdhesiveDressingsQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.nonAdhesiveDressingsQuantity.updateValueAndValidity();
    this.auditForm.resuscitationMarkQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.resuscitationMarkQuantity.updateValueAndValidity();
    this.auditForm.safetyPinsAssortedQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.safetyPinsAssortedQuantity.updateValueAndValidity();
    this.auditForm.sodChlorideQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.sodChlorideQuantity.updateValueAndValidity();
    this.auditForm.accidentBookPenQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.accidentBookPenQuantity.updateValueAndValidity();
    this.auditForm.tapeScissorsQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.tapeScissorsQuantity.updateValueAndValidity();
    this.auditForm.telephoneQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.telephoneQuantity.updateValueAndValidity();
    this.auditForm.triangularBandageQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.triangularBandageQuantity.updateValueAndValidity();
    this.auditForm.woundClousreStripsQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.woundClousreStripsQuantity.updateValueAndValidity();
    this.auditForm.guzeSwabsQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.guzeSwabsQuantity.updateValueAndValidity();
    this.auditForm.plainScissorsQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.plainScissorsQuantity.updateValueAndValidity();
    this.auditForm.crepeBandageSmallQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.crepeBandageSmallQuantity.updateValueAndValidity();
    this.auditForm.crepeBandageLargeQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.crepeBandageLargeQuantity.updateValueAndValidity();
    this.auditForm.veseline50gQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.veseline50gQuantity.updateValueAndValidity();
    this.auditForm.microporeTapeQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.microporeTapeQuantity.updateValueAndValidity();
    this.auditForm.defribulatorQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.defribulatorQuantity.updateValueAndValidity();
    this.auditForm.scissorsQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.scissorsQuantity.updateValueAndValidity();
    this.auditForm.tissuesQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.tissuesQuantity.updateValueAndValidity();
    this.auditForm.resuscitationFlashQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.resuscitationFlashQuantity.updateValueAndValidity();
    this.auditForm.shaverQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.shaverQuantity.updateValueAndValidity();
    this.auditForm.cleansingWipesQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.cleansingWipesQuantity.updateValueAndValidity();
    this.auditForm.heatRetainingWrapQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.heatRetainingWrapQuantity.updateValueAndValidity();
    this.auditForm.nitrileGlovasQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.nitrileGlovasQuantity.updateValueAndValidity();
    this.auditForm.sterileAdhesiveDressingsQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.sterileAdhesiveDressingsQuantity.updateValueAndValidity();
    this.auditForm.washproofPlastersQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.washproofPlastersQuantity.updateValueAndValidity();
    this.auditForm.bluePlastersQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.bluePlastersQuantity.updateValueAndValidity();
    this.auditForm.burngelQuantity.setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.pattern("^[0-9]{0,4}$")]));
    this.auditForm.burngelQuantity.updateValueAndValidity();
  }

  private setQuantitiesOptional() {
    this.auditForm.blanketAccidentQuantity.clearValidators();
    this.auditForm.blanketAccidentQuantity.updateValueAndValidity();
    this.auditForm.cottonBallsQuantity.clearValidators();
    this.auditForm.cottonBallsQuantity.updateValueAndValidity();
    this.auditForm.disposableGlovesQuantity.clearValidators();
    this.auditForm.disposableGlovesQuantity.updateValueAndValidity();
    this.auditForm.bottleHardPlasticQuantity.clearValidators();
    this.auditForm.bottleHardPlasticQuantity.updateValueAndValidity();
    this.auditForm.crepeBandageQuantity.clearValidators();
    this.auditForm.crepeBandageQuantity.updateValueAndValidity();
    this.auditForm.eyePadSterileQuantity.clearValidators();
    this.auditForm.eyePadSterileQuantity.updateValueAndValidity();
    this.auditForm.freezerBagsQuantity.clearValidators();
    this.auditForm.freezerBagsQuantity.updateValueAndValidity();
    this.auditForm.instantColdPackQuantity.clearValidators();
    this.auditForm.instantColdPackQuantity.updateValueAndValidity();
    this.auditForm.jellyBeansQuantity.clearValidators();
    this.auditForm.jellyBeansQuantity.updateValueAndValidity();
    this.auditForm.listOfMedicalQuantity.clearValidators();
    this.auditForm.listOfMedicalQuantity.updateValueAndValidity();
    this.auditForm.medicalEmergencyQuantity.clearValidators();
    this.auditForm.medicalEmergencyQuantity.updateValueAndValidity();
    this.auditForm.nonAdhesiveDressingsQuantity.clearValidators();
    this.auditForm.nonAdhesiveDressingsQuantity.updateValueAndValidity();
    this.auditForm.resuscitationMarkQuantity.clearValidators();
    this.auditForm.resuscitationMarkQuantity.updateValueAndValidity();
    this.auditForm.safetyPinsAssortedQuantity.clearValidators();
    this.auditForm.safetyPinsAssortedQuantity.updateValueAndValidity();
    this.auditForm.sodChlorideQuantity.clearValidators();
    this.auditForm.sodChlorideQuantity.updateValueAndValidity();
    this.auditForm.accidentBookPenQuantity.clearValidators();
    this.auditForm.accidentBookPenQuantity.updateValueAndValidity();
    this.auditForm.tapeScissorsQuantity.clearValidators();
    this.auditForm.tapeScissorsQuantity.updateValueAndValidity();
    this.auditForm.telephoneQuantity.clearValidators();
    this.auditForm.telephoneQuantity.updateValueAndValidity();
    this.auditForm.triangularBandageQuantity.clearValidators();
    this.auditForm.triangularBandageQuantity.updateValueAndValidity();
    this.auditForm.woundClousreStripsQuantity.clearValidators();
    this.auditForm.woundClousreStripsQuantity.updateValueAndValidity();
    this.auditForm.guzeSwabsQuantity.clearValidators();
    this.auditForm.guzeSwabsQuantity.updateValueAndValidity();
    this.auditForm.plainScissorsQuantity.clearValidators();
    this.auditForm.plainScissorsQuantity.updateValueAndValidity();
    this.auditForm.crepeBandageSmallQuantity.clearValidators();
    this.auditForm.crepeBandageSmallQuantity.updateValueAndValidity();
    this.auditForm.crepeBandageLargeQuantity.clearValidators();
    this.auditForm.crepeBandageLargeQuantity.updateValueAndValidity();
    this.auditForm.veseline50gQuantity.clearValidators();
    this.auditForm.veseline50gQuantity.updateValueAndValidity();
    this.auditForm.microporeTapeQuantity.clearValidators();
    this.auditForm.microporeTapeQuantity.updateValueAndValidity();
    this.auditForm.defribulatorQuantity.clearValidators();
    this.auditForm.defribulatorQuantity.updateValueAndValidity();
    this.auditForm.scissorsQuantity.clearValidators();
    this.auditForm.scissorsQuantity.updateValueAndValidity();
    this.auditForm.tissuesQuantity.clearValidators();
    this.auditForm.tissuesQuantity.updateValueAndValidity();
    this.auditForm.resuscitationFlashQuantity.clearValidators();
    this.auditForm.resuscitationFlashQuantity.updateValueAndValidity();
    this.auditForm.shaverQuantity.clearValidators();
    this.auditForm.shaverQuantity.updateValueAndValidity();
    this.auditForm.cleansingWipesQuantity.clearValidators();
    this.auditForm.cleansingWipesQuantity.updateValueAndValidity();
    this.auditForm.heatRetainingWrapQuantity.clearValidators();
    this.auditForm.heatRetainingWrapQuantity.updateValueAndValidity();
    this.auditForm.nitrileGlovasQuantity.clearValidators();
    this.auditForm.nitrileGlovasQuantity.updateValueAndValidity();
    this.auditForm.sterileAdhesiveDressingsQuantity.clearValidators();
    this.auditForm.sterileAdhesiveDressingsQuantity.updateValueAndValidity();
    this.auditForm.washproofPlastersQuantity.clearValidators();
    this.auditForm.washproofPlastersQuantity.updateValueAndValidity();
    this.auditForm.bluePlastersQuantity.clearValidators();
    this.auditForm.bluePlastersQuantity.updateValueAndValidity();
    this.auditForm.burngelQuantity.clearValidators();
    this.auditForm.burngelQuantity.updateValueAndValidity();
  }

  private setCheckByRequired() {
    this.auditForm.blanketAccidentCheckBy.setValidators(Validators.required);
    this.auditForm.blanketAccidentCheckBy.updateValueAndValidity();
    this.auditForm.cottonBallsCheckBy.setValidators(Validators.required);
    this.auditForm.cottonBallsCheckBy.updateValueAndValidity();
    this.auditForm.disposableGlovesCheckBy.setValidators(Validators.required);
    this.auditForm.disposableGlovesCheckBy.updateValueAndValidity();
    this.auditForm.bottleHardPlasticCheckBy.setValidators(Validators.required);
    this.auditForm.bottleHardPlasticCheckBy.updateValueAndValidity();
    this.auditForm.crepeBandageCheckBy.setValidators(Validators.required);
    this.auditForm.crepeBandageCheckBy.updateValueAndValidity();
    this.auditForm.eyePadSterileCheckBy.setValidators(Validators.required);
    this.auditForm.eyePadSterileCheckBy.updateValueAndValidity();
    this.auditForm.freezerBagsCheckBy.setValidators(Validators.required);
    this.auditForm.freezerBagsCheckBy.updateValueAndValidity();
    this.auditForm.instantColdPackCheckBy.setValidators(Validators.required);
    this.auditForm.instantColdPackCheckBy.updateValueAndValidity();
    this.auditForm.jellyBeansCheckBy.setValidators(Validators.required);
    this.auditForm.jellyBeansCheckBy.updateValueAndValidity();
    this.auditForm.listOfMedicalCheckBy.setValidators(Validators.required);
    this.auditForm.listOfMedicalCheckBy.updateValueAndValidity();
    this.auditForm.medicalEmergencyCheckBy.setValidators(Validators.required);
    this.auditForm.medicalEmergencyCheckBy.updateValueAndValidity();
    this.auditForm.nonAdhesiveDressingsCheckBy.setValidators(Validators.required);
    this.auditForm.nonAdhesiveDressingsCheckBy.updateValueAndValidity();
    this.auditForm.resuscitationMarkCheckBy.setValidators(Validators.required);
    this.auditForm.resuscitationMarkCheckBy.updateValueAndValidity();
    this.auditForm.safetyPinsAssortedCheckBy.setValidators(Validators.required);
    this.auditForm.safetyPinsAssortedCheckBy.updateValueAndValidity();
    this.auditForm.sodChlorideCheckBy.setValidators(Validators.required);
    this.auditForm.sodChlorideCheckBy.updateValueAndValidity();
    this.auditForm.accidentBookPenCheckBy.setValidators(Validators.required);
    this.auditForm.accidentBookPenCheckBy.updateValueAndValidity();
    this.auditForm.tapeScissorsCheckBy.setValidators(Validators.required);
    this.auditForm.tapeScissorsCheckBy.updateValueAndValidity();
    this.auditForm.telephoneCheckBy.setValidators(Validators.required);
    this.auditForm.telephoneCheckBy.updateValueAndValidity();
    this.auditForm.triangularBandageCheckBy.setValidators(Validators.required);
    this.auditForm.triangularBandageCheckBy.updateValueAndValidity();
    this.auditForm.woundClousreStripsCheckBy.setValidators(Validators.required);
    this.auditForm.woundClousreStripsCheckBy.updateValueAndValidity();
    this.auditForm.guzeSwabsCheckBy.setValidators(Validators.required);
    this.auditForm.guzeSwabsCheckBy.updateValueAndValidity();
    this.auditForm.plainScissorsCheckBy.setValidators(Validators.required);
    this.auditForm.plainScissorsCheckBy.updateValueAndValidity();
    this.auditForm.crepeBandageSmallCheckBy.setValidators(Validators.required);
    this.auditForm.crepeBandageSmallCheckBy.updateValueAndValidity();
    this.auditForm.crepeBandageLargeCheckBy.setValidators(Validators.required);
    this.auditForm.crepeBandageLargeCheckBy.updateValueAndValidity();
    this.auditForm.veseline50gCheckBy.setValidators(Validators.required);
    this.auditForm.veseline50gCheckBy.updateValueAndValidity();
    this.auditForm.microporeTapeCheckBy.setValidators(Validators.required);
    this.auditForm.microporeTapeCheckBy.updateValueAndValidity();
    this.auditForm.defribulatorCheckBy.setValidators(Validators.required);
    this.auditForm.defribulatorCheckBy.updateValueAndValidity();
    this.auditForm.scissorsCheckBy.setValidators(Validators.required);
    this.auditForm.scissorsCheckBy.updateValueAndValidity();
    this.auditForm.tissuesCheckBy.setValidators(Validators.required);
    this.auditForm.tissuesCheckBy.updateValueAndValidity();
    this.auditForm.resuscitationFlashCheckBy.setValidators(Validators.required);
    this.auditForm.resuscitationFlashCheckBy.updateValueAndValidity();
    this.auditForm.shaverCheckBy.setValidators(Validators.required);
    this.auditForm.shaverCheckBy.updateValueAndValidity();
    this.auditForm.cleansingWipesCheckBy.setValidators(Validators.required);
    this.auditForm.cleansingWipesCheckBy.updateValueAndValidity();
    this.auditForm.heatRetainingWrapCheckBy.setValidators(Validators.required);
    this.auditForm.heatRetainingWrapCheckBy.updateValueAndValidity();
    this.auditForm.nitrileGlovasCheckBy.setValidators(Validators.required);
    this.auditForm.nitrileGlovasCheckBy.updateValueAndValidity();
    this.auditForm.sterileAdhesiveDressingsCheckBy.setValidators(Validators.required);
    this.auditForm.sterileAdhesiveDressingsCheckBy.updateValueAndValidity();
    this.auditForm.washproofPlastersCheckBy.setValidators(Validators.required);
    this.auditForm.washproofPlastersCheckBy.updateValueAndValidity();
    this.auditForm.bluePlastersCheckBy.setValidators(Validators.required);
    this.auditForm.bluePlastersCheckBy.updateValueAndValidity();
    this.auditForm.burngelCheckBy.setValidators(Validators.required);
    this.auditForm.burngelCheckBy.updateValueAndValidity();
  }

  private setCheckbyOptional() {
    this.auditForm.blanketAccidentCheckBy.clearValidators();
    this.auditForm.blanketAccidentCheckBy.updateValueAndValidity();
    this.auditForm.cottonBallsCheckBy.clearValidators();
    this.auditForm.cottonBallsCheckBy.updateValueAndValidity();
    this.auditForm.disposableGlovesCheckBy.clearValidators();
    this.auditForm.disposableGlovesCheckBy.updateValueAndValidity();
    this.auditForm.bottleHardPlasticCheckBy.clearValidators();
    this.auditForm.bottleHardPlasticCheckBy.updateValueAndValidity();
    this.auditForm.crepeBandageCheckBy.clearValidators();
    this.auditForm.crepeBandageCheckBy.updateValueAndValidity();
    this.auditForm.eyePadSterileCheckBy.clearValidators();
    this.auditForm.eyePadSterileCheckBy.updateValueAndValidity();
    this.auditForm.freezerBagsCheckBy.clearValidators();
    this.auditForm.freezerBagsCheckBy.updateValueAndValidity();
    this.auditForm.instantColdPackCheckBy.clearValidators();
    this.auditForm.instantColdPackCheckBy.updateValueAndValidity();
    this.auditForm.jellyBeansCheckBy.clearValidators();
    this.auditForm.jellyBeansCheckBy.updateValueAndValidity();
    this.auditForm.listOfMedicalCheckBy.clearValidators();
    this.auditForm.listOfMedicalCheckBy.updateValueAndValidity();
    this.auditForm.medicalEmergencyCheckBy.clearValidators();
    this.auditForm.medicalEmergencyCheckBy.updateValueAndValidity();
    this.auditForm.nonAdhesiveDressingsCheckBy.clearValidators();
    this.auditForm.nonAdhesiveDressingsCheckBy.updateValueAndValidity();
    this.auditForm.resuscitationMarkCheckBy.clearValidators();
    this.auditForm.resuscitationMarkCheckBy.updateValueAndValidity();
    this.auditForm.safetyPinsAssortedCheckBy.clearValidators();
    this.auditForm.safetyPinsAssortedCheckBy.updateValueAndValidity();
    this.auditForm.sodChlorideCheckBy.clearValidators();
    this.auditForm.sodChlorideCheckBy.updateValueAndValidity();
    this.auditForm.accidentBookPenCheckBy.clearValidators();
    this.auditForm.accidentBookPenCheckBy.updateValueAndValidity();
    this.auditForm.tapeScissorsCheckBy.clearValidators();
    this.auditForm.tapeScissorsCheckBy.updateValueAndValidity();
    this.auditForm.telephoneCheckBy.clearValidators();
    this.auditForm.telephoneCheckBy.updateValueAndValidity();
    this.auditForm.triangularBandageCheckBy.clearValidators();
    this.auditForm.triangularBandageCheckBy.updateValueAndValidity();
    this.auditForm.woundClousreStripsCheckBy.clearValidators();
    this.auditForm.woundClousreStripsCheckBy.updateValueAndValidity();
    this.auditForm.guzeSwabsCheckBy.clearValidators();
    this.auditForm.guzeSwabsCheckBy.updateValueAndValidity();
    this.auditForm.plainScissorsCheckBy.clearValidators();
    this.auditForm.plainScissorsCheckBy.updateValueAndValidity();
    this.auditForm.crepeBandageSmallCheckBy.clearValidators();
    this.auditForm.crepeBandageSmallCheckBy.updateValueAndValidity();
    this.auditForm.crepeBandageLargeCheckBy.clearValidators();
    this.auditForm.crepeBandageLargeCheckBy.updateValueAndValidity();
    this.auditForm.veseline50gCheckBy.clearValidators();
    this.auditForm.veseline50gCheckBy.updateValueAndValidity();
    this.auditForm.microporeTapeCheckBy.clearValidators();
    this.auditForm.microporeTapeCheckBy.updateValueAndValidity();
    this.auditForm.defribulatorCheckBy.clearValidators();
    this.auditForm.defribulatorCheckBy.updateValueAndValidity();
    this.auditForm.scissorsCheckBy.clearValidators();
    this.auditForm.scissorsCheckBy.updateValueAndValidity();
    this.auditForm.tissuesCheckBy.clearValidators();
    this.auditForm.tissuesCheckBy.updateValueAndValidity();
    this.auditForm.resuscitationFlashCheckBy.clearValidators();
    this.auditForm.resuscitationFlashCheckBy.updateValueAndValidity();
    this.auditForm.shaverCheckBy.clearValidators();
    this.auditForm.shaverCheckBy.updateValueAndValidity();
    this.auditForm.cleansingWipesCheckBy.clearValidators();
    this.auditForm.cleansingWipesCheckBy.updateValueAndValidity();
    this.auditForm.heatRetainingWrapCheckBy.clearValidators();
    this.auditForm.heatRetainingWrapCheckBy.updateValueAndValidity();
    this.auditForm.nitrileGlovasCheckBy.clearValidators();
    this.auditForm.nitrileGlovasCheckBy.updateValueAndValidity();
    this.auditForm.sterileAdhesiveDressingsCheckBy.clearValidators();
    this.auditForm.sterileAdhesiveDressingsCheckBy.updateValueAndValidity();
    this.auditForm.washproofPlastersCheckBy.clearValidators();
    this.auditForm.washproofPlastersCheckBy.updateValueAndValidity();
    this.auditForm.bluePlastersCheckBy.clearValidators();
    this.auditForm.bluePlastersCheckBy.updateValueAndValidity();
    this.auditForm.burngelCheckBy.clearValidators();
    this.auditForm.burngelCheckBy.updateValueAndValidity();
  }

  private getFormEight(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formEightService.getForm(id).subscribe((response) => {
        if (response) {
          this.getUsers(response.locationId);
          this.auditForm = new AuditFormEightForm(response);
          this.completeForm();
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
