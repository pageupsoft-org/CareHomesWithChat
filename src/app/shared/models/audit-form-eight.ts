import { User } from "./user";

export class AuditFormEight {

    id: number;
    auditedBy: number;
    auditDate: Date;
    locationId: number;
    careHomeId: number;

    blanketAccidentQuantity: string;
    blanketAccidentCheckBy: number;

    cottonBallsQuantity: string;
    cottonBallsCheckBy: number;

    disposableGlovesQuantity: string;
    disposableGlovesCheckBy: number;

    bottleHardPlasticQuantity: string;
    bottleHardPlasticCheckBy: number;

    crepeBandageQuantity: string;
    crepeBandageCheckBy: number;

    eyePadSterileQuantity: string;
    eyePadSterileCheckBy: number;

    freezerBagsQuantity: string;
    freezerBagsCheckBy: number;

    instantColdPackQuantity: string;
    instantColdPackCheckBy: number;

    jellyBeansQuantity: string;
    jellyBeansCheckBy: number;

    listOfMedicalQuantity: string;
    listOfMedicalCheckBy: number;

    medicalEmergencyQuantity: string;
    medicalEmergencyCheckBy: number;

    nonAdhesiveDressingsQuantity: string;
    nonAdhesiveDressingsCheckBy: number;

    resuscitationMarkQuantity: string;
    resuscitationMarkCheckBy: number;

    safetyPinsAssortedQuantity: string;
    safetyPinsAssortedCheckBy: number;

    sodChlorideQuantity: string;
    sodChlorideCheckBy: number;

    accidentBookPenQuantity: string;
    accidentBookPenCheckBy: number;

    tapeScissorsQuantity: string;
    tapeScissorsCheckBy: number;

    telephoneQuantity: string;
    telephoneCheckBy: number;

    triangularBandageQuantity: string;
    triangularBandageCheckBy: number;

    woundClousreStripsQuantity: string;
    woundClousreStripsCheckBy: number;

    guzeSwabsQuantity: string;
    guzeSwabsCheckBy: number;

    plainScissorsQuantity: string;
    plainScissorsCheckBy: number;

    crepeBandageSmallQuantity: string;
    crepeBandageSmallCheckBy: number;

    crepeBandageLargeQuantity: string;
    crepeBandageLargeCheckBy: number;

    veseline50gQuantity: string;
    veseline50gCheckBy: number;

    microporeTapeQuantity: string;
    microporeTapeCheckBy: number;

    defribulatorQuantity: string;
    defribulatorCheckBy: number;

    scissorsQuantity: string;
    scissorsCheckBy: number;

    tissuesQuantity: string;
    tissuesCheckBy: number;

    resuscitationFlashQuantity: string;
    resuscitationFlashCheckBy: number;

    shaverQuantity: string;
    shaverCheckBy: number;

    cleansingWipesQuantity: string;
    cleansingWipesCheckBy: number;

    heatRetainingWrapQuantity: string;
    heatRetainingWrapCheckBy: number;

    nitrileGlovasQuantity: string;
    nitrileGlovasCheckBy: number;

    sterileAdhesiveDressingsQuantity: string;
    sterileAdhesiveDressingsCheckBy: number;

    washproofPlastersQuantity: string;
    washproofPlastersCheckBy: number;

    bluePlastersQuantity: string;
    bluePlastersCheckBy: number;

    burngelQuantity: string;
    burngelCheckBy: number;

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
