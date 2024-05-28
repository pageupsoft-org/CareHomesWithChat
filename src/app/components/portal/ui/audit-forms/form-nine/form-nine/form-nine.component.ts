import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormNineService } from 'src/app/services/form-nine.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { RiskEntry } from 'src/app/shared/enums/risk-entry.enum';
import { AuditFormNine } from 'src/app/shared/models/audit-form-nine';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/util/Constants';

@Component({
  selector: 'app-form-nine',
  templateUrl: './form-nine.component.html',
  styleUrls: ['./form-nine.component.scss'],
})
export class FormNineComponent extends BaseComponent implements OnInit {
  @Output() getForms: EventEmitter<any> = new EventEmitter<any>();

  public locationList: Array<Location> = [];
  public userList: Array<User> = [];
  public auditForm: FormGroup;
  public riskAction = RiskEntry;
  public isEdit: boolean = false;
  public isFilling: boolean = false;
  public createForm: boolean = false;

  constructor(
    private locationService: LocationServices,
    private userService: UserService,
    private formnineService: FormNineService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.getLocations();
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.getFormNine(this.route.snapshot.params['id']);
    } else {
      this.auditForm = this.fb.group({
        id: [0],
        auditDate: [null],
        auditedBy: [null, Validators.required],

        deliveriesPutAwayAction: [true],
        deliveriesPutAwayComment: [null, Validators.maxLength(200)],

        rawOtherFoodsStoredAction: [true],
        rawOtherFoodsStoredComment: [null, Validators.maxLength(200)],

        foodSuitablyCoveredAction: [true],
        foodSuitablyCoveredComment: [null, Validators.maxLength(200)],

        foodGradeMaterialAction: [true],
        foodGradeMaterialComment: [null, Validators.maxLength(200)],

        noFoodOpenedAction: [true],
        noFoodOpenedComment: [null, Validators.maxLength(200)],

        foodClearAction: [true],
        foodClearComment: [null, Validators.maxLength(200)],

        noUnnecessaryGlassAction: [true],
        noUnnecessaryGlassComment: [null, Validators.maxLength(200)],

        noDirtyPackagingAction: [true],
        noDirtyPackagingComment: [null, Validators.maxLength(200)],

        noOverStockingAction: [true],
        noOverStockingComment: [null, Validators.maxLength(200)],

        foodInProcessAction: [true],
        foodInProcessComment: [null, Validators.maxLength(200)],

        noExcessiveHandlingAction: [true],
        noExcessiveHandlingComment: [null, Validators.maxLength(200)],

        noHighRiskUseRawEggsAction: [true],
        noHighRiskUseRawEggsComment: [null, Validators.maxLength(200)],

        adequateSeparationActivitiesAction: [true],
        adequateSeparationActivitiesComment: [null, Validators.maxLength(200)],

        quantitiesOfTemperatureAction: [true],
        quantitiesOfTemperatureComment: [null, Validators.maxLength(200)],

        sufficientkitchenEquipmentAction: [true],
        sufficientkitchenEquipmentComment: [null, Validators.maxLength(200)],

        staffFacilitiesCleanAction: [true],
        staffFacilitiesCleanComment: [null, Validators.maxLength(200)],

        staffAppearanceSatisfactoryAction: [true],
        staffAppearanceSatisfactoryComment: [null, Validators.maxLength(200)],

        adequateProtectiveClothingAction: [true],
        adequateProtectiveClothingComment: [null, Validators.maxLength(200)],

        noBadHabitsPracticesAction: [true],
        noBadHabitsPracticesComment: [null, Validators.maxLength(200)],

        handWashDisciplinesAction: [true],
        handWashDisciplinesComment: [null, Validators.maxLength(200)],

        handWashBasinsStockedAction: [true],
        handWashBasinsStockedComment: [null, Validators.maxLength(200)],

        noticeInStaffToiletAction: [true],
        noticeInStaffToiletComment: [null, Validators.maxLength(200)],

        firstAidAvailableInKitchenAction: [true],
        firstAidAvailableInKitchenComment: [null, Validators.maxLength(200)],

        fridgesAtZeroToFiveCAction: [true],
        fridgesAtZeroToFiveCComment: [null, Validators.maxLength(200)],

        fridgesBelow18Action: [true],
        fridgesBelow18Comment: [null, Validators.maxLength(200)],

        thermometerOrCasingDisplayAction: [true],
        thermometerOrCasingDisplayComment: [null, Validators.maxLength(200)],

        thermometerDisinfectantWipesAction: [true],
        thermometerDisinfectantWipesComment: [null, Validators.maxLength(200)],

        foodInProcessOfPreparationAction: [true],
        foodInProcessOfPreparationComment: [null, Validators.maxLength(200)],

        foodStoredCorrectlyAction: [true],
        foodStoredCorrectlyComment: [null, Validators.maxLength(200)],

        frozenFoodSuitablyAction: [true],
        frozenFoodSuitablyComment: [null, Validators.maxLength(200)],

        foodCookedReheatedAction: [true],
        foodCookedReheatedComment: [null, Validators.maxLength(200)],

        thermometerUseVerifyFoodTempAction: [true],
        thermometerUseVerifyFoodTempComment: [null, Validators.maxLength(200)],

        noMisuseEquipmentAction: [true],
        noMisuseEquipmentComment: [null, Validators.maxLength(200)],

        hotFoodCoolingPeriodAction: [true],
        hotFoodCoolingPeriodComment: [null, Validators.maxLength(200)],

        foodDisplayedAction: [true],
        foodDisplayedComment: [null, Validators.maxLength(200)],

        foodDisplayedTempControlAction: [true],
        foodDisplayedTempControlComment: [null, Validators.maxLength(200)],

        separateDirtyEquipmentAction: [true],
        separateDirtyEquipmentComment: [null, Validators.maxLength(200)],

        visualStandardsOfHousekeepingAction: [true],
        visualStandardsOfHousekeepingComment: [null, Validators.maxLength(200)],

        apparentAction: [true],
        apparentComment: [null, Validators.maxLength(200)],

        cleaningScheduleAction: [true],
        cleaningScheduleComment: [null, Validators.maxLength(200)],

        cleaningChemicalsAvailableAction: [true],
        cleaningChemicalsAvailableComment: [null, Validators.maxLength(200)],

        sufficientCleaningEquipmentAction: [true],
        sufficientCleaningEquipmentComment: [null, Validators.maxLength(200)],

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
          let formNine = new AuditFormNine();
          formNine.auditDate = new Date(new Date(this.auditForm.controls['auditDate'].value).setMonth(new Date(this.auditForm.controls['auditDate'].value).getMonth() + 1));
          formNine.auditedBy = this.auditForm.controls['auditedBy'].value;
          formNine.locationId = this.auditForm.controls['locationId'].value;
          formNine.careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
          formNine.createdAt = new Date();
          formNine.createdBy = this.currentUserId;
          this.formnineService.addForm(formNine).subscribe();
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
    if (
      this.currentUserRole == this.userType.SuperUser ||
      this.currentUserRole == this.userType.Admin
    ) {
      this.auditForm.controls['signoffBy'].setValue(this.currentUserId);
    }
  }



  private addForm() {
    this.SetLoading(true);
    this.formnineService.addForm(this.auditForm.value).subscribe(
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
    this.formnineService.updateForm(this.auditForm.value).subscribe(
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
        console.error('could not fetch locations ::' +err.error);
      }
    );
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


  private getFormNine(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formnineService.getForm(id).subscribe(
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

    this.auditForm.controls['deliveriesPutAwayAction'].setValidators(Validators.required);
    this.auditForm.controls['deliveriesPutAwayAction'].updateValueAndValidity();
    this.auditForm.controls['deliveriesPutAwayComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['deliveriesPutAwayComment'].updateValueAndValidity();

    this.auditForm.controls['rawOtherFoodsStoredAction'].setValidators(Validators.required);
    this.auditForm.controls['rawOtherFoodsStoredAction'].updateValueAndValidity();
    this.auditForm.controls['rawOtherFoodsStoredComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['rawOtherFoodsStoredComment'].updateValueAndValidity();

    this.auditForm.controls['foodSuitablyCoveredAction'].setValidators(Validators.required);
    this.auditForm.controls['foodSuitablyCoveredAction'].updateValueAndValidity();
    this.auditForm.controls['foodSuitablyCoveredComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['foodSuitablyCoveredComment'].updateValueAndValidity();

    this.auditForm.controls['foodGradeMaterialAction'].setValidators(Validators.required);
    this.auditForm.controls['foodGradeMaterialAction'].updateValueAndValidity();
    this.auditForm.controls['foodGradeMaterialComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['foodGradeMaterialComment'].updateValueAndValidity();

    this.auditForm.controls['noFoodOpenedAction'].setValidators(Validators.required);
    this.auditForm.controls['noFoodOpenedAction'].updateValueAndValidity();
    this.auditForm.controls['noFoodOpenedComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['noFoodOpenedComment'].updateValueAndValidity();

    this.auditForm.controls['foodClearAction'].setValidators(Validators.required);
    this.auditForm.controls['foodClearAction'].updateValueAndValidity();
    this.auditForm.controls['foodClearComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['foodClearComment'].updateValueAndValidity();

    this.auditForm.controls['noUnnecessaryGlassAction'].setValidators(Validators.required);
    this.auditForm.controls['noUnnecessaryGlassAction'].updateValueAndValidity();
    this.auditForm.controls['noUnnecessaryGlassComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['noUnnecessaryGlassComment'].updateValueAndValidity();

    this.auditForm.controls['noDirtyPackagingAction'].setValidators(Validators.required);
    this.auditForm.controls['noDirtyPackagingAction'].updateValueAndValidity();
    this.auditForm.controls['noDirtyPackagingComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['noDirtyPackagingComment'].updateValueAndValidity();

    this.auditForm.controls['noOverStockingAction'].setValidators(Validators.required);
    this.auditForm.controls['noOverStockingAction'].updateValueAndValidity();
    this.auditForm.controls['noOverStockingComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['noOverStockingComment'].updateValueAndValidity();

    this.auditForm.controls['foodInProcessAction'].setValidators(Validators.required);
    this.auditForm.controls['foodInProcessAction'].updateValueAndValidity();
    this.auditForm.controls['foodInProcessComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['foodInProcessComment'].updateValueAndValidity();

    this.auditForm.controls['noExcessiveHandlingAction'].setValidators(Validators.required);
    this.auditForm.controls['noExcessiveHandlingAction'].updateValueAndValidity();
    this.auditForm.controls['noExcessiveHandlingComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['noExcessiveHandlingComment'].updateValueAndValidity();

    this.auditForm.controls['noHighRiskUseRawEggsAction'].setValidators(Validators.required);
    this.auditForm.controls['noHighRiskUseRawEggsAction'].updateValueAndValidity();
    this.auditForm.controls['noHighRiskUseRawEggsComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['noHighRiskUseRawEggsComment'].updateValueAndValidity();

    this.auditForm.controls['adequateSeparationActivitiesAction'].setValidators(Validators.required);
    this.auditForm.controls['adequateSeparationActivitiesAction'].updateValueAndValidity();
    this.auditForm.controls['adequateSeparationActivitiesComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['adequateSeparationActivitiesComment'].updateValueAndValidity();

    this.auditForm.controls['quantitiesOfTemperatureAction'].setValidators(Validators.required);
    this.auditForm.controls['quantitiesOfTemperatureAction'].updateValueAndValidity();
    this.auditForm.controls['quantitiesOfTemperatureComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['quantitiesOfTemperatureComment'].updateValueAndValidity();

    this.auditForm.controls['sufficientkitchenEquipmentAction'].setValidators(Validators.required);
    this.auditForm.controls['sufficientkitchenEquipmentAction'].updateValueAndValidity();
    this.auditForm.controls['sufficientkitchenEquipmentComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['sufficientkitchenEquipmentComment'].updateValueAndValidity();

    this.auditForm.controls['staffFacilitiesCleanAction'].setValidators(Validators.required);
    this.auditForm.controls['staffFacilitiesCleanAction'].updateValueAndValidity();
    this.auditForm.controls['staffFacilitiesCleanComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['staffFacilitiesCleanComment'].updateValueAndValidity();

    this.auditForm.controls['staffAppearanceSatisfactoryAction'].setValidators(Validators.required);
    this.auditForm.controls['staffAppearanceSatisfactoryAction'].updateValueAndValidity();
    this.auditForm.controls['staffAppearanceSatisfactoryComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['staffAppearanceSatisfactoryComment'].updateValueAndValidity();

    this.auditForm.controls['adequateProtectiveClothingAction'].setValidators(Validators.required);
    this.auditForm.controls['adequateProtectiveClothingAction'].updateValueAndValidity();
    this.auditForm.controls['adequateProtectiveClothingComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['adequateProtectiveClothingComment'].updateValueAndValidity();

    this.auditForm.controls['noBadHabitsPracticesAction'].setValidators(Validators.required);
    this.auditForm.controls['noBadHabitsPracticesAction'].updateValueAndValidity();
    this.auditForm.controls['noBadHabitsPracticesComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['noBadHabitsPracticesComment'].updateValueAndValidity();

    this.auditForm.controls['handWashDisciplinesAction'].setValidators(Validators.required);
    this.auditForm.controls['handWashDisciplinesAction'].updateValueAndValidity();
    this.auditForm.controls['handWashDisciplinesComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['handWashDisciplinesComment'].updateValueAndValidity();

    this.auditForm.controls['handWashBasinsStockedAction'].setValidators(Validators.required);
    this.auditForm.controls['handWashBasinsStockedAction'].updateValueAndValidity();
    this.auditForm.controls['handWashBasinsStockedComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['handWashBasinsStockedComment'].updateValueAndValidity();

    this.auditForm.controls['noticeInStaffToiletAction'].setValidators(Validators.required);
    this.auditForm.controls['noticeInStaffToiletAction'].updateValueAndValidity();
    this.auditForm.controls['noticeInStaffToiletComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['noticeInStaffToiletComment'].updateValueAndValidity();

    this.auditForm.controls['firstAidAvailableInKitchenAction'].setValidators(Validators.required);
    this.auditForm.controls['firstAidAvailableInKitchenAction'].updateValueAndValidity();
    this.auditForm.controls['firstAidAvailableInKitchenComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['firstAidAvailableInKitchenComment'].updateValueAndValidity();

    this.auditForm.controls['fridgesAtZeroToFiveCAction'].setValidators(Validators.required);
    this.auditForm.controls['fridgesAtZeroToFiveCAction'].updateValueAndValidity();
    this.auditForm.controls['fridgesAtZeroToFiveCComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['fridgesAtZeroToFiveCComment'].updateValueAndValidity();

    this.auditForm.controls['fridgesBelow18Action'].setValidators(Validators.required);
    this.auditForm.controls['fridgesBelow18Action'].updateValueAndValidity();
    this.auditForm.controls['fridgesBelow18Comment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['fridgesBelow18Comment'].updateValueAndValidity();

    this.auditForm.controls['thermometerOrCasingDisplayAction'].setValidators(Validators.required);
    this.auditForm.controls['thermometerOrCasingDisplayAction'].updateValueAndValidity();
    this.auditForm.controls['thermometerOrCasingDisplayComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['thermometerOrCasingDisplayComment'].updateValueAndValidity();

    this.auditForm.controls['thermometerDisinfectantWipesAction'].setValidators(Validators.required);
    this.auditForm.controls['thermometerDisinfectantWipesAction'].updateValueAndValidity();
    this.auditForm.controls['thermometerDisinfectantWipesComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['thermometerDisinfectantWipesComment'].updateValueAndValidity();

    this.auditForm.controls['foodInProcessOfPreparationAction'].setValidators(Validators.required);
    this.auditForm.controls['foodInProcessOfPreparationAction'].updateValueAndValidity();
    this.auditForm.controls['foodInProcessOfPreparationComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['foodInProcessOfPreparationComment'].updateValueAndValidity();

    this.auditForm.controls['foodStoredCorrectlyAction'].setValidators(Validators.required);
    this.auditForm.controls['foodStoredCorrectlyAction'].updateValueAndValidity();
    this.auditForm.controls['foodStoredCorrectlyComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['foodStoredCorrectlyComment'].updateValueAndValidity();

    this.auditForm.controls['frozenFoodSuitablyAction'].setValidators(Validators.required);
    this.auditForm.controls['frozenFoodSuitablyAction'].updateValueAndValidity();
    this.auditForm.controls['frozenFoodSuitablyComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['frozenFoodSuitablyComment'].updateValueAndValidity();

    this.auditForm.controls['foodCookedReheatedAction'].setValidators(Validators.required);
    this.auditForm.controls['foodCookedReheatedAction'].updateValueAndValidity();
    this.auditForm.controls['foodCookedReheatedComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['foodCookedReheatedComment'].updateValueAndValidity();

    this.auditForm.controls['thermometerUseVerifyFoodTempAction'].setValidators(Validators.required);
    this.auditForm.controls['thermometerUseVerifyFoodTempAction'].updateValueAndValidity();
    this.auditForm.controls['thermometerUseVerifyFoodTempComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['thermometerUseVerifyFoodTempComment'].updateValueAndValidity();

    this.auditForm.controls['noMisuseEquipmentAction'].setValidators(Validators.required);
    this.auditForm.controls['noMisuseEquipmentAction'].updateValueAndValidity();
    this.auditForm.controls['noMisuseEquipmentComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['noMisuseEquipmentComment'].updateValueAndValidity();

    this.auditForm.controls['hotFoodCoolingPeriodAction'].setValidators(Validators.required);
    this.auditForm.controls['hotFoodCoolingPeriodAction'].updateValueAndValidity();
    this.auditForm.controls['hotFoodCoolingPeriodComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['hotFoodCoolingPeriodComment'].updateValueAndValidity();

    this.auditForm.controls['foodDisplayedAction'].setValidators(Validators.required);
    this.auditForm.controls['foodDisplayedAction'].updateValueAndValidity();
    this.auditForm.controls['foodDisplayedComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['foodDisplayedComment'].updateValueAndValidity();

    this.auditForm.controls['foodDisplayedTempControlAction'].setValidators(Validators.required);
    this.auditForm.controls['foodDisplayedTempControlAction'].updateValueAndValidity();
    this.auditForm.controls['foodDisplayedTempControlComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['foodDisplayedTempControlComment'].updateValueAndValidity();

    this.auditForm.controls['separateDirtyEquipmentAction'].setValidators(Validators.required);
    this.auditForm.controls['separateDirtyEquipmentAction'].updateValueAndValidity();
    this.auditForm.controls['separateDirtyEquipmentComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['separateDirtyEquipmentComment'].updateValueAndValidity();

    this.auditForm.controls['visualStandardsOfHousekeepingAction'].setValidators(Validators.required);
    this.auditForm.controls['visualStandardsOfHousekeepingAction'].updateValueAndValidity();
    this.auditForm.controls['visualStandardsOfHousekeepingComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['visualStandardsOfHousekeepingComment'].updateValueAndValidity();

    this.auditForm.controls['apparentAction'].setValidators(Validators.required);
    this.auditForm.controls['apparentAction'].updateValueAndValidity();
    this.auditForm.controls['apparentComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['apparentComment'].updateValueAndValidity();

    this.auditForm.controls['cleaningScheduleAction'].setValidators(Validators.required);
    this.auditForm.controls['cleaningScheduleAction'].updateValueAndValidity();
    this.auditForm.controls['cleaningScheduleComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['cleaningScheduleComment'].updateValueAndValidity();

    this.auditForm.controls['cleaningChemicalsAvailableAction'].setValidators(Validators.required);
    this.auditForm.controls['cleaningChemicalsAvailableAction'].updateValueAndValidity();
    this.auditForm.controls['cleaningChemicalsAvailableComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['cleaningChemicalsAvailableComment'].updateValueAndValidity();

    this.auditForm.controls['sufficientCleaningEquipmentAction'].setValidators(Validators.required);
    this.auditForm.controls['sufficientCleaningEquipmentAction'].updateValueAndValidity();
    this.auditForm.controls['sufficientCleaningEquipmentComment'].setValidators(Validators.maxLength(200));
    this.auditForm.controls['sufficientCleaningEquipmentComment'].updateValueAndValidity();

  }

  private removeValidation() {
    this.auditForm.controls['auditDate'].clearValidators();
    this.auditForm.controls['auditDate'].updateValueAndValidity();
    this.auditForm.controls['signoffBy'].clearValidators();
    this.auditForm.controls['signoffBy'].updateValueAndValidity();

    this.auditForm.controls['deliveriesPutAwayAction'].clearValidators();
    this.auditForm.controls['deliveriesPutAwayAction'].updateValueAndValidity();
    this.auditForm.controls['deliveriesPutAwayComment'].clearValidators();
    this.auditForm.controls['deliveriesPutAwayComment'].updateValueAndValidity();

    this.auditForm.controls['rawOtherFoodsStoredAction'].clearValidators();
    this.auditForm.controls['rawOtherFoodsStoredAction'].updateValueAndValidity();
    this.auditForm.controls['rawOtherFoodsStoredComment'].clearValidators();
    this.auditForm.controls['rawOtherFoodsStoredComment'].updateValueAndValidity();

    this.auditForm.controls['foodSuitablyCoveredAction'].clearValidators();
    this.auditForm.controls['foodSuitablyCoveredAction'].updateValueAndValidity();
    this.auditForm.controls['foodSuitablyCoveredComment'].clearValidators();
    this.auditForm.controls['foodSuitablyCoveredComment'].updateValueAndValidity();

    this.auditForm.controls['foodGradeMaterialAction'].clearValidators();
    this.auditForm.controls['foodGradeMaterialAction'].updateValueAndValidity();
    this.auditForm.controls['foodGradeMaterialComment'].clearValidators();
    this.auditForm.controls['foodGradeMaterialComment'].updateValueAndValidity();

    this.auditForm.controls['noFoodOpenedAction'].clearValidators();
    this.auditForm.controls['noFoodOpenedAction'].updateValueAndValidity();
    this.auditForm.controls['noFoodOpenedComment'].clearValidators();
    this.auditForm.controls['noFoodOpenedComment'].updateValueAndValidity();

    this.auditForm.controls['foodClearAction'].clearValidators();
    this.auditForm.controls['foodClearAction'].updateValueAndValidity();
    this.auditForm.controls['foodClearComment'].clearValidators();
    this.auditForm.controls['foodClearComment'].updateValueAndValidity();

    this.auditForm.controls['noUnnecessaryGlassAction'].clearValidators();
    this.auditForm.controls['noUnnecessaryGlassAction'].updateValueAndValidity();
    this.auditForm.controls['noUnnecessaryGlassComment'].clearValidators();
    this.auditForm.controls['noUnnecessaryGlassComment'].updateValueAndValidity();

    this.auditForm.controls['noDirtyPackagingAction'].clearValidators();
    this.auditForm.controls['noDirtyPackagingAction'].updateValueAndValidity();
    this.auditForm.controls['noDirtyPackagingComment'].clearValidators();
    this.auditForm.controls['noDirtyPackagingComment'].updateValueAndValidity();

    this.auditForm.controls['noOverStockingAction'].clearValidators();
    this.auditForm.controls['noOverStockingAction'].updateValueAndValidity();
    this.auditForm.controls['noOverStockingComment'].clearValidators();
    this.auditForm.controls['noOverStockingComment'].updateValueAndValidity();

    this.auditForm.controls['foodInProcessAction'].clearValidators();
    this.auditForm.controls['foodInProcessAction'].updateValueAndValidity();
    this.auditForm.controls['foodInProcessComment'].clearValidators();
    this.auditForm.controls['foodInProcessComment'].updateValueAndValidity();

    this.auditForm.controls['noExcessiveHandlingAction'].clearValidators();
    this.auditForm.controls['noExcessiveHandlingAction'].updateValueAndValidity();
    this.auditForm.controls['noExcessiveHandlingComment'].clearValidators();
    this.auditForm.controls['noExcessiveHandlingComment'].updateValueAndValidity();

    this.auditForm.controls['noHighRiskUseRawEggsAction'].clearValidators();
    this.auditForm.controls['noHighRiskUseRawEggsAction'].updateValueAndValidity();
    this.auditForm.controls['noHighRiskUseRawEggsComment'].clearValidators();
    this.auditForm.controls['noHighRiskUseRawEggsComment'].updateValueAndValidity();

    this.auditForm.controls['adequateSeparationActivitiesAction'].clearValidators();
    this.auditForm.controls['adequateSeparationActivitiesAction'].updateValueAndValidity();
    this.auditForm.controls['adequateSeparationActivitiesComment'].clearValidators();
    this.auditForm.controls['adequateSeparationActivitiesComment'].updateValueAndValidity();

    this.auditForm.controls['quantitiesOfTemperatureAction'].clearValidators();
    this.auditForm.controls['quantitiesOfTemperatureAction'].updateValueAndValidity();
    this.auditForm.controls['quantitiesOfTemperatureComment'].clearValidators();
    this.auditForm.controls['quantitiesOfTemperatureComment'].updateValueAndValidity();

    this.auditForm.controls['sufficientkitchenEquipmentAction'].clearValidators();
    this.auditForm.controls['sufficientkitchenEquipmentAction'].updateValueAndValidity();
    this.auditForm.controls['sufficientkitchenEquipmentComment'].clearValidators();
    this.auditForm.controls['sufficientkitchenEquipmentComment'].updateValueAndValidity();

    this.auditForm.controls['staffFacilitiesCleanAction'].clearValidators();
    this.auditForm.controls['staffFacilitiesCleanAction'].updateValueAndValidity();
    this.auditForm.controls['staffFacilitiesCleanComment'].clearValidators();
    this.auditForm.controls['staffFacilitiesCleanComment'].updateValueAndValidity();

    this.auditForm.controls['staffAppearanceSatisfactoryAction'].clearValidators();
    this.auditForm.controls['staffAppearanceSatisfactoryAction'].updateValueAndValidity();
    this.auditForm.controls['staffAppearanceSatisfactoryComment'].clearValidators();
    this.auditForm.controls['staffAppearanceSatisfactoryComment'].updateValueAndValidity();

    this.auditForm.controls['adequateProtectiveClothingAction'].clearValidators();
    this.auditForm.controls['adequateProtectiveClothingAction'].updateValueAndValidity();
    this.auditForm.controls['adequateProtectiveClothingComment'].clearValidators();
    this.auditForm.controls['adequateProtectiveClothingComment'].updateValueAndValidity();

    this.auditForm.controls['noBadHabitsPracticesAction'].clearValidators();
    this.auditForm.controls['noBadHabitsPracticesAction'].updateValueAndValidity();
    this.auditForm.controls['noBadHabitsPracticesComment'].clearValidators();
    this.auditForm.controls['noBadHabitsPracticesComment'].updateValueAndValidity();

    this.auditForm.controls['handWashDisciplinesAction'].clearValidators();
    this.auditForm.controls['handWashDisciplinesAction'].updateValueAndValidity();
    this.auditForm.controls['handWashDisciplinesComment'].clearValidators();
    this.auditForm.controls['handWashDisciplinesComment'].updateValueAndValidity();

    this.auditForm.controls['handWashBasinsStockedAction'].clearValidators();
    this.auditForm.controls['handWashBasinsStockedAction'].updateValueAndValidity();
    this.auditForm.controls['handWashBasinsStockedComment'].clearValidators();
    this.auditForm.controls['handWashBasinsStockedComment'].updateValueAndValidity();

    this.auditForm.controls['noticeInStaffToiletAction'].clearValidators();
    this.auditForm.controls['noticeInStaffToiletAction'].updateValueAndValidity();
    this.auditForm.controls['noticeInStaffToiletComment'].clearValidators();
    this.auditForm.controls['noticeInStaffToiletComment'].updateValueAndValidity();

    this.auditForm.controls['firstAidAvailableInKitchenAction'].clearValidators();
    this.auditForm.controls['firstAidAvailableInKitchenAction'].updateValueAndValidity();
    this.auditForm.controls['firstAidAvailableInKitchenComment'].clearValidators();
    this.auditForm.controls['firstAidAvailableInKitchenComment'].updateValueAndValidity();

    this.auditForm.controls['fridgesAtZeroToFiveCAction'].clearValidators();
    this.auditForm.controls['fridgesAtZeroToFiveCAction'].updateValueAndValidity();
    this.auditForm.controls['fridgesAtZeroToFiveCComment'].clearValidators();
    this.auditForm.controls['fridgesAtZeroToFiveCComment'].updateValueAndValidity();

    this.auditForm.controls['fridgesBelow18Action'].clearValidators();
    this.auditForm.controls['fridgesBelow18Action'].updateValueAndValidity();
    this.auditForm.controls['fridgesBelow18Comment'].clearValidators();
    this.auditForm.controls['fridgesBelow18Comment'].updateValueAndValidity();

    this.auditForm.controls['thermometerOrCasingDisplayAction'].clearValidators();
    this.auditForm.controls['thermometerOrCasingDisplayAction'].updateValueAndValidity();
    this.auditForm.controls['thermometerOrCasingDisplayComment'].clearValidators();
    this.auditForm.controls['thermometerOrCasingDisplayComment'].updateValueAndValidity();

    this.auditForm.controls['thermometerDisinfectantWipesAction'].clearValidators();
    this.auditForm.controls['thermometerDisinfectantWipesAction'].updateValueAndValidity();
    this.auditForm.controls['thermometerDisinfectantWipesComment'].clearValidators();
    this.auditForm.controls['thermometerDisinfectantWipesComment'].updateValueAndValidity();

    this.auditForm.controls['foodInProcessOfPreparationAction'].clearValidators();
    this.auditForm.controls['foodInProcessOfPreparationAction'].updateValueAndValidity();
    this.auditForm.controls['foodInProcessOfPreparationComment'].clearValidators();
    this.auditForm.controls['foodInProcessOfPreparationComment'].updateValueAndValidity();

    this.auditForm.controls['foodStoredCorrectlyAction'].clearValidators();
    this.auditForm.controls['foodStoredCorrectlyAction'].updateValueAndValidity();
    this.auditForm.controls['foodStoredCorrectlyComment'].clearValidators();
    this.auditForm.controls['foodStoredCorrectlyComment'].updateValueAndValidity();

    this.auditForm.controls['frozenFoodSuitablyAction'].clearValidators();
    this.auditForm.controls['frozenFoodSuitablyAction'].updateValueAndValidity();
    this.auditForm.controls['frozenFoodSuitablyComment'].clearValidators();
    this.auditForm.controls['frozenFoodSuitablyComment'].updateValueAndValidity();

    this.auditForm.controls['foodCookedReheatedAction'].clearValidators();
    this.auditForm.controls['foodCookedReheatedAction'].updateValueAndValidity();
    this.auditForm.controls['foodCookedReheatedComment'].clearValidators();
    this.auditForm.controls['foodCookedReheatedComment'].updateValueAndValidity();

    this.auditForm.controls['thermometerUseVerifyFoodTempAction'].clearValidators();
    this.auditForm.controls['thermometerUseVerifyFoodTempAction'].updateValueAndValidity();
    this.auditForm.controls['thermometerUseVerifyFoodTempComment'].clearValidators();
    this.auditForm.controls['thermometerUseVerifyFoodTempComment'].updateValueAndValidity();

    this.auditForm.controls['noMisuseEquipmentAction'].clearValidators();
    this.auditForm.controls['noMisuseEquipmentAction'].updateValueAndValidity();
    this.auditForm.controls['noMisuseEquipmentComment'].clearValidators();
    this.auditForm.controls['noMisuseEquipmentComment'].updateValueAndValidity();

    this.auditForm.controls['hotFoodCoolingPeriodAction'].clearValidators();
    this.auditForm.controls['hotFoodCoolingPeriodAction'].updateValueAndValidity();
    this.auditForm.controls['hotFoodCoolingPeriodComment'].clearValidators();
    this.auditForm.controls['hotFoodCoolingPeriodComment'].updateValueAndValidity();

    this.auditForm.controls['foodDisplayedAction'].clearValidators();
    this.auditForm.controls['foodDisplayedAction'].updateValueAndValidity();
    this.auditForm.controls['foodDisplayedComment'].clearValidators();
    this.auditForm.controls['foodDisplayedComment'].updateValueAndValidity();

    this.auditForm.controls['foodDisplayedTempControlAction'].clearValidators();
    this.auditForm.controls['foodDisplayedTempControlAction'].updateValueAndValidity();
    this.auditForm.controls['foodDisplayedTempControlComment'].clearValidators();
    this.auditForm.controls['foodDisplayedTempControlComment'].updateValueAndValidity();

    this.auditForm.controls['separateDirtyEquipmentAction'].clearValidators();
    this.auditForm.controls['separateDirtyEquipmentAction'].updateValueAndValidity();
    this.auditForm.controls['separateDirtyEquipmentComment'].clearValidators();
    this.auditForm.controls['separateDirtyEquipmentComment'].updateValueAndValidity();

    this.auditForm.controls['visualStandardsOfHousekeepingAction'].clearValidators();
    this.auditForm.controls['visualStandardsOfHousekeepingAction'].updateValueAndValidity();
    this.auditForm.controls['visualStandardsOfHousekeepingComment'].clearValidators();
    this.auditForm.controls['visualStandardsOfHousekeepingComment'].updateValueAndValidity();

    this.auditForm.controls['apparentAction'].clearValidators();
    this.auditForm.controls['apparentAction'].updateValueAndValidity();
    this.auditForm.controls['apparentComment'].clearValidators();
    this.auditForm.controls['apparentComment'].updateValueAndValidity();

    this.auditForm.controls['cleaningScheduleAction'].clearValidators();
    this.auditForm.controls['cleaningScheduleAction'].updateValueAndValidity();
    this.auditForm.controls['cleaningScheduleComment'].clearValidators();
    this.auditForm.controls['cleaningScheduleComment'].updateValueAndValidity();

    this.auditForm.controls['cleaningChemicalsAvailableAction'].clearValidators();
    this.auditForm.controls['cleaningChemicalsAvailableAction'].updateValueAndValidity();
    this.auditForm.controls['cleaningChemicalsAvailableComment'].clearValidators();
    this.auditForm.controls['cleaningChemicalsAvailableComment'].updateValueAndValidity();

    this.auditForm.controls['sufficientCleaningEquipmentAction'].clearValidators();
    this.auditForm.controls['sufficientCleaningEquipmentAction'].updateValueAndValidity();
    this.auditForm.controls['sufficientCleaningEquipmentComment'].clearValidators();
    this.auditForm.controls['sufficientCleaningEquipmentComment'].updateValueAndValidity();
  }

  private setFormValue(formNineValue: AuditFormNine) {
    this.auditForm = this.fb.group({
      id: [formNineValue.id],
      auditDate: [formNineValue.auditDate],
      auditedBy: [formNineValue.auditedBy, Validators.required],

      deliveriesPutAwayAction: [formNineValue.deliveriesPutAwayAction],
      deliveriesPutAwayComment: [formNineValue.deliveriesPutAwayComment, Validators.maxLength(200)],

      rawOtherFoodsStoredAction: [formNineValue.rawOtherFoodsStoredAction],
      rawOtherFoodsStoredComment: [formNineValue.rawOtherFoodsStoredComment, Validators.maxLength(200)],

      foodSuitablyCoveredAction: [formNineValue.foodSuitablyCoveredAction],
      foodSuitablyCoveredComment: [formNineValue.foodSuitablyCoveredComment, Validators.maxLength(200)],

      foodGradeMaterialAction: [formNineValue.foodGradeMaterialAction],
      foodGradeMaterialComment: [formNineValue.foodGradeMaterialComment, Validators.maxLength(200)],

      noFoodOpenedAction: [formNineValue.noFoodOpenedAction],
      noFoodOpenedComment: [formNineValue.noFoodOpenedComment, Validators.maxLength(200)],

      foodClearAction: [formNineValue.foodClearAction],
      foodClearComment: [formNineValue.foodClearComment, Validators.maxLength(200)],

      noUnnecessaryGlassAction: [formNineValue.noUnnecessaryGlassAction],
      noUnnecessaryGlassComment: [formNineValue.noUnnecessaryGlassComment, Validators.maxLength(200)],

      noDirtyPackagingAction: [formNineValue.noDirtyPackagingAction],
      noDirtyPackagingComment: [formNineValue.noDirtyPackagingComment, Validators.maxLength(200)],

      noOverStockingAction: [formNineValue.noOverStockingAction],
      noOverStockingComment: [formNineValue.noOverStockingComment, Validators.maxLength(200)],

      foodInProcessAction: [formNineValue.foodInProcessAction],
      foodInProcessComment: [formNineValue.foodInProcessComment, Validators.maxLength(200)],

      noExcessiveHandlingAction: [formNineValue.noExcessiveHandlingAction],
      noExcessiveHandlingComment: [formNineValue.noExcessiveHandlingComment, Validators.maxLength(200)],

      noHighRiskUseRawEggsAction: [formNineValue.noHighRiskUseRawEggsAction],
      noHighRiskUseRawEggsComment: [formNineValue.noHighRiskUseRawEggsComment, Validators.maxLength(200)],

      adequateSeparationActivitiesAction: [formNineValue.adequateSeparationActivitiesAction],
      adequateSeparationActivitiesComment: [formNineValue.adequateSeparationActivitiesComment, Validators.maxLength(200)],

      quantitiesOfTemperatureAction: [formNineValue.quantitiesOfTemperatureAction],
      quantitiesOfTemperatureComment: [formNineValue.quantitiesOfTemperatureComment, Validators.maxLength(200)],

      sufficientkitchenEquipmentAction: [formNineValue.sufficientkitchenEquipmentAction],
      sufficientkitchenEquipmentComment: [formNineValue.sufficientkitchenEquipmentComment, Validators.maxLength(200)],

      staffFacilitiesCleanAction: [formNineValue.staffFacilitiesCleanAction],
      staffFacilitiesCleanComment: [formNineValue.staffFacilitiesCleanComment, Validators.maxLength(200)],

      staffAppearanceSatisfactoryAction: [formNineValue.staffAppearanceSatisfactoryAction],
      staffAppearanceSatisfactoryComment: [formNineValue.staffAppearanceSatisfactoryComment, Validators.maxLength(200)],

      adequateProtectiveClothingAction: [formNineValue.adequateProtectiveClothingAction],
      adequateProtectiveClothingComment: [formNineValue.adequateProtectiveClothingComment, Validators.maxLength(200)],

      noBadHabitsPracticesAction: [formNineValue.noBadHabitsPracticesAction],
      noBadHabitsPracticesComment: [formNineValue.noBadHabitsPracticesComment, Validators.maxLength(200)],

      handWashDisciplinesAction: [formNineValue.handWashDisciplinesAction],
      handWashDisciplinesComment: [formNineValue.handWashDisciplinesComment, Validators.maxLength(200)],

      handWashBasinsStockedAction: [formNineValue.handWashBasinsStockedAction],
      handWashBasinsStockedComment: [formNineValue.handWashBasinsStockedComment, Validators.maxLength(200)],

      noticeInStaffToiletAction: [formNineValue.noticeInStaffToiletAction],
      noticeInStaffToiletComment: [formNineValue.noticeInStaffToiletComment, Validators.maxLength(200)],

      firstAidAvailableInKitchenAction: [formNineValue.firstAidAvailableInKitchenAction],
      firstAidAvailableInKitchenComment: [formNineValue.firstAidAvailableInKitchenComment, Validators.maxLength(200)],

      fridgesAtZeroToFiveCAction: [formNineValue.fridgesAtZeroToFiveCAction],
      fridgesAtZeroToFiveCComment: [formNineValue.fridgesAtZeroToFiveCComment, Validators.maxLength(200)],

      fridgesBelow18Action: [formNineValue.fridgesBelow18Action],
      fridgesBelow18Comment: [formNineValue.fridgesBelow18Comment, Validators.maxLength(200)],

      thermometerOrCasingDisplayAction: [formNineValue.thermometerOrCasingDisplayAction],
      thermometerOrCasingDisplayComment: [formNineValue.thermometerOrCasingDisplayComment, Validators.maxLength(200)],

      thermometerDisinfectantWipesAction: [formNineValue.thermometerDisinfectantWipesAction],
      thermometerDisinfectantWipesComment: [formNineValue.thermometerDisinfectantWipesComment, Validators.maxLength(200)],

      foodInProcessOfPreparationAction: [formNineValue.foodInProcessOfPreparationAction],
      foodInProcessOfPreparationComment: [formNineValue.foodInProcessOfPreparationComment, Validators.maxLength(200)],

      foodStoredCorrectlyAction: [formNineValue.foodStoredCorrectlyAction],
      foodStoredCorrectlyComment: [formNineValue.foodStoredCorrectlyComment, Validators.maxLength(200)],

      frozenFoodSuitablyAction: [formNineValue.frozenFoodSuitablyAction],
      frozenFoodSuitablyComment: [formNineValue.frozenFoodSuitablyComment, Validators.maxLength(200)],

      foodCookedReheatedAction: [formNineValue.foodCookedReheatedAction],
      foodCookedReheatedComment: [formNineValue.foodCookedReheatedComment, Validators.maxLength(200)],

      thermometerUseVerifyFoodTempAction: [formNineValue.thermometerUseVerifyFoodTempAction],
      thermometerUseVerifyFoodTempComment: [formNineValue.thermometerUseVerifyFoodTempComment, Validators.maxLength(200)],

      noMisuseEquipmentAction: [formNineValue.noMisuseEquipmentAction],
      noMisuseEquipmentComment: [formNineValue.noMisuseEquipmentComment, Validators.maxLength(200)],

      hotFoodCoolingPeriodAction: [formNineValue.hotFoodCoolingPeriodAction],
      hotFoodCoolingPeriodComment: [formNineValue.hotFoodCoolingPeriodComment, Validators.maxLength(200)],

      foodDisplayedAction: [formNineValue.foodDisplayedAction],
      foodDisplayedComment: [formNineValue.foodDisplayedComment, Validators.maxLength(200)],

      foodDisplayedTempControlAction: [formNineValue.foodDisplayedTempControlAction],
      foodDisplayedTempControlComment: [formNineValue.foodDisplayedTempControlComment, Validators.maxLength(200)],

      separateDirtyEquipmentAction: [formNineValue.separateDirtyEquipmentAction],
      separateDirtyEquipmentComment: [formNineValue.separateDirtyEquipmentComment, Validators.maxLength(200)],

      visualStandardsOfHousekeepingAction: [formNineValue.visualStandardsOfHousekeepingAction],
      visualStandardsOfHousekeepingComment: [formNineValue.visualStandardsOfHousekeepingComment, Validators.maxLength(200)],

      apparentAction: [formNineValue.apparentAction],
      apparentComment: [formNineValue.apparentComment, Validators.maxLength(200)],

      cleaningScheduleAction: [formNineValue.cleaningScheduleAction],
      cleaningScheduleComment: [formNineValue.cleaningScheduleComment, Validators.maxLength(200)],

      cleaningChemicalsAvailableAction: [formNineValue.cleaningChemicalsAvailableAction],
      cleaningChemicalsAvailableComment: [formNineValue.cleaningChemicalsAvailableComment, Validators.maxLength(200)],

      sufficientCleaningEquipmentAction: [formNineValue.sufficientCleaningEquipmentAction],
      sufficientCleaningEquipmentComment: [formNineValue.sufficientCleaningEquipmentComment, Validators.maxLength(200)],

      signoffBy: [formNineValue.signoffBy],
      isSignedOff: [formNineValue.isSignedOff],
      locationId: [formNineValue.locationId, Validators.required],
      careHomeId: [formNineValue.careHomeId],
      createdBy: [formNineValue.createdBy],
      createdAt: [formNineValue.createdAt],
      updatedBy: [formNineValue.createdBy],
    });
    this.completeForm();

  }
}
