import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormTwentyOneService } from 'src/app/services/form-twenty-one.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { FormName } from 'src/app/shared/enums/form-name.enum';
import { AuditFormTwentyOne } from 'src/app/shared/models/audit-form-twentyone';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/util/Constants';

@Component({
  selector: 'app-form-twentyone',
  templateUrl: './form-twentyone.component.html',
  styleUrls: ['./form-twentyone.component.scss']
})
export class FormTwentyoneComponent extends BaseComponent implements OnInit {

  public locationList: Array<Location> = [];
  public userList: Array<User> = [];
  public auditForm: FormGroup;
  public isEdit: boolean = false;
  public isFilling: boolean = false;
  public createForm: boolean = false;
  public maxScore: number = 384;
  public formName = FormName;
  private scores: Array<any> = [];
  private tempObj = { "isBuildingStructureDefects": 0, "isBuildingMaintainedAdequately": 0, "areElectricServicesFree": 0, "isAreaFreeFromHazards": 0, "hazardousWarningNoticePosted": 0, "hazardousPrecautionsTakenAdequate": 0, "hazardousCasualVisitorSafeguard": 0, "areEntranceAndExitSafe": 0, "areStaircasesSafe": 0, "areAllWalkwaysSecure": 0, "areAllFittingsSecure": 0, "areAwkwardAreas": 0, "arePassagesFree": 0, "areDrainPipesWorkingGood": 0, "isProcedureRectifiyingDefectsSatisfactory": 0, "isLightingSatisfactory": 0, "isFloorsSlippery": 0, "areAllFloorSurfaceDamage": 0, "isNonSlipPolishUsed": 0, "workingAreaFreeFromObstruction": 0, "floorAdequatelyProtected": 0, "areAreaKeptTidy": 0, "floorMaintenanceTreatment": 0, "isSafetyGlassFitted": 0, "areWindowControlAccessibleWorking": 0, "areWalkwaysWindowSafe": 0, "isWindowEdgeAboveFloorLevel": 0, "areDevicesPreventWindow": 0, "isWindowCleanedSafely": 0, "areWashingFacilitiesAdequate": 0, "areToiletFacilitiesAdequate": 0, "areToiletAreaDisinfected": 0, "areWasteDisposalSystemsAreasEffective": 0, "handDryingFacilitiesAvailable": 0, "safetyPostersDisplayed": 0, "sufficientFacilitiesForEmployees": 0, "employeeEatMealsFacilities": 0, "workareaRegularlyCleaned": 0, "appropriateCleaningProcesses": 0, "isNumberWasteBinsAppropriate": 0, "areLabelledCorrectForWaste": 0, "areWastDisposedRegularly": 0, "liquidsAdequatelyStored": 0, "areVentilationArrangementsSatisfactory": 0, "airConditioningPresent": 0, "workplaceNoiseLevelAccepteble": 0, "noiseHazardZonesDeclared": 0, "warningNoticesAdequatelyDisplayed": 0, "earDefendersAvailable": 0, "precautionsAgainstEarDamage": 0, "noiseLevelsMonitored": 0, "workareasMinimumTemperature": 0, "workareasConsiderablePhysicalEffort": 0, "areHeatingSystemsSuitable": 0, "heatingSystemsServicedRegularly": 0, "guardsFittedInHeatingAppliances": 0, "satisfactoryProtectiveClothingProvided": 0, "accessibleThermometerForStaff": 0, "lightingInWorkareas": 0, "anyChangesInWalkingLevels": 0, "areLightFittingsCorrectlyPositioned": 0, "repairFaultyLightingSatisfactory": 0, "reportingDefectProcess": 0, "isEmergencyLightingProvided": 0, "isEmergencyLightingRegularlyTested": 0, "furnitureProvidedGoodState": 0, "isSuitableForPersonnelUse": 0, "workSurfacesAppropriateHeightForWork": 0, "isSeatingAppropriate": 0, "isSufficientSpaceAroundWorkstations": 0, "frequentlyUsedworkEquipment": 0, "fireEscapeRoutesClearly": 0, "actionInEventOfFire": 0, "areFireExitsRegularlyChecked": 0, "fireFightingEquipmentReady": 0, "isRegularlyChecked": 0, "buildingPlanWithFireEquipment": 0, "fireBrigadeAccessRoutes": 0, "noSmokingOnPremises": 0, "fireAlarmsFittedRegularlyTested": 0, "firstAidRiskAssessment": 0, "firstAidBoxesCheckedRecently": 0, "isResuscitationEquipmentChecked": 0, "nameOfNominatedfirstaidPersonClearlyDisplayed": 0, "isProceduresCaterAccident": 0, "provideSpeedyReactionInAccident": 0, "areEmergencyArrangementsProvided": 0, "protectiveClothes": 0, "earDefenders": 0, "gogglesGlasses": 0, "smokeDustMasks": 0, "protectiveScreens": 0, "areMaterialsStackedSafely": 0, "areWastMaterialsKeptAwayAfterUse": 0, "areWalkwaysFreeFromStorage": 0, "areElectricalLeadsProtected": 0 };



  constructor(private locationService: LocationServices,
    private userService: UserService,
    private formtwentyOneService: FormTwentyOneService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) { super(); }

  ngOnInit(): void {
    this.getLocations();
    this.objectKeyMap();
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.getFormTwentyOne(this.route.snapshot.params['id']);
    } else {
      this.setFormValue();
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
    if (this.currentUserId == this.auditForm.controls['auditedBy'].value || this.currentUserRole == this.userType.SuperUser || this.currentUserRole == this.userType.Admin
    ) {
      if (Number(this.currentUserId) == Number(this.auditForm.controls['signoffBy'].value)) {
        this.auditForm.controls['isSignedOff'].setValue(true);
        this.auditForm.controls['signoffBy'].enable();
        if (this.createForm) {
          let form21 = new AuditFormTwentyOne();
          let date = new Date(this.auditForm.controls['auditDate'].value);
          form21.auditDate = new Date(date.setMonth(date.getMonth() + 1));
          form21.auditedBy = this.auditForm.controls['auditedBy'].value;
          form21.locationId = this.auditForm.controls['locationId'].value;
          form21.careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
          form21.createdAt = new Date();
          form21.createdBy = this.currentUserId;
          this.formtwentyOneService.addForm(form21).subscribe();
        }
      }
      if (this.isEdit) {
        this.updateForm();
      } else {
        this.addForm();
      }
    }
  }

  public changeScore(index: string, value: number) {
    this.scores.some(function (el) {
      if (el.index === index) {
        el.value = Number(value);
        return true;

      }
    });
    this.calculateScore();
  }

  public calculateScore() {
    let total = 0;
    let zeroCount = 0;
    total = this.scores.reduce((n, { value }) => n + value, 0);  //get_total or sum of array
    zeroCount = this.scores.filter(n => n.value == 0).length; // get zero count
    let totalScore = total-zeroCount;
    this.maxScore = (4 * 96) - zeroCount;
    let calculatedScore = (totalScore / this.maxScore) * 100;
    this.auditForm.controls['calculatedScore'].setValue(calculatedScore.toFixed(2));
    this.auditForm.controls['maxScore'].setValue(this.maxScore);
    this.auditForm.controls['totalScore'].setValue(totalScore);
    return this.auditForm.controls['totalScore'].value;
  }

  public goBack() {
    if (this.route.snapshot.queryParams["fromDashboard"]) {
      this.router.navigate([Constants.routes.dashboard()]);
    }
    else
      window.history.back();
  }

  private getFormTwentyOne(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formtwentyOneService.getForm(id).subscribe(
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

    this.auditForm.controls['isBuildingStructureDefects'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['isBuildingStructureDefects'].updateValueAndValidity();
    this.auditForm.controls['isBuildingMaintainedAdequately'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['isBuildingMaintainedAdequately'].updateValueAndValidity();
    this.auditForm.controls['areElectricServicesFree'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areElectricServicesFree'].updateValueAndValidity();
    this.auditForm.controls['isAreaFreeFromHazards'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['isAreaFreeFromHazards'].updateValueAndValidity();
    this.auditForm.controls['hazardousWarningNoticePosted'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['hazardousWarningNoticePosted'].updateValueAndValidity();
    this.auditForm.controls['hazardousPrecautionsTakenAdequate'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['hazardousPrecautionsTakenAdequate'].updateValueAndValidity();
    this.auditForm.controls['hazardousCasualVisitorSafeguard'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['hazardousCasualVisitorSafeguard'].updateValueAndValidity();
    this.auditForm.controls['areEntranceAndExitSafe'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areEntranceAndExitSafe'].updateValueAndValidity();
    this.auditForm.controls['areStaircasesSafe'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areStaircasesSafe'].updateValueAndValidity();
    this.auditForm.controls['areAllWalkwaysSecure'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areAllWalkwaysSecure'].updateValueAndValidity();
    this.auditForm.controls['areAllFittingsSecure'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areAllFittingsSecure'].updateValueAndValidity();
    this.auditForm.controls['areAwkwardAreas'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areAwkwardAreas'].updateValueAndValidity();
    this.auditForm.controls['arePassagesFree'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['arePassagesFree'].updateValueAndValidity();
    this.auditForm.controls['areDrainPipesWorkingGood'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areDrainPipesWorkingGood'].updateValueAndValidity();
    this.auditForm.controls['isProcedureRectifiyingDefectsSatisfactory'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['isProcedureRectifiyingDefectsSatisfactory'].updateValueAndValidity();
    this.auditForm.controls['isLightingSatisfactory'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['isLightingSatisfactory'].updateValueAndValidity();
    this.auditForm.controls['isFloorsSlippery'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['isFloorsSlippery'].updateValueAndValidity();
    this.auditForm.controls['areAllFloorSurfaceDamage'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areAllFloorSurfaceDamage'].updateValueAndValidity();
    this.auditForm.controls['isNonSlipPolishUsed'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['isNonSlipPolishUsed'].updateValueAndValidity();
    this.auditForm.controls['workingAreaFreeFromObstruction'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['workingAreaFreeFromObstruction'].updateValueAndValidity();
    this.auditForm.controls['floorAdequatelyProtected'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['floorAdequatelyProtected'].updateValueAndValidity();
    this.auditForm.controls['areAreaKeptTidy'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areAreaKeptTidy'].updateValueAndValidity();
    this.auditForm.controls['floorMaintenanceTreatment'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['floorMaintenanceTreatment'].updateValueAndValidity();
    this.auditForm.controls['isSafetyGlassFitted'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['isSafetyGlassFitted'].updateValueAndValidity();
    this.auditForm.controls['areWindowControlAccessibleWorking'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areWindowControlAccessibleWorking'].updateValueAndValidity();
    this.auditForm.controls['areWalkwaysWindowSafe'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areWalkwaysWindowSafe'].updateValueAndValidity();
    this.auditForm.controls['isWindowEdgeAboveFloorLevel'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['isWindowEdgeAboveFloorLevel'].updateValueAndValidity();
    this.auditForm.controls['areDevicesPreventWindow'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areDevicesPreventWindow'].updateValueAndValidity();
    this.auditForm.controls['isWindowCleanedSafely'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['isWindowCleanedSafely'].updateValueAndValidity();
    this.auditForm.controls['areWashingFacilitiesAdequate'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areWashingFacilitiesAdequate'].updateValueAndValidity();
    this.auditForm.controls['areToiletFacilitiesAdequate'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areToiletFacilitiesAdequate'].updateValueAndValidity();
    this.auditForm.controls['areToiletAreaDisinfected'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areToiletAreaDisinfected'].updateValueAndValidity();
    this.auditForm.controls['areWasteDisposalSystemsAreasEffective'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areWasteDisposalSystemsAreasEffective'].updateValueAndValidity();
    this.auditForm.controls['handDryingFacilitiesAvailable'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['handDryingFacilitiesAvailable'].updateValueAndValidity();
    this.auditForm.controls['safetyPostersDisplayed'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['safetyPostersDisplayed'].updateValueAndValidity();
    this.auditForm.controls['sufficientFacilitiesForEmployees'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['sufficientFacilitiesForEmployees'].updateValueAndValidity();
    this.auditForm.controls['employeeEatMealsFacilities'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['employeeEatMealsFacilities'].updateValueAndValidity();
    this.auditForm.controls['workareaRegularlyCleaned'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['workareaRegularlyCleaned'].updateValueAndValidity();
    this.auditForm.controls['appropriateCleaningProcesses'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['appropriateCleaningProcesses'].updateValueAndValidity();
    this.auditForm.controls['isNumberWasteBinsAppropriate'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['isNumberWasteBinsAppropriate'].updateValueAndValidity();
    this.auditForm.controls['areLabelledCorrectForWaste'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areLabelledCorrectForWaste'].updateValueAndValidity();
    this.auditForm.controls['areWastDisposedRegularly'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areWastDisposedRegularly'].updateValueAndValidity();
    this.auditForm.controls['liquidsAdequatelyStored'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['liquidsAdequatelyStored'].updateValueAndValidity();
    this.auditForm.controls['areVentilationArrangementsSatisfactory'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areVentilationArrangementsSatisfactory'].updateValueAndValidity();
    this.auditForm.controls['airConditioningPresent'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['airConditioningPresent'].updateValueAndValidity();
    this.auditForm.controls['workplaceNoiseLevelAccepteble'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['workplaceNoiseLevelAccepteble'].updateValueAndValidity();
    this.auditForm.controls['noiseHazardZonesDeclared'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['noiseHazardZonesDeclared'].updateValueAndValidity();
    this.auditForm.controls['warningNoticesAdequatelyDisplayed'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['warningNoticesAdequatelyDisplayed'].updateValueAndValidity();
    this.auditForm.controls['earDefendersAvailable'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['earDefendersAvailable'].updateValueAndValidity();
    this.auditForm.controls['precautionsAgainstEarDamage'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['precautionsAgainstEarDamage'].updateValueAndValidity();
    this.auditForm.controls['noiseLevelsMonitored'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['noiseLevelsMonitored'].updateValueAndValidity();
    this.auditForm.controls['workareasMinimumTemperature'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['workareasMinimumTemperature'].updateValueAndValidity();
    this.auditForm.controls['workareasConsiderablePhysicalEffort'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['workareasConsiderablePhysicalEffort'].updateValueAndValidity();
    this.auditForm.controls['areHeatingSystemsSuitable'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areHeatingSystemsSuitable'].updateValueAndValidity();
    this.auditForm.controls['heatingSystemsServicedRegularly'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['heatingSystemsServicedRegularly'].updateValueAndValidity();
    this.auditForm.controls['guardsFittedInHeatingAppliances'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['guardsFittedInHeatingAppliances'].updateValueAndValidity();
    this.auditForm.controls['satisfactoryProtectiveClothingProvided'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['satisfactoryProtectiveClothingProvided'].updateValueAndValidity();
    this.auditForm.controls['accessibleThermometerForStaff'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['accessibleThermometerForStaff'].updateValueAndValidity();
    this.auditForm.controls['lightingInWorkareas'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['lightingInWorkareas'].updateValueAndValidity();
    this.auditForm.controls['anyChangesInWalkingLevels'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['anyChangesInWalkingLevels'].updateValueAndValidity();
    this.auditForm.controls['areLightFittingsCorrectlyPositioned'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areLightFittingsCorrectlyPositioned'].updateValueAndValidity();
    this.auditForm.controls['repairFaultyLightingSatisfactory'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['repairFaultyLightingSatisfactory'].updateValueAndValidity();
    this.auditForm.controls['reportingDefectProcess'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['reportingDefectProcess'].updateValueAndValidity();
    this.auditForm.controls['isEmergencyLightingProvided'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['isEmergencyLightingProvided'].updateValueAndValidity();
    this.auditForm.controls['isEmergencyLightingRegularlyTested'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['isEmergencyLightingRegularlyTested'].updateValueAndValidity();
    this.auditForm.controls['furnitureProvidedGoodState'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['furnitureProvidedGoodState'].updateValueAndValidity();
    this.auditForm.controls['isSuitableForPersonnelUse'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['isSuitableForPersonnelUse'].updateValueAndValidity();
    this.auditForm.controls['workSurfacesAppropriateHeightForWork'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['workSurfacesAppropriateHeightForWork'].updateValueAndValidity();
    this.auditForm.controls['isSeatingAppropriate'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['isSeatingAppropriate'].updateValueAndValidity();
    this.auditForm.controls['isSufficientSpaceAroundWorkstations'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['isSufficientSpaceAroundWorkstations'].updateValueAndValidity();
    this.auditForm.controls['frequentlyUsedworkEquipment'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['frequentlyUsedworkEquipment'].updateValueAndValidity();
    this.auditForm.controls['fireEscapeRoutesClearly'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['fireEscapeRoutesClearly'].updateValueAndValidity();
    this.auditForm.controls['actionInEventOfFire'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['actionInEventOfFire'].updateValueAndValidity();
    this.auditForm.controls['areFireExitsRegularlyChecked'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areFireExitsRegularlyChecked'].updateValueAndValidity();
    this.auditForm.controls['fireFightingEquipmentReady'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['fireFightingEquipmentReady'].updateValueAndValidity();
    this.auditForm.controls['isRegularlyChecked'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['isRegularlyChecked'].updateValueAndValidity();
    this.auditForm.controls['buildingPlanWithFireEquipment'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['buildingPlanWithFireEquipment'].updateValueAndValidity();
    this.auditForm.controls['fireBrigadeAccessRoutes'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['fireBrigadeAccessRoutes'].updateValueAndValidity();
    this.auditForm.controls['noSmokingOnPremises'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['noSmokingOnPremises'].updateValueAndValidity();
    this.auditForm.controls['fireAlarmsFittedRegularlyTested'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['fireAlarmsFittedRegularlyTested'].updateValueAndValidity();
    this.auditForm.controls['firstAidRiskAssessment'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['firstAidRiskAssessment'].updateValueAndValidity();
    this.auditForm.controls['firstAidBoxesCheckedRecently'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['firstAidBoxesCheckedRecently'].updateValueAndValidity();
    this.auditForm.controls['isResuscitationEquipmentChecked'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['isResuscitationEquipmentChecked'].updateValueAndValidity();
    this.auditForm.controls['nameOfNominatedfirstaidPersonClearlyDisplayed'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['nameOfNominatedfirstaidPersonClearlyDisplayed'].updateValueAndValidity();
    this.auditForm.controls['isProceduresCaterAccident'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['isProceduresCaterAccident'].updateValueAndValidity();
    this.auditForm.controls['provideSpeedyReactionInAccident'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['provideSpeedyReactionInAccident'].updateValueAndValidity();
    this.auditForm.controls['areEmergencyArrangementsProvided'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areEmergencyArrangementsProvided'].updateValueAndValidity();
    this.auditForm.controls['protectiveClothes'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['protectiveClothes'].updateValueAndValidity();
    this.auditForm.controls['earDefenders'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['earDefenders'].updateValueAndValidity();
    this.auditForm.controls['gogglesGlasses'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['gogglesGlasses'].updateValueAndValidity();
    this.auditForm.controls['smokeDustMasks'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['smokeDustMasks'].updateValueAndValidity();
    this.auditForm.controls['protectiveScreens'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['protectiveScreens'].updateValueAndValidity();
    this.auditForm.controls['areMaterialsStackedSafely'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areMaterialsStackedSafely'].updateValueAndValidity();
    this.auditForm.controls['areWastMaterialsKeptAwayAfterUse'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areWastMaterialsKeptAwayAfterUse'].updateValueAndValidity();
    this.auditForm.controls['areWalkwaysFreeFromStorage'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areWalkwaysFreeFromStorage'].updateValueAndValidity();
    this.auditForm.controls['areElectricalLeadsProtected'].setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(4)]));
    this.auditForm.controls['areElectricalLeadsProtected'].updateValueAndValidity();

  }

  private removeValidation() {
    this.auditForm.controls['auditDate'].clearValidators();
    this.auditForm.controls['auditDate'].updateValueAndValidity();
    this.auditForm.controls['signoffBy'].clearValidators();
    this.auditForm.controls['signoffBy'].updateValueAndValidity();

    this.auditForm.controls['isBuildingStructureDefects'].clearValidators();
    this.auditForm.controls['isBuildingStructureDefects'].updateValueAndValidity();
    this.auditForm.controls['isBuildingMaintainedAdequately'].clearValidators();
    this.auditForm.controls['isBuildingMaintainedAdequately'].updateValueAndValidity();
    this.auditForm.controls['areElectricServicesFree'].clearValidators();
    this.auditForm.controls['areElectricServicesFree'].updateValueAndValidity();
    this.auditForm.controls['isAreaFreeFromHazards'].clearValidators();
    this.auditForm.controls['isAreaFreeFromHazards'].updateValueAndValidity();
    this.auditForm.controls['hazardousWarningNoticePosted'].clearValidators();
    this.auditForm.controls['hazardousWarningNoticePosted'].updateValueAndValidity();
    this.auditForm.controls['hazardousPrecautionsTakenAdequate'].clearValidators();
    this.auditForm.controls['hazardousPrecautionsTakenAdequate'].updateValueAndValidity();
    this.auditForm.controls['hazardousCasualVisitorSafeguard'].clearValidators();
    this.auditForm.controls['hazardousCasualVisitorSafeguard'].updateValueAndValidity();
    this.auditForm.controls['areEntranceAndExitSafe'].clearValidators();
    this.auditForm.controls['areEntranceAndExitSafe'].updateValueAndValidity();
    this.auditForm.controls['areStaircasesSafe'].clearValidators();
    this.auditForm.controls['areStaircasesSafe'].updateValueAndValidity();
    this.auditForm.controls['areAllWalkwaysSecure'].clearValidators();
    this.auditForm.controls['areAllWalkwaysSecure'].updateValueAndValidity();
    this.auditForm.controls['areAllFittingsSecure'].clearValidators();
    this.auditForm.controls['areAllFittingsSecure'].updateValueAndValidity();
    this.auditForm.controls['areAwkwardAreas'].clearValidators();
    this.auditForm.controls['areAwkwardAreas'].updateValueAndValidity();
    this.auditForm.controls['arePassagesFree'].clearValidators();
    this.auditForm.controls['arePassagesFree'].updateValueAndValidity();
    this.auditForm.controls['areDrainPipesWorkingGood'].clearValidators();
    this.auditForm.controls['areDrainPipesWorkingGood'].updateValueAndValidity();
    this.auditForm.controls['isProcedureRectifiyingDefectsSatisfactory'].clearValidators();
    this.auditForm.controls['isProcedureRectifiyingDefectsSatisfactory'].updateValueAndValidity();
    this.auditForm.controls['isLightingSatisfactory'].clearValidators();
    this.auditForm.controls['isLightingSatisfactory'].updateValueAndValidity();
    this.auditForm.controls['isFloorsSlippery'].clearValidators();
    this.auditForm.controls['isFloorsSlippery'].updateValueAndValidity();
    this.auditForm.controls['areAllFloorSurfaceDamage'].clearValidators();
    this.auditForm.controls['areAllFloorSurfaceDamage'].updateValueAndValidity();
    this.auditForm.controls['isNonSlipPolishUsed'].clearValidators();
    this.auditForm.controls['isNonSlipPolishUsed'].updateValueAndValidity();
    this.auditForm.controls['workingAreaFreeFromObstruction'].clearValidators();
    this.auditForm.controls['workingAreaFreeFromObstruction'].updateValueAndValidity();
    this.auditForm.controls['floorAdequatelyProtected'].clearValidators();
    this.auditForm.controls['floorAdequatelyProtected'].updateValueAndValidity();
    this.auditForm.controls['areAreaKeptTidy'].clearValidators();
    this.auditForm.controls['areAreaKeptTidy'].updateValueAndValidity();
    this.auditForm.controls['floorMaintenanceTreatment'].clearValidators();
    this.auditForm.controls['floorMaintenanceTreatment'].updateValueAndValidity();
    this.auditForm.controls['isSafetyGlassFitted'].clearValidators();
    this.auditForm.controls['isSafetyGlassFitted'].updateValueAndValidity();
    this.auditForm.controls['areWindowControlAccessibleWorking'].clearValidators();
    this.auditForm.controls['areWindowControlAccessibleWorking'].updateValueAndValidity();
    this.auditForm.controls['areWalkwaysWindowSafe'].clearValidators();
    this.auditForm.controls['areWalkwaysWindowSafe'].updateValueAndValidity();
    this.auditForm.controls['isWindowEdgeAboveFloorLevel'].clearValidators();
    this.auditForm.controls['isWindowEdgeAboveFloorLevel'].updateValueAndValidity();
    this.auditForm.controls['areDevicesPreventWindow'].clearValidators();
    this.auditForm.controls['areDevicesPreventWindow'].updateValueAndValidity();
    this.auditForm.controls['isWindowCleanedSafely'].clearValidators();
    this.auditForm.controls['isWindowCleanedSafely'].updateValueAndValidity();
    this.auditForm.controls['areWashingFacilitiesAdequate'].clearValidators();
    this.auditForm.controls['areWashingFacilitiesAdequate'].updateValueAndValidity();
    this.auditForm.controls['areToiletFacilitiesAdequate'].clearValidators();
    this.auditForm.controls['areToiletFacilitiesAdequate'].updateValueAndValidity();
    this.auditForm.controls['areToiletAreaDisinfected'].clearValidators();
    this.auditForm.controls['areToiletAreaDisinfected'].updateValueAndValidity();
    this.auditForm.controls['areWasteDisposalSystemsAreasEffective'].clearValidators();
    this.auditForm.controls['areWasteDisposalSystemsAreasEffective'].updateValueAndValidity();
    this.auditForm.controls['handDryingFacilitiesAvailable'].clearValidators();
    this.auditForm.controls['handDryingFacilitiesAvailable'].updateValueAndValidity();
    this.auditForm.controls['safetyPostersDisplayed'].clearValidators();
    this.auditForm.controls['safetyPostersDisplayed'].updateValueAndValidity();
    this.auditForm.controls['sufficientFacilitiesForEmployees'].clearValidators();
    this.auditForm.controls['sufficientFacilitiesForEmployees'].updateValueAndValidity();
    this.auditForm.controls['employeeEatMealsFacilities'].clearValidators();
    this.auditForm.controls['employeeEatMealsFacilities'].updateValueAndValidity();
    this.auditForm.controls['workareaRegularlyCleaned'].clearValidators();
    this.auditForm.controls['workareaRegularlyCleaned'].updateValueAndValidity();
    this.auditForm.controls['appropriateCleaningProcesses'].clearValidators();
    this.auditForm.controls['appropriateCleaningProcesses'].updateValueAndValidity();
    this.auditForm.controls['isNumberWasteBinsAppropriate'].clearValidators();
    this.auditForm.controls['isNumberWasteBinsAppropriate'].updateValueAndValidity();
    this.auditForm.controls['areLabelledCorrectForWaste'].clearValidators();
    this.auditForm.controls['areLabelledCorrectForWaste'].updateValueAndValidity();
    this.auditForm.controls['areWastDisposedRegularly'].clearValidators();
    this.auditForm.controls['areWastDisposedRegularly'].updateValueAndValidity();
    this.auditForm.controls['liquidsAdequatelyStored'].clearValidators();
    this.auditForm.controls['liquidsAdequatelyStored'].updateValueAndValidity();
    this.auditForm.controls['areVentilationArrangementsSatisfactory'].clearValidators();
    this.auditForm.controls['areVentilationArrangementsSatisfactory'].updateValueAndValidity();
    this.auditForm.controls['airConditioningPresent'].clearValidators();
    this.auditForm.controls['airConditioningPresent'].updateValueAndValidity();
    this.auditForm.controls['workplaceNoiseLevelAccepteble'].clearValidators();
    this.auditForm.controls['workplaceNoiseLevelAccepteble'].updateValueAndValidity();
    this.auditForm.controls['noiseHazardZonesDeclared'].clearValidators();
    this.auditForm.controls['noiseHazardZonesDeclared'].updateValueAndValidity();
    this.auditForm.controls['warningNoticesAdequatelyDisplayed'].clearValidators();
    this.auditForm.controls['warningNoticesAdequatelyDisplayed'].updateValueAndValidity();
    this.auditForm.controls['earDefendersAvailable'].clearValidators();
    this.auditForm.controls['earDefendersAvailable'].updateValueAndValidity();
    this.auditForm.controls['precautionsAgainstEarDamage'].clearValidators();
    this.auditForm.controls['precautionsAgainstEarDamage'].updateValueAndValidity();
    this.auditForm.controls['noiseLevelsMonitored'].clearValidators();
    this.auditForm.controls['noiseLevelsMonitored'].updateValueAndValidity();
    this.auditForm.controls['workareasMinimumTemperature'].clearValidators();
    this.auditForm.controls['workareasMinimumTemperature'].updateValueAndValidity();
    this.auditForm.controls['workareasConsiderablePhysicalEffort'].clearValidators();
    this.auditForm.controls['workareasConsiderablePhysicalEffort'].updateValueAndValidity();
    this.auditForm.controls['areHeatingSystemsSuitable'].clearValidators();
    this.auditForm.controls['areHeatingSystemsSuitable'].updateValueAndValidity();
    this.auditForm.controls['heatingSystemsServicedRegularly'].clearValidators();
    this.auditForm.controls['heatingSystemsServicedRegularly'].updateValueAndValidity();
    this.auditForm.controls['guardsFittedInHeatingAppliances'].clearValidators();
    this.auditForm.controls['guardsFittedInHeatingAppliances'].updateValueAndValidity();
    this.auditForm.controls['satisfactoryProtectiveClothingProvided'].clearValidators();
    this.auditForm.controls['satisfactoryProtectiveClothingProvided'].updateValueAndValidity();
    this.auditForm.controls['accessibleThermometerForStaff'].clearValidators();
    this.auditForm.controls['accessibleThermometerForStaff'].updateValueAndValidity();
    this.auditForm.controls['lightingInWorkareas'].clearValidators();
    this.auditForm.controls['lightingInWorkareas'].updateValueAndValidity();
    this.auditForm.controls['anyChangesInWalkingLevels'].clearValidators();
    this.auditForm.controls['anyChangesInWalkingLevels'].updateValueAndValidity();
    this.auditForm.controls['areLightFittingsCorrectlyPositioned'].clearValidators();
    this.auditForm.controls['areLightFittingsCorrectlyPositioned'].updateValueAndValidity();
    this.auditForm.controls['repairFaultyLightingSatisfactory'].clearValidators();
    this.auditForm.controls['repairFaultyLightingSatisfactory'].updateValueAndValidity();
    this.auditForm.controls['reportingDefectProcess'].clearValidators();
    this.auditForm.controls['reportingDefectProcess'].updateValueAndValidity();
    this.auditForm.controls['isEmergencyLightingProvided'].clearValidators();
    this.auditForm.controls['isEmergencyLightingProvided'].updateValueAndValidity();
    this.auditForm.controls['isEmergencyLightingRegularlyTested'].clearValidators();
    this.auditForm.controls['isEmergencyLightingRegularlyTested'].updateValueAndValidity();
    this.auditForm.controls['furnitureProvidedGoodState'].clearValidators();
    this.auditForm.controls['furnitureProvidedGoodState'].updateValueAndValidity();
    this.auditForm.controls['isSuitableForPersonnelUse'].clearValidators();
    this.auditForm.controls['isSuitableForPersonnelUse'].updateValueAndValidity();
    this.auditForm.controls['workSurfacesAppropriateHeightForWork'].clearValidators();
    this.auditForm.controls['workSurfacesAppropriateHeightForWork'].updateValueAndValidity();
    this.auditForm.controls['isSeatingAppropriate'].clearValidators();
    this.auditForm.controls['isSeatingAppropriate'].updateValueAndValidity();
    this.auditForm.controls['isSufficientSpaceAroundWorkstations'].clearValidators();
    this.auditForm.controls['isSufficientSpaceAroundWorkstations'].updateValueAndValidity();
    this.auditForm.controls['frequentlyUsedworkEquipment'].clearValidators();
    this.auditForm.controls['frequentlyUsedworkEquipment'].updateValueAndValidity();
    this.auditForm.controls['fireEscapeRoutesClearly'].clearValidators();
    this.auditForm.controls['fireEscapeRoutesClearly'].updateValueAndValidity();
    this.auditForm.controls['actionInEventOfFire'].clearValidators();
    this.auditForm.controls['actionInEventOfFire'].updateValueAndValidity();
    this.auditForm.controls['areFireExitsRegularlyChecked'].clearValidators();
    this.auditForm.controls['areFireExitsRegularlyChecked'].updateValueAndValidity();
    this.auditForm.controls['fireFightingEquipmentReady'].clearValidators();
    this.auditForm.controls['fireFightingEquipmentReady'].updateValueAndValidity();
    this.auditForm.controls['isRegularlyChecked'].clearValidators();
    this.auditForm.controls['isRegularlyChecked'].updateValueAndValidity();
    this.auditForm.controls['buildingPlanWithFireEquipment'].clearValidators();
    this.auditForm.controls['buildingPlanWithFireEquipment'].updateValueAndValidity();
    this.auditForm.controls['fireBrigadeAccessRoutes'].clearValidators();
    this.auditForm.controls['fireBrigadeAccessRoutes'].updateValueAndValidity();
    this.auditForm.controls['noSmokingOnPremises'].clearValidators();
    this.auditForm.controls['noSmokingOnPremises'].updateValueAndValidity();
    this.auditForm.controls['fireAlarmsFittedRegularlyTested'].clearValidators();
    this.auditForm.controls['fireAlarmsFittedRegularlyTested'].updateValueAndValidity();
    this.auditForm.controls['firstAidRiskAssessment'].clearValidators();
    this.auditForm.controls['firstAidRiskAssessment'].updateValueAndValidity();
    this.auditForm.controls['firstAidBoxesCheckedRecently'].clearValidators();
    this.auditForm.controls['firstAidBoxesCheckedRecently'].updateValueAndValidity();
    this.auditForm.controls['isResuscitationEquipmentChecked'].clearValidators();
    this.auditForm.controls['isResuscitationEquipmentChecked'].updateValueAndValidity();
    this.auditForm.controls['nameOfNominatedfirstaidPersonClearlyDisplayed'].clearValidators();
    this.auditForm.controls['nameOfNominatedfirstaidPersonClearlyDisplayed'].updateValueAndValidity();
    this.auditForm.controls['isProceduresCaterAccident'].clearValidators();
    this.auditForm.controls['isProceduresCaterAccident'].updateValueAndValidity();
    this.auditForm.controls['provideSpeedyReactionInAccident'].clearValidators();
    this.auditForm.controls['provideSpeedyReactionInAccident'].updateValueAndValidity();
    this.auditForm.controls['areEmergencyArrangementsProvided'].clearValidators();
    this.auditForm.controls['areEmergencyArrangementsProvided'].updateValueAndValidity();
    this.auditForm.controls['protectiveClothes'].clearValidators();
    this.auditForm.controls['protectiveClothes'].updateValueAndValidity();
    this.auditForm.controls['earDefenders'].clearValidators();
    this.auditForm.controls['earDefenders'].updateValueAndValidity();
    this.auditForm.controls['gogglesGlasses'].clearValidators();
    this.auditForm.controls['gogglesGlasses'].updateValueAndValidity();
    this.auditForm.controls['smokeDustMasks'].clearValidators();
    this.auditForm.controls['smokeDustMasks'].updateValueAndValidity();
    this.auditForm.controls['protectiveScreens'].clearValidators();
    this.auditForm.controls['protectiveScreens'].updateValueAndValidity();
    this.auditForm.controls['areMaterialsStackedSafely'].clearValidators();
    this.auditForm.controls['areMaterialsStackedSafely'].updateValueAndValidity();
    this.auditForm.controls['areWastMaterialsKeptAwayAfterUse'].clearValidators();
    this.auditForm.controls['areWastMaterialsKeptAwayAfterUse'].updateValueAndValidity();
    this.auditForm.controls['areWalkwaysFreeFromStorage'].clearValidators();
    this.auditForm.controls['areWalkwaysFreeFromStorage'].updateValueAndValidity();
    this.auditForm.controls['areElectricalLeadsProtected'].clearValidators();
    this.auditForm.controls['areElectricalLeadsProtected'].updateValueAndValidity();

  }

  private addForm() {
    this.SetLoading(true);
    this.formtwentyOneService.addForm(this.auditForm.value).subscribe(
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
    this.formtwentyOneService.updateForm(this.auditForm.value).subscribe(
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

  private setFormValue(formTwentyOneValue?: AuditFormTwentyOne) {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.auditForm = this.fb.group({
      id: [(formTwentyOneValue && formTwentyOneValue.id) ? formTwentyOneValue.id : 0],
      auditDate: [(formTwentyOneValue && formTwentyOneValue.auditDate) ? formTwentyOneValue.auditDate : null],
      auditedBy: [(formTwentyOneValue && formTwentyOneValue.auditedBy) ? formTwentyOneValue.auditedBy : null, Validators.required],

      isBuildingStructureDefects: [(formTwentyOneValue && formTwentyOneValue.isBuildingStructureDefects) ? formTwentyOneValue.isBuildingStructureDefects : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      isBuildingStructureDefectsComment: [(formTwentyOneValue && formTwentyOneValue.isBuildingStructureDefectsComment) ? formTwentyOneValue.isBuildingStructureDefectsComment : '', Validators.compose([Validators.maxLength(500)])],

      isBuildingMaintainedAdequately: [(formTwentyOneValue && formTwentyOneValue.isBuildingMaintainedAdequately) ? formTwentyOneValue.isBuildingMaintainedAdequately : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      isBuildingMaintainedAdequatelyComment: [(formTwentyOneValue && formTwentyOneValue.isBuildingMaintainedAdequatelyComment) ? formTwentyOneValue.isBuildingMaintainedAdequatelyComment : '', Validators.compose([Validators.maxLength(500)])],

      areElectricServicesFree: [(formTwentyOneValue && formTwentyOneValue.areElectricServicesFree) ? formTwentyOneValue.areElectricServicesFree : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areElectricServicesFreeComment: [(formTwentyOneValue && formTwentyOneValue.areElectricServicesFreeComment) ? formTwentyOneValue.areElectricServicesFreeComment : '', Validators.compose([Validators.maxLength(500)])],

      isAreaFreeFromHazards: [(formTwentyOneValue && formTwentyOneValue.isAreaFreeFromHazards) ? formTwentyOneValue.isAreaFreeFromHazards : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      isAreaFreeFromHazardsComment: [(formTwentyOneValue && formTwentyOneValue.isAreaFreeFromHazardsComment) ? formTwentyOneValue.isAreaFreeFromHazardsComment : '', Validators.compose([Validators.maxLength(500)])],

      hazardousWarningNoticePosted: [(formTwentyOneValue && formTwentyOneValue.hazardousWarningNoticePosted) ? formTwentyOneValue.hazardousWarningNoticePosted : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      hazardousWarningNoticePostedComment: [(formTwentyOneValue && formTwentyOneValue.hazardousWarningNoticePostedComment) ? formTwentyOneValue.hazardousWarningNoticePostedComment : '', Validators.compose([Validators.maxLength(500)])],

      hazardousPrecautionsTakenAdequate: [(formTwentyOneValue && formTwentyOneValue.hazardousPrecautionsTakenAdequate) ? formTwentyOneValue.hazardousPrecautionsTakenAdequate : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      hazardousPrecautionsTakenAdequateComment: [(formTwentyOneValue && formTwentyOneValue.hazardousPrecautionsTakenAdequateComment) ? formTwentyOneValue.hazardousPrecautionsTakenAdequateComment : '', Validators.compose([Validators.maxLength(500)])],

      hazardousCasualVisitorSafeguard: [(formTwentyOneValue && formTwentyOneValue.hazardousCasualVisitorSafeguard) ? formTwentyOneValue.hazardousCasualVisitorSafeguard : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      hazardousCasualVisitorSafeguardComment: [(formTwentyOneValue && formTwentyOneValue.hazardousCasualVisitorSafeguardComment) ? formTwentyOneValue.hazardousCasualVisitorSafeguardComment : '', Validators.compose([Validators.maxLength(500)])],

      areEntranceAndExitSafe: [(formTwentyOneValue && formTwentyOneValue.areEntranceAndExitSafe) ? formTwentyOneValue.areEntranceAndExitSafe : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areEntranceAndExitSafeComment: [(formTwentyOneValue && formTwentyOneValue.areEntranceAndExitSafeComment) ? formTwentyOneValue.areEntranceAndExitSafeComment : '', Validators.compose([Validators.maxLength(500)])],

      areStaircasesSafe: [(formTwentyOneValue && formTwentyOneValue.areStaircasesSafe) ? formTwentyOneValue.areStaircasesSafe : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areStaircasesSafeComment: [(formTwentyOneValue && formTwentyOneValue.areStaircasesSafeComment) ? formTwentyOneValue.areStaircasesSafeComment : '', Validators.compose([Validators.maxLength(500)])],

      areAllWalkwaysSecure: [(formTwentyOneValue && formTwentyOneValue.areAllWalkwaysSecure) ? formTwentyOneValue.areAllWalkwaysSecure : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areAllWalkwaysSecureComment: [(formTwentyOneValue && formTwentyOneValue.areAllWalkwaysSecureComment) ? formTwentyOneValue.areAllWalkwaysSecureComment : '', Validators.compose([Validators.maxLength(500)])],

      areAllFittingsSecure: [(formTwentyOneValue && formTwentyOneValue.areAllFittingsSecure) ? formTwentyOneValue.areAllFittingsSecure : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areAllFittingsSecureComment: [(formTwentyOneValue && formTwentyOneValue.areAllFittingsSecureComment) ? formTwentyOneValue.areAllFittingsSecureComment : '', Validators.compose([Validators.maxLength(500)])],

      areAwkwardAreas: [(formTwentyOneValue && formTwentyOneValue.areAwkwardAreas) ? formTwentyOneValue.areAwkwardAreas : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areAwkwardAreasComment: [(formTwentyOneValue && formTwentyOneValue.areAwkwardAreasComment) ? formTwentyOneValue.areAwkwardAreasComment : '', Validators.compose([Validators.maxLength(500)])],

      arePassagesFree: [(formTwentyOneValue && formTwentyOneValue.arePassagesFree) ? formTwentyOneValue.arePassagesFree : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      arePassagesFreeComment: [(formTwentyOneValue && formTwentyOneValue.arePassagesFreeComment) ? formTwentyOneValue.arePassagesFreeComment : '', Validators.compose([Validators.maxLength(500)])],

      areDrainPipesWorkingGood: [(formTwentyOneValue && formTwentyOneValue.areDrainPipesWorkingGood) ? formTwentyOneValue.areDrainPipesWorkingGood : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areDrainPipesWorkingGoodComment: [(formTwentyOneValue && formTwentyOneValue.areDrainPipesWorkingGoodComment) ? formTwentyOneValue.areDrainPipesWorkingGoodComment : '', Validators.compose([Validators.maxLength(500)])],

      isProcedureRectifiyingDefectsSatisfactory: [(formTwentyOneValue && formTwentyOneValue.isProcedureRectifiyingDefectsSatisfactory) ? formTwentyOneValue.isProcedureRectifiyingDefectsSatisfactory : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      isProcedureRectifiyingDefectsSatisfactoryComment: [(formTwentyOneValue && formTwentyOneValue.isProcedureRectifiyingDefectsSatisfactoryComment) ? formTwentyOneValue.isProcedureRectifiyingDefectsSatisfactoryComment : '', Validators.compose([Validators.maxLength(500)])],

      isLightingSatisfactory: [(formTwentyOneValue && formTwentyOneValue.isLightingSatisfactory) ? formTwentyOneValue.isLightingSatisfactory : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      isLightingSatisfactoryComment: [(formTwentyOneValue && formTwentyOneValue.isLightingSatisfactoryComment) ? formTwentyOneValue.isLightingSatisfactoryComment : '', Validators.compose([Validators.maxLength(500)])],
      // part B
      ///FLOORS


      isFloorsSlippery: [(formTwentyOneValue && formTwentyOneValue.isFloorsSlippery) ? formTwentyOneValue.isFloorsSlippery : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      isFloorsSlipperyComment: [(formTwentyOneValue && formTwentyOneValue.isFloorsSlipperyComment) ? formTwentyOneValue.isFloorsSlipperyComment : '', Validators.compose([Validators.maxLength(500)])],

      areAllFloorSurfaceDamage: [(formTwentyOneValue && formTwentyOneValue.areAllFloorSurfaceDamage) ? formTwentyOneValue.areAllFloorSurfaceDamage : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areAllFloorSurfaceDamageComment: [(formTwentyOneValue && formTwentyOneValue.areAllFloorSurfaceDamageComment) ? formTwentyOneValue.areAllFloorSurfaceDamageComment : '', Validators.compose([Validators.maxLength(500)])],

      isNonSlipPolishUsed: [(formTwentyOneValue && formTwentyOneValue.isNonSlipPolishUsed) ? formTwentyOneValue.isNonSlipPolishUsed : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      isNonSlipPolishUsedComment: [(formTwentyOneValue && formTwentyOneValue.isNonSlipPolishUsedComment) ? formTwentyOneValue.isNonSlipPolishUsedComment : '', Validators.compose([Validators.maxLength(500)])],

      workingAreaFreeFromObstruction: [(formTwentyOneValue && formTwentyOneValue.workingAreaFreeFromObstruction) ? formTwentyOneValue.workingAreaFreeFromObstruction : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      workingAreaFreeFromObstructionComment: [(formTwentyOneValue && formTwentyOneValue.workingAreaFreeFromObstructionComment) ? formTwentyOneValue.workingAreaFreeFromObstructionComment : '', Validators.compose([Validators.maxLength(500)])],

      floorAdequatelyProtected: [(formTwentyOneValue && formTwentyOneValue.floorAdequatelyProtected) ? formTwentyOneValue.floorAdequatelyProtected : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      floorAdequatelyProtectedComment: [(formTwentyOneValue && formTwentyOneValue.floorAdequatelyProtectedComment) ? formTwentyOneValue.floorAdequatelyProtectedComment : '', Validators.compose([Validators.maxLength(500)])],

      areAreaKeptTidy: [(formTwentyOneValue && formTwentyOneValue.areAreaKeptTidy) ? formTwentyOneValue.areAreaKeptTidy : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areAreaKeptTidyComment: [(formTwentyOneValue && formTwentyOneValue.areAreaKeptTidyComment) ? formTwentyOneValue.areAreaKeptTidyComment : '', Validators.compose([Validators.maxLength(500)])],

      floorMaintenanceTreatment: [(formTwentyOneValue && formTwentyOneValue.floorMaintenanceTreatment) ? formTwentyOneValue.floorMaintenanceTreatment : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      floorMaintenanceTreatmentComment: [(formTwentyOneValue && formTwentyOneValue.floorMaintenanceTreatmentComment) ? formTwentyOneValue.floorMaintenanceTreatmentComment : '', Validators.compose([Validators.maxLength(500)])],

      isSafetyGlassFitted: [(formTwentyOneValue && formTwentyOneValue.isSafetyGlassFitted) ? formTwentyOneValue.isSafetyGlassFitted : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      isSafetyGlassFittedComment: [(formTwentyOneValue && formTwentyOneValue.isSafetyGlassFittedComment) ? formTwentyOneValue.isSafetyGlassFittedComment : '', Validators.compose([Validators.maxLength(500)])],

      areWindowControlAccessibleWorking: [(formTwentyOneValue && formTwentyOneValue.areWindowControlAccessibleWorking) ? formTwentyOneValue.areWindowControlAccessibleWorking : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areWindowControlAccessibleWorkingComment: [(formTwentyOneValue && formTwentyOneValue.areWindowControlAccessibleWorkingComment) ? formTwentyOneValue.areWindowControlAccessibleWorkingComment : '', Validators.compose([Validators.maxLength(500)])],

      areWalkwaysWindowSafe: [(formTwentyOneValue && formTwentyOneValue.areWalkwaysWindowSafe) ? formTwentyOneValue.areWalkwaysWindowSafe : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areWalkwaysWindowSafeComment: [(formTwentyOneValue && formTwentyOneValue.areWalkwaysWindowSafeComment) ? formTwentyOneValue.areWalkwaysWindowSafeComment : '', Validators.compose([Validators.maxLength(500)])],

      isWindowEdgeAboveFloorLevel: [(formTwentyOneValue && formTwentyOneValue.isWindowEdgeAboveFloorLevel) ? formTwentyOneValue.isWindowEdgeAboveFloorLevel : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      isWindowEdgeAboveFloorLevelComment: [(formTwentyOneValue && formTwentyOneValue.isWindowEdgeAboveFloorLevelComment) ? formTwentyOneValue.isWindowEdgeAboveFloorLevelComment : '', Validators.compose([Validators.maxLength(500)])],

      areDevicesPreventWindow: [(formTwentyOneValue && formTwentyOneValue.areDevicesPreventWindow) ? formTwentyOneValue.areDevicesPreventWindow : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areDevicesPreventWindowComment: [(formTwentyOneValue && formTwentyOneValue.areDevicesPreventWindowComment) ? formTwentyOneValue.areDevicesPreventWindowComment : '', Validators.compose([Validators.maxLength(500)])],

      isWindowCleanedSafely: [(formTwentyOneValue && formTwentyOneValue.isWindowCleanedSafely) ? formTwentyOneValue.isWindowCleanedSafely : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      isWindowCleanedSafelyComment: [(formTwentyOneValue && formTwentyOneValue.isWindowCleanedSafelyComment) ? formTwentyOneValue.isWindowCleanedSafelyComment : '', Validators.compose([Validators.maxLength(500)])],

      // part C
      /// STAFF FACILITIES
      ///Toilets and Washing Facilities

      areWashingFacilitiesAdequate: [(formTwentyOneValue && formTwentyOneValue.areWashingFacilitiesAdequate) ? formTwentyOneValue.areWashingFacilitiesAdequate : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areWashingFacilitiesAdequateComment: [(formTwentyOneValue && formTwentyOneValue.areWashingFacilitiesAdequateComment) ? formTwentyOneValue.areWashingFacilitiesAdequateComment : '', Validators.compose([Validators.maxLength(500)])],

      areToiletFacilitiesAdequate: [(formTwentyOneValue && formTwentyOneValue.areToiletFacilitiesAdequate) ? formTwentyOneValue.areToiletFacilitiesAdequate : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areToiletFacilitiesAdequateComment: [(formTwentyOneValue && formTwentyOneValue.areToiletFacilitiesAdequateComment) ? formTwentyOneValue.areToiletFacilitiesAdequateComment : '', Validators.compose([Validators.maxLength(500)])],

      areToiletAreaDisinfected: [(formTwentyOneValue && formTwentyOneValue.areToiletAreaDisinfected) ? formTwentyOneValue.areToiletAreaDisinfected : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areToiletAreaDisinfectedComment: [(formTwentyOneValue && formTwentyOneValue.areToiletAreaDisinfectedComment) ? formTwentyOneValue.areToiletAreaDisinfectedComment : '', Validators.compose([Validators.maxLength(500)])],

      areWasteDisposalSystemsAreasEffective: [(formTwentyOneValue && formTwentyOneValue.areWasteDisposalSystemsAreasEffective) ? formTwentyOneValue.areWasteDisposalSystemsAreasEffective : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areWasteDisposalSystemsAreasEffectiveComment: [(formTwentyOneValue && formTwentyOneValue.areWasteDisposalSystemsAreasEffectiveComment) ? formTwentyOneValue.areWasteDisposalSystemsAreasEffectiveComment : '', Validators.compose([Validators.maxLength(500)])],

      handDryingFacilitiesAvailable: [(formTwentyOneValue && formTwentyOneValue.handDryingFacilitiesAvailable) ? formTwentyOneValue.handDryingFacilitiesAvailable : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      handDryingFacilitiesAvailableComment: [(formTwentyOneValue && formTwentyOneValue.handDryingFacilitiesAvailableComment) ? formTwentyOneValue.handDryingFacilitiesAvailableComment : '', Validators.compose([Validators.maxLength(500)])],

      safetyPostersDisplayed: [(formTwentyOneValue && formTwentyOneValue.safetyPostersDisplayed) ? formTwentyOneValue.safetyPostersDisplayed : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      safetyPostersDisplayedComment: [(formTwentyOneValue && formTwentyOneValue.safetyPostersDisplayedComment) ? formTwentyOneValue.safetyPostersDisplayedComment : '', Validators.compose([Validators.maxLength(500)])],


      /// Facilities For Rest and To Eat Meals

      sufficientFacilitiesForEmployees: [(formTwentyOneValue && formTwentyOneValue.sufficientFacilitiesForEmployees) ? formTwentyOneValue.sufficientFacilitiesForEmployees : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      sufficientFacilitiesForEmployeesComment: [(formTwentyOneValue && formTwentyOneValue.sufficientFacilitiesForEmployeesComment) ? formTwentyOneValue.sufficientFacilitiesForEmployeesComment : '', Validators.compose([Validators.maxLength(500)])],

      employeeEatMealsFacilities: [(formTwentyOneValue && formTwentyOneValue.employeeEatMealsFacilities) ? formTwentyOneValue.employeeEatMealsFacilities : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      employeeEatMealsFacilitiesComment: [(formTwentyOneValue && formTwentyOneValue.employeeEatMealsFacilitiesComment) ? formTwentyOneValue.employeeEatMealsFacilitiesComment : '', Validators.compose([Validators.maxLength(500)])],

      // Cleanliness

      workareaRegularlyCleaned: [(formTwentyOneValue && formTwentyOneValue.workareaRegularlyCleaned) ? formTwentyOneValue.workareaRegularlyCleaned : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      workareaRegularlyCleanedComment: [(formTwentyOneValue && formTwentyOneValue.workareaRegularlyCleanedComment) ? formTwentyOneValue.workareaRegularlyCleanedComment : '', Validators.compose([Validators.maxLength(500)])],

      appropriateCleaningProcesses: [(formTwentyOneValue && formTwentyOneValue.appropriateCleaningProcesses) ? formTwentyOneValue.appropriateCleaningProcesses : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      appropriateCleaningProcessesComment: [(formTwentyOneValue && formTwentyOneValue.appropriateCleaningProcessesComment) ? formTwentyOneValue.appropriateCleaningProcessesComment : '', Validators.compose([Validators.maxLength(500)])],

      isNumberWasteBinsAppropriate: [(formTwentyOneValue && formTwentyOneValue.isNumberWasteBinsAppropriate) ? formTwentyOneValue.isNumberWasteBinsAppropriate : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      isNumberWasteBinsAppropriateComment: [(formTwentyOneValue && formTwentyOneValue.isNumberWasteBinsAppropriateComment) ? formTwentyOneValue.isNumberWasteBinsAppropriateComment : '', Validators.compose([Validators.maxLength(500)])],

      areLabelledCorrectForWaste: [(formTwentyOneValue && formTwentyOneValue.areLabelledCorrectForWaste) ? formTwentyOneValue.areLabelledCorrectForWaste : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areLabelledCorrectForWasteComment: [(formTwentyOneValue && formTwentyOneValue.areLabelledCorrectForWasteComment) ? formTwentyOneValue.areLabelledCorrectForWasteComment : '', Validators.compose([Validators.maxLength(500)])],

      areWastDisposedRegularly: [(formTwentyOneValue && formTwentyOneValue.areWastDisposedRegularly) ? formTwentyOneValue.areWastDisposedRegularly : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areWastDisposedRegularlyComment: [(formTwentyOneValue && formTwentyOneValue.areWastDisposedRegularlyComment) ? formTwentyOneValue.areWastDisposedRegularlyComment : '', Validators.compose([Validators.maxLength(500)])],

      liquidsAdequatelyStored: [(formTwentyOneValue && formTwentyOneValue.liquidsAdequatelyStored) ? formTwentyOneValue.liquidsAdequatelyStored : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      liquidsAdequatelyStoredComment: [(formTwentyOneValue && formTwentyOneValue.liquidsAdequatelyStoredComment) ? formTwentyOneValue.liquidsAdequatelyStoredComment : '', Validators.compose([Validators.maxLength(500)])],

      // C ENVIRONMENT
      /// VENTILATION

      areVentilationArrangementsSatisfactory: [(formTwentyOneValue && formTwentyOneValue.areVentilationArrangementsSatisfactory) ? formTwentyOneValue.areVentilationArrangementsSatisfactory : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areVentilationArrangementsSatisfactoryComment: [(formTwentyOneValue && formTwentyOneValue.areVentilationArrangementsSatisfactoryComment) ? formTwentyOneValue.areVentilationArrangementsSatisfactoryComment : '', Validators.compose([Validators.maxLength(500)])],

      airConditioningPresent: [(formTwentyOneValue && formTwentyOneValue.airConditioningPresent) ? formTwentyOneValue.airConditioningPresent : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      airConditioningPresentComment: [(formTwentyOneValue && formTwentyOneValue.airConditioningPresentComment) ? formTwentyOneValue.airConditioningPresentComment : '', Validators.compose([Validators.maxLength(500)])],

      //NOISE

      workplaceNoiseLevelAccepteble: [(formTwentyOneValue && formTwentyOneValue.workplaceNoiseLevelAccepteble) ? formTwentyOneValue.workplaceNoiseLevelAccepteble : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      workplaceNoiseLevelAcceptebleComment: [(formTwentyOneValue && formTwentyOneValue.workplaceNoiseLevelAcceptebleComment) ? formTwentyOneValue.workplaceNoiseLevelAcceptebleComment : '', Validators.compose([Validators.maxLength(500)])],

      noiseHazardZonesDeclared: [(formTwentyOneValue && formTwentyOneValue.noiseHazardZonesDeclared) ? formTwentyOneValue.noiseHazardZonesDeclared : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      noiseHazardZonesDeclaredComment: [(formTwentyOneValue && formTwentyOneValue.noiseHazardZonesDeclaredComment) ? formTwentyOneValue.noiseHazardZonesDeclaredComment : '', Validators.compose([Validators.maxLength(500)])],

      warningNoticesAdequatelyDisplayed: [(formTwentyOneValue && formTwentyOneValue.warningNoticesAdequatelyDisplayed) ? formTwentyOneValue.warningNoticesAdequatelyDisplayed : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      warningNoticesAdequatelyDisplayedComment: [(formTwentyOneValue && formTwentyOneValue.warningNoticesAdequatelyDisplayedComment) ? formTwentyOneValue.warningNoticesAdequatelyDisplayedComment : '', Validators.compose([Validators.maxLength(500)])],

      earDefendersAvailable: [(formTwentyOneValue && formTwentyOneValue.earDefendersAvailable) ? formTwentyOneValue.earDefendersAvailable : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      earDefendersAvailableComment: [(formTwentyOneValue && formTwentyOneValue.earDefendersAvailableComment) ? formTwentyOneValue.earDefendersAvailableComment : '', Validators.compose([Validators.maxLength(500)])],

      precautionsAgainstEarDamage: [(formTwentyOneValue && formTwentyOneValue.precautionsAgainstEarDamage) ? formTwentyOneValue.precautionsAgainstEarDamage : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      precautionsAgainstEarDamageComment: [(formTwentyOneValue && formTwentyOneValue.precautionsAgainstEarDamageComment) ? formTwentyOneValue.precautionsAgainstEarDamageComment : '', Validators.compose([Validators.maxLength(500)])],

      noiseLevelsMonitored: [(formTwentyOneValue && formTwentyOneValue.noiseLevelsMonitored) ? formTwentyOneValue.noiseLevelsMonitored : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      noiseLevelsMonitoredComment: [(formTwentyOneValue && formTwentyOneValue.noiseLevelsMonitoredComment) ? formTwentyOneValue.noiseLevelsMonitoredComment : '', Validators.compose([Validators.maxLength(500)])],

      /// TEMPERATURE

      workareasMinimumTemperature: [(formTwentyOneValue && formTwentyOneValue.workareasMinimumTemperature) ? formTwentyOneValue.workareasMinimumTemperature : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      workareasMinimumTemperatureComment: [(formTwentyOneValue && formTwentyOneValue.workareasMinimumTemperatureComment) ? formTwentyOneValue.workareasMinimumTemperatureComment : '', Validators.compose([Validators.maxLength(500)])],

      workareasConsiderablePhysicalEffort: [(formTwentyOneValue && formTwentyOneValue.workareasConsiderablePhysicalEffort) ? formTwentyOneValue.workareasConsiderablePhysicalEffort : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      workareasConsiderablePhysicalEffortComment: [(formTwentyOneValue && formTwentyOneValue.workareasConsiderablePhysicalEffortComment) ? formTwentyOneValue.workareasConsiderablePhysicalEffortComment : '', Validators.compose([Validators.maxLength(500)])],

      areHeatingSystemsSuitable: [(formTwentyOneValue && formTwentyOneValue.areHeatingSystemsSuitable) ? formTwentyOneValue.areHeatingSystemsSuitable : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areHeatingSystemsSuitableComment: [(formTwentyOneValue && formTwentyOneValue.areHeatingSystemsSuitableComment) ? formTwentyOneValue.areHeatingSystemsSuitableComment : '', Validators.compose([Validators.maxLength(500)])],

      heatingSystemsServicedRegularly: [(formTwentyOneValue && formTwentyOneValue.heatingSystemsServicedRegularly) ? formTwentyOneValue.heatingSystemsServicedRegularly : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      heatingSystemsServicedRegularlyComment: [(formTwentyOneValue && formTwentyOneValue.heatingSystemsServicedRegularlyComment) ? formTwentyOneValue.heatingSystemsServicedRegularlyComment : '', Validators.compose([Validators.maxLength(500)])],

      guardsFittedInHeatingAppliances: [(formTwentyOneValue && formTwentyOneValue.guardsFittedInHeatingAppliances) ? formTwentyOneValue.guardsFittedInHeatingAppliances : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      guardsFittedInHeatingAppliancesComment: [(formTwentyOneValue && formTwentyOneValue.guardsFittedInHeatingAppliancesComment) ? formTwentyOneValue.guardsFittedInHeatingAppliancesComment : '', Validators.compose([Validators.maxLength(500)])],

      satisfactoryProtectiveClothingProvided: [(formTwentyOneValue && formTwentyOneValue.satisfactoryProtectiveClothingProvided) ? formTwentyOneValue.satisfactoryProtectiveClothingProvided : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      satisfactoryProtectiveClothingProvidedComment: [(formTwentyOneValue && formTwentyOneValue.satisfactoryProtectiveClothingProvidedComment) ? formTwentyOneValue.satisfactoryProtectiveClothingProvidedComment : '', Validators.compose([Validators.maxLength(500)])],

      accessibleThermometerForStaff: [(formTwentyOneValue && formTwentyOneValue.accessibleThermometerForStaff) ? formTwentyOneValue.accessibleThermometerForStaff : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      accessibleThermometerForStaffComment: [(formTwentyOneValue && formTwentyOneValue.accessibleThermometerForStaffComment) ? formTwentyOneValue.accessibleThermometerForStaffComment : '', Validators.compose([Validators.maxLength(500)])],

      ///LIGHTING

      lightingInWorkareas: [(formTwentyOneValue && formTwentyOneValue.lightingInWorkareas) ? formTwentyOneValue.lightingInWorkareas : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      lightingInWorkareasComment: [(formTwentyOneValue && formTwentyOneValue.lightingInWorkareasComment) ? formTwentyOneValue.lightingInWorkareasComment : '', Validators.compose([Validators.maxLength(500)])],

      anyChangesInWalkingLevels: [(formTwentyOneValue && formTwentyOneValue.anyChangesInWalkingLevels) ? formTwentyOneValue.anyChangesInWalkingLevels : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      anyChangesInWalkingLevelsComment: [(formTwentyOneValue && formTwentyOneValue.anyChangesInWalkingLevelsComment) ? formTwentyOneValue.anyChangesInWalkingLevelsComment : '', Validators.compose([Validators.maxLength(500)])],

      areLightFittingsCorrectlyPositioned: [(formTwentyOneValue && formTwentyOneValue.areLightFittingsCorrectlyPositioned) ? formTwentyOneValue.areLightFittingsCorrectlyPositioned : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areLightFittingsCorrectlyPositionedComment: [(formTwentyOneValue && formTwentyOneValue.areLightFittingsCorrectlyPositionedComment) ? formTwentyOneValue.areLightFittingsCorrectlyPositionedComment : '', Validators.compose([Validators.maxLength(500)])],

      repairFaultyLightingSatisfactory: [(formTwentyOneValue && formTwentyOneValue.repairFaultyLightingSatisfactory) ? formTwentyOneValue.repairFaultyLightingSatisfactory : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      repairFaultyLightingSatisfactoryComment: [(formTwentyOneValue && formTwentyOneValue.repairFaultyLightingSatisfactoryComment) ? formTwentyOneValue.repairFaultyLightingSatisfactoryComment : '', Validators.compose([Validators.maxLength(500)])],

      reportingDefectProcess: [(formTwentyOneValue && formTwentyOneValue.reportingDefectProcess) ? formTwentyOneValue.reportingDefectProcess : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      reportingDefectProcessComment: [(formTwentyOneValue && formTwentyOneValue.reportingDefectProcessComment) ? formTwentyOneValue.reportingDefectProcessComment : '', Validators.compose([Validators.maxLength(500)])],

      isEmergencyLightingProvided: [(formTwentyOneValue && formTwentyOneValue.isEmergencyLightingProvided) ? formTwentyOneValue.isEmergencyLightingProvided : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      isEmergencyLightingProvidedComment: [(formTwentyOneValue && formTwentyOneValue.isEmergencyLightingProvidedComment) ? formTwentyOneValue.isEmergencyLightingProvidedComment : '', Validators.compose([Validators.maxLength(500)])],

      isEmergencyLightingRegularlyTested: [(formTwentyOneValue && formTwentyOneValue.isEmergencyLightingRegularlyTested) ? formTwentyOneValue.isEmergencyLightingRegularlyTested : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      isEmergencyLightingRegularlyTestedComment: [(formTwentyOneValue && formTwentyOneValue.isEmergencyLightingRegularlyTestedComment) ? formTwentyOneValue.isEmergencyLightingRegularlyTestedComment : '', Validators.compose([Validators.maxLength(500)])],

      /// WORKSTATIONS AND SEATING

      furnitureProvidedGoodState: [(formTwentyOneValue && formTwentyOneValue.furnitureProvidedGoodState) ? formTwentyOneValue.furnitureProvidedGoodState : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      furnitureProvidedGoodStateComment: [(formTwentyOneValue && formTwentyOneValue.furnitureProvidedGoodStateComment) ? formTwentyOneValue.furnitureProvidedGoodStateComment : '', Validators.compose([Validators.maxLength(500)])],

      isSuitableForPersonnelUse: [(formTwentyOneValue && formTwentyOneValue.isSuitableForPersonnelUse) ? formTwentyOneValue.isSuitableForPersonnelUse : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      isSuitableForPersonnelUseComment: [(formTwentyOneValue && formTwentyOneValue.isSuitableForPersonnelUseComment) ? formTwentyOneValue.isSuitableForPersonnelUseComment : '', Validators.compose([Validators.maxLength(500)])],

      workSurfacesAppropriateHeightForWork: [(formTwentyOneValue && formTwentyOneValue.workSurfacesAppropriateHeightForWork) ? formTwentyOneValue.workSurfacesAppropriateHeightForWork : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      workSurfacesAppropriateHeightForWorkComment: [(formTwentyOneValue && formTwentyOneValue.workSurfacesAppropriateHeightForWorkComment) ? formTwentyOneValue.workSurfacesAppropriateHeightForWorkComment : '', Validators.compose([Validators.maxLength(500)])],

      isSeatingAppropriate: [(formTwentyOneValue && formTwentyOneValue.isSeatingAppropriate) ? formTwentyOneValue.isSeatingAppropriate : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      isSeatingAppropriateComment: [(formTwentyOneValue && formTwentyOneValue.isSeatingAppropriateComment) ? formTwentyOneValue.isSeatingAppropriateComment : '', Validators.compose([Validators.maxLength(500)])],

      isSufficientSpaceAroundWorkstations: [(formTwentyOneValue && formTwentyOneValue.isSufficientSpaceAroundWorkstations) ? formTwentyOneValue.isSufficientSpaceAroundWorkstations : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      isSufficientSpaceAroundWorkstationsComment: [(formTwentyOneValue && formTwentyOneValue.isSufficientSpaceAroundWorkstationsComment) ? formTwentyOneValue.isSufficientSpaceAroundWorkstationsComment : '', Validators.compose([Validators.maxLength(500)])],

      frequentlyUsedworkEquipment: [(formTwentyOneValue && formTwentyOneValue.frequentlyUsedworkEquipment) ? formTwentyOneValue.frequentlyUsedworkEquipment : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      frequentlyUsedworkEquipmentComment: [(formTwentyOneValue && formTwentyOneValue.frequentlyUsedworkEquipmentComment) ? formTwentyOneValue.frequentlyUsedworkEquipmentComment : '', Validators.compose([Validators.maxLength(500)])],
      // GENERAL SAFETY ARRANGEMENTS
      /// FIRE

      fireEscapeRoutesClearly: [(formTwentyOneValue && formTwentyOneValue.fireEscapeRoutesClearly) ? formTwentyOneValue.fireEscapeRoutesClearly : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      fireEscapeRoutesClearlyComment: [(formTwentyOneValue && formTwentyOneValue.fireEscapeRoutesClearlyComment) ? formTwentyOneValue.fireEscapeRoutesClearlyComment : '', Validators.compose([Validators.maxLength(500)])],

      actionInEventOfFire: [(formTwentyOneValue && formTwentyOneValue.actionInEventOfFire) ? formTwentyOneValue.actionInEventOfFire : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      actionInEventOfFireComment: [(formTwentyOneValue && formTwentyOneValue.actionInEventOfFireComment) ? formTwentyOneValue.actionInEventOfFireComment : '', Validators.compose([Validators.maxLength(500)])],

      areFireExitsRegularlyChecked: [(formTwentyOneValue && formTwentyOneValue.areFireExitsRegularlyChecked) ? formTwentyOneValue.areFireExitsRegularlyChecked : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areFireExitsRegularlyCheckedComment: [(formTwentyOneValue && formTwentyOneValue.areFireExitsRegularlyCheckedComment) ? formTwentyOneValue.areFireExitsRegularlyCheckedComment : '', Validators.compose([Validators.maxLength(500)])],

      fireFightingEquipmentReady: [(formTwentyOneValue && formTwentyOneValue.fireFightingEquipmentReady) ? formTwentyOneValue.fireFightingEquipmentReady : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      fireFightingEquipmentReadyComment: [(formTwentyOneValue && formTwentyOneValue.fireFightingEquipmentReadyComment) ? formTwentyOneValue.fireFightingEquipmentReadyComment : '', Validators.compose([Validators.maxLength(500)])],

      isRegularlyChecked: [(formTwentyOneValue && formTwentyOneValue.isRegularlyChecked) ? formTwentyOneValue.isRegularlyChecked : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      isRegularlyCheckedComment: [(formTwentyOneValue && formTwentyOneValue.isRegularlyCheckedComment) ? formTwentyOneValue.isRegularlyCheckedComment : '', Validators.compose([Validators.maxLength(500)])],

      buildingPlanWithFireEquipment: [(formTwentyOneValue && formTwentyOneValue.buildingPlanWithFireEquipment) ? formTwentyOneValue.buildingPlanWithFireEquipment : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      buildingPlanWithFireEquipmentComment: [(formTwentyOneValue && formTwentyOneValue.buildingPlanWithFireEquipmentComment) ? formTwentyOneValue.buildingPlanWithFireEquipmentComment : '', Validators.compose([Validators.maxLength(500)])],

      fireBrigadeAccessRoutes: [(formTwentyOneValue && formTwentyOneValue.fireBrigadeAccessRoutes) ? formTwentyOneValue.fireBrigadeAccessRoutes : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      fireBrigadeAccessRoutesComment: [(formTwentyOneValue && formTwentyOneValue.fireBrigadeAccessRoutesComment) ? formTwentyOneValue.fireBrigadeAccessRoutesComment : '', Validators.compose([Validators.maxLength(500)])],

      noSmokingOnPremises: [(formTwentyOneValue && formTwentyOneValue.noSmokingOnPremises) ? formTwentyOneValue.noSmokingOnPremises : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      noSmokingOnPremisesComment: [(formTwentyOneValue && formTwentyOneValue.noSmokingOnPremisesComment) ? formTwentyOneValue.noSmokingOnPremisesComment : '', Validators.compose([Validators.maxLength(500)])],

      fireAlarmsFittedRegularlyTested: [(formTwentyOneValue && formTwentyOneValue.fireAlarmsFittedRegularlyTested) ? formTwentyOneValue.fireAlarmsFittedRegularlyTested : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      fireAlarmsFittedRegularlyTestedComment: [(formTwentyOneValue && formTwentyOneValue.fireAlarmsFittedRegularlyTestedComment) ? formTwentyOneValue.fireAlarmsFittedRegularlyTestedComment : '', Validators.compose([Validators.maxLength(500)])],
      // FIRST AID
      firstAidRiskAssessment: [(formTwentyOneValue && formTwentyOneValue.firstAidRiskAssessment) ? formTwentyOneValue.firstAidRiskAssessment : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      firstAidRiskAssessmentComment: [(formTwentyOneValue && formTwentyOneValue.firstAidRiskAssessmentComment) ? formTwentyOneValue.firstAidRiskAssessmentComment : '', Validators.compose([Validators.maxLength(500)])],

      firstAidBoxesCheckedRecently: [(formTwentyOneValue && formTwentyOneValue.firstAidBoxesCheckedRecently) ? formTwentyOneValue.firstAidBoxesCheckedRecently : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      firstAidBoxesCheckedRecentlyComment: [(formTwentyOneValue && formTwentyOneValue.firstAidBoxesCheckedRecentlyComment) ? formTwentyOneValue.firstAidBoxesCheckedRecentlyComment : '', Validators.compose([Validators.maxLength(500)])],

      isResuscitationEquipmentChecked: [(formTwentyOneValue && formTwentyOneValue.isResuscitationEquipmentChecked) ? formTwentyOneValue.isResuscitationEquipmentChecked : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      isResuscitationEquipmentCheckedComment: [(formTwentyOneValue && formTwentyOneValue.isResuscitationEquipmentCheckedComment) ? formTwentyOneValue.isResuscitationEquipmentCheckedComment : '', Validators.compose([Validators.maxLength(500)])],

      nameOfNominatedfirstaidPersonClearlyDisplayed: [(formTwentyOneValue && formTwentyOneValue.nameOfNominatedfirstaidPersonClearlyDisplayed) ? formTwentyOneValue.nameOfNominatedfirstaidPersonClearlyDisplayed : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      nameOfNominatedfirstaidPersonClearlyDisplayedComment: [(formTwentyOneValue && formTwentyOneValue.nameOfNominatedfirstaidPersonClearlyDisplayedComment) ? formTwentyOneValue.nameOfNominatedfirstaidPersonClearlyDisplayedComment : '', Validators.compose([Validators.maxLength(500)])],

      isProceduresCaterAccident: [(formTwentyOneValue && formTwentyOneValue.isProceduresCaterAccident) ? formTwentyOneValue.isProceduresCaterAccident : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      isProceduresCaterAccidentComment: [(formTwentyOneValue && formTwentyOneValue.isProceduresCaterAccidentComment) ? formTwentyOneValue.isProceduresCaterAccidentComment : '', Validators.compose([Validators.maxLength(500)])],

      /// COMMUNICATION
      provideSpeedyReactionInAccident: [(formTwentyOneValue && formTwentyOneValue.provideSpeedyReactionInAccident) ? formTwentyOneValue.provideSpeedyReactionInAccident : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      provideSpeedyReactionInAccidentComment: [(formTwentyOneValue && formTwentyOneValue.provideSpeedyReactionInAccidentComment) ? formTwentyOneValue.provideSpeedyReactionInAccidentComment : '', Validators.compose([Validators.maxLength(500)])],

      areEmergencyArrangementsProvided: [(formTwentyOneValue && formTwentyOneValue.areEmergencyArrangementsProvided) ? formTwentyOneValue.areEmergencyArrangementsProvided : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areEmergencyArrangementsProvidedComment: [(formTwentyOneValue && formTwentyOneValue.areEmergencyArrangementsProvidedComment) ? formTwentyOneValue.areEmergencyArrangementsProvidedComment : '', Validators.compose([Validators.maxLength(500)])],
      //PERSONAL PROTECTION
      protectiveClothes: [(formTwentyOneValue && formTwentyOneValue.protectiveClothes) ? formTwentyOneValue.protectiveClothes : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      protectiveClothesComment: [(formTwentyOneValue && formTwentyOneValue.protectiveClothesComment) ? formTwentyOneValue.protectiveClothesComment : '', Validators.compose([Validators.maxLength(500)])],

      earDefenders: [(formTwentyOneValue && formTwentyOneValue.earDefenders) ? formTwentyOneValue.earDefenders : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      earDefendersComment: [(formTwentyOneValue && formTwentyOneValue.earDefendersComment) ? formTwentyOneValue.earDefendersComment : '', Validators.compose([Validators.maxLength(500)])],

      gogglesGlasses: [(formTwentyOneValue && formTwentyOneValue.gogglesGlasses) ? formTwentyOneValue.gogglesGlasses : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      gogglesGlassesComment: [(formTwentyOneValue && formTwentyOneValue.gogglesGlassesComment) ? formTwentyOneValue.gogglesGlassesComment : '', Validators.compose([Validators.maxLength(500)])],

      smokeDustMasks: [(formTwentyOneValue && formTwentyOneValue.smokeDustMasks) ? formTwentyOneValue.smokeDustMasks : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      smokeDustMasksComment: [(formTwentyOneValue && formTwentyOneValue.smokeDustMasksComment) ? formTwentyOneValue.smokeDustMasksComment : '', Validators.compose([Validators.maxLength(500)])],

      protectiveScreens: [(formTwentyOneValue && formTwentyOneValue.protectiveScreens) ? formTwentyOneValue.protectiveScreens : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      protectiveScreensComment: [(formTwentyOneValue && formTwentyOneValue.protectiveScreensComment) ? formTwentyOneValue.protectiveScreensComment : '', Validators.compose([Validators.maxLength(500)])],
      //  HOUSEKEEPING
      areMaterialsStackedSafely: [(formTwentyOneValue && formTwentyOneValue.areMaterialsStackedSafely) ? formTwentyOneValue.areMaterialsStackedSafely : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areMaterialsStackedSafelyComment: [(formTwentyOneValue && formTwentyOneValue.areMaterialsStackedSafelyComment) ? formTwentyOneValue.areMaterialsStackedSafelyComment : '', Validators.compose([Validators.maxLength(500)])],

      areWastMaterialsKeptAwayAfterUse: [(formTwentyOneValue && formTwentyOneValue.areWastMaterialsKeptAwayAfterUse) ? formTwentyOneValue.areWastMaterialsKeptAwayAfterUse : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areWastMaterialsKeptAwayAfterUseComment: [(formTwentyOneValue && formTwentyOneValue.areWastMaterialsKeptAwayAfterUseComment) ? formTwentyOneValue.areWastMaterialsKeptAwayAfterUseComment : '', Validators.compose([Validators.maxLength(500)])],

      areWalkwaysFreeFromStorage: [(formTwentyOneValue && formTwentyOneValue.areWalkwaysFreeFromStorage) ? formTwentyOneValue.areWalkwaysFreeFromStorage : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areWalkwaysFreeFromStorageComment: [(formTwentyOneValue && formTwentyOneValue.areWalkwaysFreeFromStorageComment) ? formTwentyOneValue.areWalkwaysFreeFromStorageComment : '', Validators.compose([Validators.maxLength(500)])],

      areElectricalLeadsProtected: [(formTwentyOneValue && formTwentyOneValue.areElectricalLeadsProtected) ? formTwentyOneValue.areElectricalLeadsProtected : 0, Validators.compose([Validators.required, Validators.min(0), Validators.max(4)])],
      areElectricalLeadsProtectedComment: [(formTwentyOneValue && formTwentyOneValue.areElectricalLeadsProtectedComment) ? formTwentyOneValue.areElectricalLeadsProtectedComment : '', Validators.compose([Validators.maxLength(500)])],

      //ADDITIONAL NOTES	
      additionalNote: [(formTwentyOneValue && formTwentyOneValue.additionalNote) ? formTwentyOneValue.additionalNote : '', Validators.compose([Validators.maxLength(500)])],

      totalScore: [(formTwentyOneValue && formTwentyOneValue.totalScore) ? formTwentyOneValue.totalScore : 0, Validators.compose([Validators.required])],
      calculatedScore: [(formTwentyOneValue && formTwentyOneValue.calculatedScore) ? formTwentyOneValue.calculatedScore : 0, Validators.compose([Validators.required])],
      maxScore: [(formTwentyOneValue && formTwentyOneValue.maxScore) ? formTwentyOneValue.maxScore : (96*4), Validators.compose([Validators.required])],



      signoffBy: [(formTwentyOneValue && formTwentyOneValue.signoffBy) ? formTwentyOneValue.signoffBy : null],
      isSignedOff: [(formTwentyOneValue && formTwentyOneValue.isSignedOff) ? formTwentyOneValue.isSignedOff : false],
      locationId: [(formTwentyOneValue && formTwentyOneValue.locationId) ? formTwentyOneValue.locationId : null, Validators.required],
      careHomeId: [(formTwentyOneValue && formTwentyOneValue.careHomeId) ? formTwentyOneValue.careHomeId : careHomeId],
      createdBy: [(formTwentyOneValue && formTwentyOneValue.createdBy) ? formTwentyOneValue.createdBy : this.currentUserId],
      createdAt: [(formTwentyOneValue && formTwentyOneValue.createdAt) ? formTwentyOneValue.createdAt : new Date().toISOString()]
    });

    this.completeForm();

  }

  private objectKeyMap() {
    this.scores = Object.keys(this.tempObj).map(key => ({ index: key, value: this.tempObj[key] }));
  }

}
