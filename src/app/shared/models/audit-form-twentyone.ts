// import { User } from "firebase"; //TODO:generating error
import { User } from 'src/app/shared/models/user';

export class AuditFormTwentyOne {

    id: number;
    auditedBy: number;
    auditDate: Date;
    locationId: number;
    careHomeId: number;

    isBuildingStructureDefects: number;
    isBuildingStructureDefectsComment: string;
    isBuildingMaintainedAdequately: number;
    isBuildingMaintainedAdequatelyComment: string;
    areElectricServicesFree: number;
    areElectricServicesFreeComment: string;
    isAreaFreeFromHazards: number;
    isAreaFreeFromHazardsComment: string;
    hazardousWarningNoticePosted: number;
    hazardousWarningNoticePostedComment: string;
    hazardousPrecautionsTakenAdequate: number;
    hazardousPrecautionsTakenAdequateComment: string;
    hazardousCasualVisitorSafeguard: number;
    hazardousCasualVisitorSafeguardComment: string;
    areEntranceAndExitSafe: number;
    areEntranceAndExitSafeComment: string;
    areStaircasesSafe: number;
    areStaircasesSafeComment: string;
    areAllWalkwaysSecure: number;
    areAllWalkwaysSecureComment: string;
    areAllFittingsSecure: number;
    areAllFittingsSecureComment: string;
    areAwkwardAreas: number;
    areAwkwardAreasComment: string;
    arePassagesFree: number;
    arePassagesFreeComment: string;
    areDrainPipesWorkingGood: number;
    areDrainPipesWorkingGoodComment: string;
    isProcedureRectifiyingDefectsSatisfactory: number;
    isProcedureRectifiyingDefectsSatisfactoryComment: string;
    isLightingSatisfactory: number;
    isLightingSatisfactoryComment: string;

    // part B
    ///FLOORS

    isFloorsSlippery: number;
    isFloorsSlipperyComment: string;
    areAllFloorSurfaceDamage: number;
    areAllFloorSurfaceDamageComment: string;
    isNonSlipPolishUsed: number;
    isNonSlipPolishUsedComment: string;
    workingAreaFreeFromObstruction: number;
    workingAreaFreeFromObstructionComment: string;
    floorAdequatelyProtected: number;
    floorAdequatelyProtectedComment: string;
    areAreaKeptTidy: number;
    areAreaKeptTidyComment: string;
    floorMaintenanceTreatment: number;
    floorMaintenanceTreatmentComment: string;
    isSafetyGlassFitted: number;
    isSafetyGlassFittedComment: string;
    areWindowControlAccessibleWorking: number;
    areWindowControlAccessibleWorkingComment: string;
    areWalkwaysWindowSafe: number;
    areWalkwaysWindowSafeComment: string;
    isWindowEdgeAboveFloorLevel: number;
    isWindowEdgeAboveFloorLevelComment: string;
    areDevicesPreventWindow: number;
    areDevicesPreventWindowComment: string;
    isWindowCleanedSafely: number;
    isWindowCleanedSafelyComment: string;

    // part C
    /// STAFF FACILITIES
    ///Toilets and Washing Facilities
    areWashingFacilitiesAdequate: number;
    areWashingFacilitiesAdequateComment: string;
    areToiletFacilitiesAdequate: number;
    areToiletFacilitiesAdequateComment: string;
    areToiletAreaDisinfected: number;
    areToiletAreaDisinfectedComment: string;
    areWasteDisposalSystemsAreasEffective: number;
    areWasteDisposalSystemsAreasEffectiveComment: string;
    handDryingFacilitiesAvailable: number;
    handDryingFacilitiesAvailableComment: string;
    safetyPostersDisplayed: number;
    safetyPostersDisplayedComment: string;

    /// Facilities For Rest and To Eat Meals

    sufficientFacilitiesForEmployees: number;
    sufficientFacilitiesForEmployeesComment: string;
    employeeEatMealsFacilities: number;
    employeeEatMealsFacilitiesComment: string;

    // Cleanliness

    workareaRegularlyCleaned: number;
    workareaRegularlyCleanedComment: string;
    appropriateCleaningProcesses: number;
    appropriateCleaningProcessesComment: string;
    isNumberWasteBinsAppropriate: number;
    isNumberWasteBinsAppropriateComment: string;
    areLabelledCorrectForWaste: number;
    areLabelledCorrectForWasteComment: string;
    areWastDisposedRegularly: number;
    areWastDisposedRegularlyComment: string;
    liquidsAdequatelyStored: number;
    liquidsAdequatelyStoredComment: string;

    // C ENVIRONMENT
    /// VENTILATION

    areVentilationArrangementsSatisfactory: number;
    areVentilationArrangementsSatisfactoryComment: string;
    airConditioningPresent: number;
    airConditioningPresentComment: string;

    //NOISE

    workplaceNoiseLevelAccepteble: number;
    workplaceNoiseLevelAcceptebleComment: string;
    noiseHazardZonesDeclared: number;
    noiseHazardZonesDeclaredComment: string;
    warningNoticesAdequatelyDisplayed: number;
    warningNoticesAdequatelyDisplayedComment: string;
    earDefendersAvailable: number;
    earDefendersAvailableComment: string;
    precautionsAgainstEarDamage: number;
    precautionsAgainstEarDamageComment: string;
    noiseLevelsMonitored: number;
    noiseLevelsMonitoredComment: string;

    /// TEMPERATURE

    workareasMinimumTemperature: number;
    workareasMinimumTemperatureComment: string;
    workareasConsiderablePhysicalEffort: number;
    workareasConsiderablePhysicalEffortComment: string;
    areHeatingSystemsSuitable: number;
    areHeatingSystemsSuitableComment: string;
    heatingSystemsServicedRegularly: number;
    heatingSystemsServicedRegularlyComment: string;
    guardsFittedInHeatingAppliances: number;
    guardsFittedInHeatingAppliancesComment: string;
    satisfactoryProtectiveClothingProvided: number;
    satisfactoryProtectiveClothingProvidedComment: string;
    accessibleThermometerForStaff: number;
    accessibleThermometerForStaffComment: string;

    ///LIGHTING

    lightingInWorkareas: number;
    lightingInWorkareasComment: string;
    anyChangesInWalkingLevels: number;
    anyChangesInWalkingLevelsComment: string;
    areLightFittingsCorrectlyPositioned: number;
    areLightFittingsCorrectlyPositionedComment: string;
    repairFaultyLightingSatisfactory: number;
    repairFaultyLightingSatisfactoryComment: string;
    reportingDefectProcess: number;
    reportingDefectProcessComment: string;
    isEmergencyLightingProvided: number;
    isEmergencyLightingProvidedComment: string;
    isEmergencyLightingRegularlyTested: number;
    isEmergencyLightingRegularlyTestedComment: string;

    /// WORKSTATIONS AND SEATING

    furnitureProvidedGoodState: number;
    furnitureProvidedGoodStateComment: string;
    isSuitableForPersonnelUse: number;
    isSuitableForPersonnelUseComment: string;
    workSurfacesAppropriateHeightForWork: number;
    workSurfacesAppropriateHeightForWorkComment: string;
    isSeatingAppropriate: number;
    isSeatingAppropriateComment: string;
    isSufficientSpaceAroundWorkstations: number;
    isSufficientSpaceAroundWorkstationsComment: string;
    frequentlyUsedworkEquipment: number;
    frequentlyUsedworkEquipmentComment: string;

    // GENERAL SAFETY ARRANGEMENTS
    /// FIRE

    fireEscapeRoutesClearly: number;
    fireEscapeRoutesClearlyComment: string;
    actionInEventOfFire: number;
    actionInEventOfFireComment: string;
    areFireExitsRegularlyChecked: number;
    areFireExitsRegularlyCheckedComment: string;
    fireFightingEquipmentReady: number;
    fireFightingEquipmentReadyComment: string;
    isRegularlyChecked: number;
    isRegularlyCheckedComment: string;
    buildingPlanWithFireEquipment: number;
    buildingPlanWithFireEquipmentComment: string;
    fireBrigadeAccessRoutes: number;
    fireBrigadeAccessRoutesComment: string;
    noSmokingOnPremises: number;
    noSmokingOnPremisesComment: string;
    fireAlarmsFittedRegularlyTested: number;
    fireAlarmsFittedRegularlyTestedComment: string;

    // FIRST AID

    firstAidRiskAssessment: number;
    firstAidRiskAssessmentComment: string;
    firstAidBoxesCheckedRecently: number;
    firstAidBoxesCheckedRecentlyComment: string;
    isResuscitationEquipmentChecked: number;
    isResuscitationEquipmentCheckedComment: string;
    nameOfNominatedfirstaidPersonClearlyDisplayed: number;
    nameOfNominatedfirstaidPersonClearlyDisplayedComment: string;
    isProceduresCaterAccident: number;
    isProceduresCaterAccidentComment: string;

    /// COMMUNICATION
    provideSpeedyReactionInAccident: number;
    provideSpeedyReactionInAccidentComment: string;
    areEmergencyArrangementsProvided: number;
    areEmergencyArrangementsProvidedComment: string;

    //PERSONAL PROTECTION

    protectiveClothes: number;
    protectiveClothesComment: string;
    earDefenders: number;
    earDefendersComment: string;
    gogglesGlasses: number;
    gogglesGlassesComment: string;
    smokeDustMasks: number;
    smokeDustMasksComment: string;
    protectiveScreens: number;
    protectiveScreensComment: string;

    //  HOUSEKEEPING

    areMaterialsStackedSafely: number;
    areMaterialsStackedSafelyComment: string;
    areWastMaterialsKeptAwayAfterUse: number;
    areWastMaterialsKeptAwayAfterUseComment: string;
    areWalkwaysFreeFromStorage: number;
    areWalkwaysFreeFromStorageComment: string;
    areElectricalLeadsProtected: number;
    areElectricalLeadsProtectedComment: string;

    //ADDITIONAL NOTES	

    additionalNote: string;

    totalScore: number;
    maxScore: number;
    calculatedScore: number;

    signoffBy: number;
    isSignedOff: boolean;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: number;
    auditor: User;
    locationName: string;
    signoffByName: string;
    constructor() {
        this.isSignedOff = false;
    }
}
