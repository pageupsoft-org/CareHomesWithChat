import { User } from "./user";

export class AuditFormNine {

    id: number;
    auditedBy: number;
    auditDate: Date;
    locationId: number;
    careHomeId: number;

    // Deliveries
    deliveriesPutAwayAction:boolean;
    deliveriesPutAwayComment:string;
 
    // Storage
    rawOtherFoodsStoredAction:boolean;
    rawOtherFoodsStoredComment:string;
 
    foodSuitablyCoveredAction:boolean;
    foodSuitablyCoveredComment:string;
 
    foodGradeMaterialAction:boolean;
    foodGradeMaterialComment:string;
 
    noFoodOpenedAction:boolean;
    noFoodOpenedComment:string;
 
    foodClearAction:boolean;
    foodClearComment:string;
 
    noUnnecessaryGlassAction:boolean;
    noUnnecessaryGlassComment:string;
 
    noDirtyPackagingAction:boolean;
    noDirtyPackagingComment:string;
 
    noOverStockingAction:boolean;
    noOverStockingComment:string;
 
    // Preparation
 
    foodInProcessAction:boolean;
    foodInProcessComment:string;
 
    noExcessiveHandlingAction:boolean;
    noExcessiveHandlingComment:string;
 
    noHighRiskUseRawEggsAction:boolean;
    noHighRiskUseRawEggsComment:string;
 
    adequateSeparationActivitiesAction:boolean;
    adequateSeparationActivitiesComment:string;
 
    quantitiesOfTemperatureAction:boolean;
    quantitiesOfTemperatureComment:string;
 
    sufficientkitchenEquipmentAction:boolean;
    sufficientkitchenEquipmentComment:string;
 
    //  Personal Hygiene
 
    staffFacilitiesCleanAction:boolean;
    staffFacilitiesCleanComment:string;
 
    staffAppearanceSatisfactoryAction:boolean;
    staffAppearanceSatisfactoryComment:string;
 
    adequateProtectiveClothingAction:boolean;
    adequateProtectiveClothingComment:string;
 
    noBadHabitsPracticesAction:boolean;
    noBadHabitsPracticesComment:string;
 
    handWashDisciplinesAction:boolean;
    handWashDisciplinesComment:string;
 
    handWashBasinsStockedAction:boolean;
    handWashBasinsStockedComment:string;
 
    noticeInStaffToiletAction:boolean;
    noticeInStaffToiletComment:string;
 
    firstAidAvailableInKitchenAction:boolean;
    firstAidAvailableInKitchenComment:string;
 
    // Temperature Control
 
    fridgesAtZeroToFiveCAction:boolean;
    fridgesAtZeroToFiveCComment:string;
 
    fridgesBelow18Action:boolean;
    fridgesBelow18Comment:string;
 
    thermometerOrCasingDisplayAction:boolean;
    thermometerOrCasingDisplayComment:string;
    
    thermometerDisinfectantWipesAction:boolean;
    thermometerDisinfectantWipesComment:string;
    
    foodInProcessOfPreparationAction:boolean;
    foodInProcessOfPreparationComment:string;
    
    foodStoredCorrectlyAction:boolean;
    foodStoredCorrectlyComment:string;
    
    frozenFoodSuitablyAction:boolean;
    frozenFoodSuitablyComment:string;
    
    foodCookedReheatedAction:boolean;
    foodCookedReheatedComment:string;
    
    thermometerUseVerifyFoodTempAction:boolean;
    thermometerUseVerifyFoodTempComment:string;
    
    noMisuseEquipmentAction:boolean;
    noMisuseEquipmentComment:string;
    
    hotFoodCoolingPeriodAction:boolean;
    hotFoodCoolingPeriodComment:string;
    
    foodDisplayedAction:boolean;
    foodDisplayedComment:string;
    
    foodDisplayedTempControlAction:boolean;
    foodDisplayedTempControlComment:string;
 
    // Cleaning and Disinfection
 
    separateDirtyEquipmentAction:boolean;
    separateDirtyEquipmentComment:string;
 
    visualStandardsOfHousekeepingAction:boolean;
    visualStandardsOfHousekeepingComment:string;
 
    apparentAction:boolean;
    apparentComment:string;
 
    // Cleaning and Disinfection
 
    cleaningScheduleAction:boolean;
    cleaningScheduleComment:string;
 
    cleaningChemicalsAvailableAction:boolean;
    cleaningChemicalsAvailableComment:string;
 
    sufficientCleaningEquipmentAction:boolean;
    sufficientCleaningEquipmentComment:string;
    
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

    }
}
