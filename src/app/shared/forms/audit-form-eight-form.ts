import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserType } from "../enums/user-type.enum";
import { AuditFormEight } from "../models/audit-form-eight";

export class AuditFormEightForm extends FormGroup {
    public id: number;
    public auditedBy: FormControl;
    public auditDate: FormControl;

    public blanketAccidentQuantity :FormControl;

    public blanketAccidentCheckBy :FormControl;
    public cottonBallsQuantity :FormControl;

    public cottonBallsCheckBy :FormControl;
    public disposableGlovesQuantity :FormControl;

    public disposableGlovesCheckBy :FormControl;
    public bottleHardPlasticQuantity :FormControl;

    public bottleHardPlasticCheckBy :FormControl;
    public crepeBandageQuantity :FormControl;

    public crepeBandageCheckBy :FormControl;
    public eyePadSterileQuantity :FormControl;

    public eyePadSterileCheckBy :FormControl;
    public freezerBagsQuantity :FormControl;

    public freezerBagsCheckBy :FormControl;
    public instantColdPackQuantity :FormControl;

    public instantColdPackCheckBy :FormControl;
    public jellyBeansQuantity :FormControl;

    public jellyBeansCheckBy :FormControl;
    public listOfMedicalQuantity :FormControl;

    public listOfMedicalCheckBy :FormControl;
    public medicalEmergencyQuantity :FormControl;

    public medicalEmergencyCheckBy :FormControl;
    public nonAdhesiveDressingsQuantity :FormControl;

    public nonAdhesiveDressingsCheckBy :FormControl;
    public resuscitationMarkQuantity :FormControl;

    public resuscitationMarkCheckBy :FormControl;
    public safetyPinsAssortedQuantity :FormControl;

    public safetyPinsAssortedCheckBy :FormControl;
    public sodChlorideQuantity :FormControl;

    public sodChlorideCheckBy :FormControl;
    public accidentBookPenQuantity :FormControl;

    public accidentBookPenCheckBy :FormControl;
    public tapeScissorsQuantity :FormControl;

    public tapeScissorsCheckBy :FormControl;
    public telephoneQuantity :FormControl;

    public telephoneCheckBy :FormControl;
    public triangularBandageQuantity :FormControl;

    public triangularBandageCheckBy :FormControl;
    public woundClousreStripsQuantity :FormControl;

    public woundClousreStripsCheckBy :FormControl;
    public guzeSwabsQuantity :FormControl;

    public guzeSwabsCheckBy :FormControl;
    public plainScissorsQuantity :FormControl;

    public plainScissorsCheckBy :FormControl;
    public crepeBandageSmallQuantity :FormControl;

    public crepeBandageSmallCheckBy :FormControl;
    public crepeBandageLargeQuantity :FormControl;

    public crepeBandageLargeCheckBy :FormControl;
    public veseline50gQuantity :FormControl;

    public veseline50gCheckBy :FormControl;
    public microporeTapeQuantity :FormControl;

    public microporeTapeCheckBy :FormControl;
    public defribulatorQuantity :FormControl;

    public defribulatorCheckBy :FormControl;
    public scissorsQuantity :FormControl;

    public scissorsCheckBy :FormControl;
    public tissuesQuantity :FormControl;

    public tissuesCheckBy :FormControl;
    public resuscitationFlashQuantity :FormControl;

    public resuscitationFlashCheckBy :FormControl;
    public shaverQuantity :FormControl;

    public shaverCheckBy :FormControl;
    public cleansingWipesQuantity :FormControl;

    public cleansingWipesCheckBy :FormControl;
    public heatRetainingWrapQuantity :FormControl;

    public heatRetainingWrapCheckBy :FormControl;
    public nitrileGlovasQuantity :FormControl;

    public nitrileGlovasCheckBy :FormControl;
    public sterileAdhesiveDressingsQuantity :FormControl;

    public sterileAdhesiveDressingsCheckBy :FormControl;
    public washproofPlastersQuantity :FormControl;

    public washproofPlastersCheckBy :FormControl;
    public bluePlastersQuantity :FormControl;

    public bluePlastersCheckBy :FormControl;
    public burngelQuantity :FormControl;

    public burngelCheckBy :FormControl;

    public signoffBy: FormControl;
    public isSignedOff: boolean;

    public locationId: FormControl;
    public careHomeId: FormControl;

    public createdBy: FormControl;
    public createdAt: FormControl;
    public updatedBy: FormControl;
    public updatedAt: FormControl;
    public auditor: FormControl;

    public currentUserRole: number = Number((localStorage.getItem('_identity')) ? JSON.parse(localStorage.getItem('_identity')).role : '');
    public currentUserId: number = Number((localStorage.getItem('_identity')) ? JSON.parse(localStorage.getItem('_identity')).id : '');


    public model: AuditFormEight;

    /**
   * Creates an instance of AuditFormEightForm.
   *
   * @param {AuditFormEight} [model=null]
   */
    constructor(model: AuditFormEight = null) {
        super({});
        this.model = model || new AuditFormEight();
        this.id = this.model.id;
        this.auditedBy = new FormControl({ value: this.model.auditedBy, disabled: ((this.currentUserRole != UserType.SuperUser && this.currentUserRole != UserType.Admin)) }, [Validators.required]);

        this.blanketAccidentQuantity = new FormControl(this.model.blanketAccidentQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.blanketAccidentCheckBy = new FormControl(this.model.blanketAccidentCheckBy, [Validators.required]);
        this.cottonBallsQuantity = new FormControl(this.model.cottonBallsQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.cottonBallsCheckBy = new FormControl(this.model.cottonBallsCheckBy, [Validators.required]);
        this.disposableGlovesQuantity = new FormControl(this.model.disposableGlovesQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.disposableGlovesCheckBy = new FormControl(this.model.disposableGlovesCheckBy, [Validators.required]);
        this.bottleHardPlasticQuantity = new FormControl(this.model.bottleHardPlasticQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.bottleHardPlasticCheckBy = new FormControl(this.model.bottleHardPlasticCheckBy, [Validators.required]);
        this.crepeBandageQuantity = new FormControl(this.model.crepeBandageQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.crepeBandageCheckBy = new FormControl(this.model.crepeBandageCheckBy, [Validators.required]);
        this.eyePadSterileQuantity = new FormControl(this.model.eyePadSterileQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.eyePadSterileCheckBy = new FormControl(this.model.eyePadSterileCheckBy, [Validators.required]);
        this.freezerBagsQuantity = new FormControl(this.model.freezerBagsQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.freezerBagsCheckBy = new FormControl(this.model.freezerBagsCheckBy, [Validators.required]);
        this.instantColdPackQuantity = new FormControl(this.model.instantColdPackQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.instantColdPackCheckBy = new FormControl(this.model.instantColdPackCheckBy, [Validators.required]);
        this.jellyBeansQuantity = new FormControl(this.model.jellyBeansQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.jellyBeansCheckBy = new FormControl(this.model.jellyBeansCheckBy, [Validators.required]);
        this.listOfMedicalQuantity = new FormControl(this.model.listOfMedicalQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.listOfMedicalCheckBy = new FormControl(this.model.listOfMedicalCheckBy, [Validators.required]);
        this.medicalEmergencyQuantity = new FormControl(this.model.medicalEmergencyQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.medicalEmergencyCheckBy = new FormControl(this.model.medicalEmergencyCheckBy, [Validators.required]);
        this.nonAdhesiveDressingsQuantity = new FormControl(this.model.nonAdhesiveDressingsQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.nonAdhesiveDressingsCheckBy = new FormControl(this.model.nonAdhesiveDressingsCheckBy, [Validators.required]);
        this.resuscitationMarkQuantity = new FormControl(this.model.resuscitationMarkQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.resuscitationMarkCheckBy = new FormControl(this.model.resuscitationMarkCheckBy, [Validators.required]);
        this.safetyPinsAssortedQuantity = new FormControl(this.model.safetyPinsAssortedQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.safetyPinsAssortedCheckBy = new FormControl(this.model.safetyPinsAssortedCheckBy, [Validators.required]);
        this.sodChlorideQuantity = new FormControl(this.model.sodChlorideQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.sodChlorideCheckBy = new FormControl(this.model.sodChlorideCheckBy, [Validators.required]);
        this.accidentBookPenQuantity = new FormControl(this.model.accidentBookPenQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.accidentBookPenCheckBy = new FormControl(this.model.accidentBookPenCheckBy, [Validators.required]);
        this.tapeScissorsQuantity = new FormControl(this.model.tapeScissorsQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.tapeScissorsCheckBy = new FormControl(this.model.tapeScissorsCheckBy, [Validators.required]);
        this.telephoneQuantity = new FormControl(this.model.telephoneQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.telephoneCheckBy = new FormControl(this.model.telephoneCheckBy, [Validators.required]);
        this.triangularBandageQuantity = new FormControl(this.model.triangularBandageQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.triangularBandageCheckBy = new FormControl(this.model.triangularBandageCheckBy, [Validators.required]);
        this.woundClousreStripsQuantity = new FormControl(this.model.woundClousreStripsQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.woundClousreStripsCheckBy = new FormControl(this.model.woundClousreStripsCheckBy, [Validators.required]);
        this.guzeSwabsQuantity = new FormControl(this.model.guzeSwabsQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.guzeSwabsCheckBy = new FormControl(this.model.guzeSwabsCheckBy, [Validators.required]);
        this.plainScissorsQuantity = new FormControl(this.model.plainScissorsQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.plainScissorsCheckBy = new FormControl(this.model.plainScissorsCheckBy, [Validators.required]);
        this.crepeBandageSmallQuantity = new FormControl(this.model.crepeBandageSmallQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.crepeBandageSmallCheckBy = new FormControl(this.model.crepeBandageSmallCheckBy, [Validators.required]);
        this.crepeBandageLargeQuantity = new FormControl(this.model.crepeBandageLargeQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.crepeBandageLargeCheckBy = new FormControl(this.model.crepeBandageLargeCheckBy, [Validators.required]);
        this.veseline50gQuantity = new FormControl(this.model.veseline50gQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.veseline50gCheckBy = new FormControl(this.model.veseline50gCheckBy, [Validators.required]);
        this.microporeTapeQuantity = new FormControl(this.model.microporeTapeQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.microporeTapeCheckBy = new FormControl(this.model.microporeTapeCheckBy, [Validators.required]);
        this.defribulatorQuantity = new FormControl(this.model.defribulatorQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.defribulatorCheckBy = new FormControl(this.model.defribulatorCheckBy, [Validators.required]);
        this.scissorsQuantity = new FormControl(this.model.scissorsQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.scissorsCheckBy = new FormControl(this.model.scissorsCheckBy, [Validators.required]);
        this.tissuesQuantity = new FormControl(this.model.tissuesQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.tissuesCheckBy = new FormControl(this.model.tissuesCheckBy, [Validators.required]);
        this.resuscitationFlashQuantity = new FormControl(this.model.resuscitationFlashQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.resuscitationFlashCheckBy = new FormControl(this.model.resuscitationFlashCheckBy, [Validators.required]);
        this.shaverQuantity = new FormControl(this.model.shaverQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.shaverCheckBy = new FormControl(this.model.shaverCheckBy, [Validators.required]);
        this.cleansingWipesQuantity = new FormControl(this.model.cleansingWipesQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.cleansingWipesCheckBy = new FormControl(this.model.cleansingWipesCheckBy, [Validators.required]);
        this.heatRetainingWrapQuantity = new FormControl(this.model.heatRetainingWrapQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.heatRetainingWrapCheckBy = new FormControl(this.model.heatRetainingWrapCheckBy, [Validators.required]);
        this.nitrileGlovasQuantity = new FormControl(this.model.nitrileGlovasQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.nitrileGlovasCheckBy = new FormControl(this.model.nitrileGlovasCheckBy, [Validators.required]);
        this.sterileAdhesiveDressingsQuantity = new FormControl(this.model.sterileAdhesiveDressingsQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.sterileAdhesiveDressingsCheckBy = new FormControl(this.model.sterileAdhesiveDressingsCheckBy, [Validators.required]);
        this.washproofPlastersQuantity = new FormControl(this.model.washproofPlastersQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.washproofPlastersCheckBy = new FormControl(this.model.washproofPlastersCheckBy, [Validators.required]);
        this.bluePlastersQuantity = new FormControl(this.model.bluePlastersQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.bluePlastersCheckBy = new FormControl(this.model.bluePlastersCheckBy, [Validators.required]);
        this.burngelQuantity = new FormControl(this.model.burngelQuantity, [Validators.required,Validators.min(0),Validators.pattern("^[0-9]{0-4}$")]);
        this.burngelCheckBy = new FormControl(this.model.burngelCheckBy, [Validators.required]);
        // this.auditor = new FormControl(this.model.auditor, [Validators.required]);


        this.isSignedOff = this.model.isSignedOff;
        this.locationId = new FormControl(this.model.locationId, [Validators.required]);
        this.careHomeId = new FormControl(this.model.careHomeId, [Validators.required]);
        this.createdBy = new FormControl(this.model.createdBy);
        this.createdAt =  new FormControl(this.model.createdAt);
        this.updatedBy = new FormControl(this.model.updatedBy);
        this.updatedAt =  new FormControl(this.model.updatedAt);

        this.auditDate = new FormControl(this.model.auditDate);
        this.signoffBy = new FormControl(this.model.signoffBy);


        this.registerControl("auditedBy", this.auditedBy);
        this.registerControl("auditDate", this.auditDate);
        this.registerControl("blanketAccidentQuantity", this.blanketAccidentQuantity);
        this.registerControl("blanketAccidentCheckBy", this.blanketAccidentCheckBy);
        this.registerControl("cottonBallsQuantity", this.cottonBallsQuantity);
        this.registerControl("cottonBallsCheckBy", this.cottonBallsCheckBy);
        this.registerControl("disposableGlovesQuantity", this.disposableGlovesQuantity);
        this.registerControl("disposableGlovesCheckBy", this.disposableGlovesCheckBy);
        this.registerControl("bottleHardPlasticQuantity", this.bottleHardPlasticQuantity);
        this.registerControl("bottleHardPlasticCheckBy", this.bottleHardPlasticCheckBy);
        this.registerControl("crepeBandageQuantity", this.crepeBandageQuantity);
        this.registerControl("crepeBandageCheckBy", this.crepeBandageCheckBy);
        this.registerControl("eyePadSterileQuantity", this.eyePadSterileQuantity);
        this.registerControl("eyePadSterileCheckBy", this.eyePadSterileCheckBy);
        this.registerControl("freezerBagsQuantity", this.freezerBagsQuantity);
        this.registerControl("freezerBagsCheckBy", this.freezerBagsCheckBy);
        this.registerControl("instantColdPackQuantity", this.instantColdPackQuantity);
        this.registerControl("instantColdPackCheckBy", this.instantColdPackCheckBy);
        this.registerControl("jellyBeansQuantity", this.jellyBeansQuantity);
        this.registerControl("jellyBeansCheckBy", this.jellyBeansCheckBy);
        this.registerControl("listOfMedicalQuantity", this.listOfMedicalQuantity);
        this.registerControl("listOfMedicalCheckBy", this.listOfMedicalCheckBy);
        this.registerControl("medicalEmergencyQuantity", this.medicalEmergencyQuantity);
        this.registerControl("medicalEmergencyCheckBy", this.medicalEmergencyCheckBy);
        this.registerControl("nonAdhesiveDressingsQuantity", this.nonAdhesiveDressingsQuantity);
        this.registerControl("nonAdhesiveDressingsCheckBy", this.nonAdhesiveDressingsCheckBy);
        this.registerControl("resuscitationMarkQuantity", this.resuscitationMarkQuantity);
        this.registerControl("resuscitationMarkCheckBy", this.resuscitationMarkCheckBy);
        this.registerControl("safetyPinsAssortedQuantity", this.safetyPinsAssortedQuantity);
        this.registerControl("safetyPinsAssortedCheckBy", this.safetyPinsAssortedCheckBy);
        this.registerControl("sodChlorideQuantity", this.sodChlorideQuantity);
        this.registerControl("sodChlorideCheckBy", this.sodChlorideCheckBy);
        this.registerControl("accidentBookPenQuantity", this.accidentBookPenQuantity);
        this.registerControl("accidentBookPenCheckBy", this.accidentBookPenCheckBy);
        this.registerControl("tapeScissorsQuantity", this.tapeScissorsQuantity);
        this.registerControl("tapeScissorsCheckBy", this.tapeScissorsCheckBy);
        this.registerControl("telephoneQuantity", this.telephoneQuantity);
        this.registerControl("telephoneCheckBy", this.telephoneCheckBy);
        this.registerControl("triangularBandageQuantity", this.triangularBandageQuantity);
        this.registerControl("triangularBandageCheckBy", this.triangularBandageCheckBy);
        this.registerControl("woundClousreStripsQuantity", this.woundClousreStripsQuantity);
        this.registerControl("woundClousreStripsCheckBy", this.woundClousreStripsCheckBy);
        this.registerControl("guzeSwabsQuantity", this.guzeSwabsQuantity);
        this.registerControl("guzeSwabsCheckBy", this.guzeSwabsCheckBy);
        this.registerControl("plainScissorsQuantity", this.plainScissorsQuantity);
        this.registerControl("plainScissorsCheckBy", this.plainScissorsCheckBy);
        this.registerControl("crepeBandageSmallQuantity", this.crepeBandageSmallQuantity);
        this.registerControl("crepeBandageSmallCheckBy", this.crepeBandageSmallCheckBy);
        this.registerControl("crepeBandageLargeQuantity", this.crepeBandageLargeQuantity);
        this.registerControl("crepeBandageLargeCheckBy", this.crepeBandageLargeCheckBy);
        this.registerControl("veseline50gQuantity", this.veseline50gQuantity);
        this.registerControl("veseline50gCheckBy", this.veseline50gCheckBy);
        this.registerControl("microporeTapeQuantity", this.microporeTapeQuantity);
        this.registerControl("microporeTapeCheckBy", this.microporeTapeCheckBy);
        this.registerControl("defribulatorQuantity", this.defribulatorQuantity);
        this.registerControl("defribulatorCheckBy", this.defribulatorCheckBy);
        this.registerControl("scissorsQuantity", this.scissorsQuantity);
        this.registerControl("scissorsCheckBy", this.scissorsCheckBy);
        this.registerControl("tissuesQuantity", this.tissuesQuantity);
        this.registerControl("tissuesCheckBy", this.tissuesCheckBy);
        this.registerControl("resuscitationFlashQuantity", this.resuscitationFlashQuantity);
        this.registerControl("resuscitationFlashCheckBy", this.resuscitationFlashCheckBy);
        this.registerControl("shaverQuantity", this.shaverQuantity);
        this.registerControl("shaverCheckBy", this.shaverCheckBy);
        this.registerControl("cleansingWipesQuantity", this.cleansingWipesQuantity);
        this.registerControl("cleansingWipesCheckBy", this.cleansingWipesCheckBy);
        this.registerControl("heatRetainingWrapQuantity", this.heatRetainingWrapQuantity);
        this.registerControl("heatRetainingWrapCheckBy", this.heatRetainingWrapCheckBy);
        this.registerControl("nitrileGlovasQuantity", this.nitrileGlovasQuantity);
        this.registerControl("nitrileGlovasCheckBy", this.nitrileGlovasCheckBy);
        this.registerControl("sterileAdhesiveDressingsQuantity", this.sterileAdhesiveDressingsQuantity);
        this.registerControl("sterileAdhesiveDressingsCheckBy", this.sterileAdhesiveDressingsCheckBy);
        this.registerControl("washproofPlastersQuantity", this.washproofPlastersQuantity);
        this.registerControl("washproofPlastersCheckBy", this.washproofPlastersCheckBy);
        this.registerControl("bluePlastersQuantity", this.bluePlastersQuantity);
        this.registerControl("bluePlastersCheckBy", this.bluePlastersCheckBy);
        this.registerControl("burngelQuantity", this.burngelQuantity);
        this.registerControl("burngelCheckBy", this.burngelCheckBy);
        this.registerControl("signoffBy", this.signoffBy);
        this.registerControl("locationId", this.locationId);
        this.registerControl("careHomeId", this.careHomeId);
        this.registerControl("createdBy", this.createdBy);
        this.registerControl("createdAt", this.createdAt);
        this.registerControl("updatedBy", this.updatedBy);
        this.registerControl("updatedAt", this.updatedAt);

        this.initialize(this.model);
    }

    public initialize(model: AuditFormEight) {
        this.auditedBy.setValue(model.auditedBy);
        this.auditDate.setValue(model.auditDate);
        this.blanketAccidentQuantity.setValue(model.blanketAccidentQuantity);
        this.blanketAccidentCheckBy.setValue(model.blanketAccidentCheckBy);
        this.cottonBallsQuantity.setValue(model.cottonBallsQuantity);
        this.cottonBallsCheckBy.setValue(model.cottonBallsCheckBy);
        this.disposableGlovesQuantity.setValue(model.disposableGlovesQuantity);
        this.disposableGlovesCheckBy.setValue(model.disposableGlovesCheckBy);
        this.bottleHardPlasticQuantity.setValue(model.bottleHardPlasticQuantity);
        this.bottleHardPlasticCheckBy.setValue(model.bottleHardPlasticCheckBy);
        this.crepeBandageQuantity.setValue(model.crepeBandageQuantity);
        this.crepeBandageCheckBy.setValue(model.crepeBandageCheckBy);
        this.eyePadSterileQuantity.setValue(model.eyePadSterileQuantity);
        this.eyePadSterileCheckBy.setValue(model.eyePadSterileCheckBy);
        this.freezerBagsQuantity.setValue(model.freezerBagsQuantity);
        this.freezerBagsCheckBy.setValue(model.freezerBagsCheckBy);
        this.instantColdPackQuantity.setValue(model.instantColdPackQuantity);
        this.instantColdPackCheckBy.setValue(model.instantColdPackCheckBy);
        this.jellyBeansQuantity.setValue(model.jellyBeansQuantity);
        this.jellyBeansCheckBy.setValue(model.jellyBeansCheckBy);
        this.listOfMedicalQuantity.setValue(model.listOfMedicalQuantity);
        this.listOfMedicalCheckBy.setValue(model.listOfMedicalCheckBy);
        this.medicalEmergencyQuantity.setValue(model.medicalEmergencyQuantity);
        this.medicalEmergencyCheckBy.setValue(model.medicalEmergencyCheckBy);
        this.nonAdhesiveDressingsQuantity.setValue(model.nonAdhesiveDressingsQuantity);
        this.nonAdhesiveDressingsCheckBy.setValue(model.nonAdhesiveDressingsCheckBy);
        this.resuscitationMarkQuantity.setValue(model.resuscitationMarkQuantity);
        this.resuscitationMarkCheckBy.setValue(model.resuscitationMarkCheckBy);
        this.safetyPinsAssortedQuantity.setValue(model.safetyPinsAssortedQuantity);
        this.safetyPinsAssortedCheckBy.setValue(model.safetyPinsAssortedCheckBy);
        this.sodChlorideQuantity.setValue(model.sodChlorideQuantity);
        this.sodChlorideCheckBy.setValue(model.sodChlorideCheckBy);
        this.accidentBookPenQuantity.setValue(model.accidentBookPenQuantity);
        this.accidentBookPenCheckBy.setValue(model.accidentBookPenCheckBy);
        this.tapeScissorsQuantity.setValue(model.tapeScissorsQuantity);
        this.tapeScissorsCheckBy.setValue(model.tapeScissorsCheckBy);
        this.telephoneQuantity.setValue(model.telephoneQuantity);
        this.telephoneCheckBy.setValue(model.telephoneCheckBy);
        this.triangularBandageQuantity.setValue(model.triangularBandageQuantity);
        this.triangularBandageCheckBy.setValue(model.triangularBandageCheckBy);
        this.woundClousreStripsQuantity.setValue(model.woundClousreStripsQuantity);
        this.woundClousreStripsCheckBy.setValue(model.woundClousreStripsCheckBy);
        this.guzeSwabsQuantity.setValue(model.guzeSwabsQuantity);
        this.guzeSwabsCheckBy.setValue(model.guzeSwabsCheckBy);
        this.plainScissorsQuantity.setValue(model.plainScissorsQuantity);
        this.plainScissorsCheckBy.setValue(model.plainScissorsCheckBy);
        this.crepeBandageSmallQuantity.setValue(model.crepeBandageSmallQuantity);
        this.crepeBandageSmallCheckBy.setValue(model.crepeBandageSmallCheckBy);
        this.crepeBandageLargeQuantity.setValue(model.crepeBandageLargeQuantity);
        this.crepeBandageLargeCheckBy.setValue(model.crepeBandageLargeCheckBy);
        this.veseline50gQuantity.setValue(model.veseline50gQuantity);
        this.veseline50gCheckBy.setValue(model.veseline50gCheckBy);
        this.microporeTapeQuantity.setValue(model.microporeTapeQuantity);
        this.microporeTapeCheckBy.setValue(model.microporeTapeCheckBy);
        this.defribulatorQuantity.setValue(model.defribulatorQuantity);
        this.defribulatorCheckBy.setValue(model.defribulatorCheckBy);
        this.scissorsQuantity.setValue(model.scissorsQuantity);
        this.scissorsCheckBy.setValue(model.scissorsCheckBy);
        this.tissuesQuantity.setValue(model.tissuesQuantity);
        this.tissuesCheckBy.setValue(model.tissuesCheckBy);
        this.resuscitationFlashQuantity.setValue(model.resuscitationFlashQuantity);
        this.resuscitationFlashCheckBy.setValue(model.resuscitationFlashCheckBy);
        this.shaverQuantity.setValue(model.shaverQuantity);
        this.shaverCheckBy.setValue(model.shaverCheckBy);
        this.cleansingWipesQuantity.setValue(model.cleansingWipesQuantity);
        this.cleansingWipesCheckBy.setValue(model.cleansingWipesCheckBy);
        this.heatRetainingWrapQuantity.setValue(model.heatRetainingWrapQuantity);
        this.heatRetainingWrapCheckBy.setValue(model.heatRetainingWrapCheckBy);
        this.nitrileGlovasQuantity.setValue(model.nitrileGlovasQuantity);
        this.nitrileGlovasCheckBy.setValue(model.nitrileGlovasCheckBy);
        this.sterileAdhesiveDressingsQuantity.setValue(model.sterileAdhesiveDressingsQuantity);
        this.sterileAdhesiveDressingsCheckBy.setValue(model.sterileAdhesiveDressingsCheckBy);
        this.washproofPlastersQuantity.setValue(model.washproofPlastersQuantity);
        this.washproofPlastersCheckBy.setValue(model.washproofPlastersCheckBy);
        this.bluePlastersQuantity.setValue(model.bluePlastersQuantity);
        this.bluePlastersCheckBy.setValue(model.bluePlastersCheckBy);
        this.burngelQuantity.setValue(model.burngelQuantity);
        this.burngelCheckBy.setValue(model.burngelCheckBy);
        this.signoffBy.setValue(model.signoffBy);
        this.locationId.setValue(model.locationId);
        this.careHomeId.setValue(model.careHomeId);
        this.createdBy.setValue(model.createdBy);
        this.createdAt.setValue(model.createdAt);
        this.updatedBy.setValue(model.updatedBy);
        this.updatedAt.setValue(model.updatedAt);
    }

    /**
   * converts form values to {Patient} instance
   *
   * @returns {AuditFormEight}
   */
    public save(): AuditFormEight {
        this.model.id = this.id;
        this.model.auditedBy = this.auditedBy.value;
        this.model.auditDate = this.auditDate.value;
        this.model.blanketAccidentQuantity = this.blanketAccidentQuantity.value;
        this.model.blanketAccidentCheckBy = this.blanketAccidentCheckBy.value;
        this.model.cottonBallsQuantity = this.cottonBallsQuantity.value;
        this.model.cottonBallsCheckBy = this.cottonBallsCheckBy.value;
        this.model.disposableGlovesQuantity = this.disposableGlovesQuantity.value;
        this.model.disposableGlovesCheckBy = this.disposableGlovesCheckBy.value;
        this.model.bottleHardPlasticQuantity = this.bottleHardPlasticQuantity.value;
        this.model.bottleHardPlasticCheckBy = this.bottleHardPlasticCheckBy.value;
        this.model.crepeBandageQuantity = this.crepeBandageQuantity.value;
        this.model.crepeBandageCheckBy = this.crepeBandageCheckBy.value;
        this.model.eyePadSterileQuantity = this.eyePadSterileQuantity.value;
        this.model.eyePadSterileCheckBy = this.eyePadSterileCheckBy.value;
        this.model.freezerBagsQuantity = this.freezerBagsQuantity.value;
        this.model.freezerBagsCheckBy = this.freezerBagsCheckBy.value;
        this.model.instantColdPackQuantity = this.instantColdPackQuantity.value;
        this.model.instantColdPackCheckBy = this.instantColdPackCheckBy.value;
        this.model.jellyBeansQuantity = this.jellyBeansQuantity.value;
        this.model.jellyBeansCheckBy = this.jellyBeansCheckBy.value;
        this.model.listOfMedicalQuantity = this.listOfMedicalQuantity.value;
        this.model.listOfMedicalCheckBy = this.listOfMedicalCheckBy.value;
        this.model.medicalEmergencyQuantity = this.medicalEmergencyQuantity.value;
        this.model.medicalEmergencyCheckBy = this.medicalEmergencyCheckBy.value;
        this.model.nonAdhesiveDressingsQuantity = this.nonAdhesiveDressingsQuantity.value;
        this.model.nonAdhesiveDressingsCheckBy = this.nonAdhesiveDressingsCheckBy.value;
        this.model.resuscitationMarkQuantity = this.resuscitationMarkQuantity.value;
        this.model.resuscitationMarkCheckBy = this.resuscitationMarkCheckBy.value;
        this.model.safetyPinsAssortedQuantity = this.safetyPinsAssortedQuantity.value;
        this.model.safetyPinsAssortedCheckBy = this.safetyPinsAssortedCheckBy.value;
        this.model.sodChlorideQuantity = this.sodChlorideQuantity.value;
        this.model.sodChlorideCheckBy = this.sodChlorideCheckBy.value;
        this.model.accidentBookPenQuantity = this.accidentBookPenQuantity.value;
        this.model.accidentBookPenCheckBy = this.accidentBookPenCheckBy.value;
        this.model.tapeScissorsQuantity = this.tapeScissorsQuantity.value;
        this.model.tapeScissorsCheckBy = this.tapeScissorsCheckBy.value;
        this.model.telephoneQuantity = this.telephoneQuantity.value;
        this.model.telephoneCheckBy = this.telephoneCheckBy.value;
        this.model.triangularBandageQuantity = this.triangularBandageQuantity.value;
        this.model.triangularBandageCheckBy = this.triangularBandageCheckBy.value;
        this.model.woundClousreStripsQuantity = this.woundClousreStripsQuantity.value;
        this.model.woundClousreStripsCheckBy = this.woundClousreStripsCheckBy.value;
        this.model.guzeSwabsQuantity = this.guzeSwabsQuantity.value;
        this.model.guzeSwabsCheckBy = this.guzeSwabsCheckBy.value;
        this.model.plainScissorsQuantity = this.plainScissorsQuantity.value;
        this.model.plainScissorsCheckBy = this.plainScissorsCheckBy.value;
        this.model.crepeBandageSmallQuantity = this.crepeBandageSmallQuantity.value;
        this.model.crepeBandageSmallCheckBy = this.crepeBandageSmallCheckBy.value;
        this.model.crepeBandageLargeQuantity = this.crepeBandageLargeQuantity.value;
        this.model.crepeBandageLargeCheckBy = this.crepeBandageLargeCheckBy.value;
        this.model.veseline50gQuantity = this.veseline50gQuantity.value;
        this.model.veseline50gCheckBy = this.veseline50gCheckBy.value;
        this.model.microporeTapeQuantity = this.microporeTapeQuantity.value;
        this.model.microporeTapeCheckBy = this.microporeTapeCheckBy.value;
        this.model.defribulatorQuantity = this.defribulatorQuantity.value;
        this.model.defribulatorCheckBy = this.defribulatorCheckBy.value;
        this.model.scissorsQuantity = this.scissorsQuantity.value;
        this.model.scissorsCheckBy = this.scissorsCheckBy.value;
        this.model.tissuesQuantity = this.tissuesQuantity.value;
        this.model.tissuesCheckBy = this.tissuesCheckBy.value;
        this.model.resuscitationFlashQuantity = this.resuscitationFlashQuantity.value;
        this.model.resuscitationFlashCheckBy = this.resuscitationFlashCheckBy.value;
        this.model.shaverQuantity = this.shaverQuantity.value;
        this.model.shaverCheckBy = this.shaverCheckBy.value;
        this.model.cleansingWipesQuantity = this.cleansingWipesQuantity.value;
        this.model.cleansingWipesCheckBy = this.cleansingWipesCheckBy.value;
        this.model.heatRetainingWrapQuantity = this.heatRetainingWrapQuantity.value;
        this.model.heatRetainingWrapCheckBy = this.heatRetainingWrapCheckBy.value;
        this.model.nitrileGlovasQuantity = this.nitrileGlovasQuantity.value;
        this.model.nitrileGlovasCheckBy = this.nitrileGlovasCheckBy.value;
        this.model.sterileAdhesiveDressingsQuantity = this.sterileAdhesiveDressingsQuantity.value;
        this.model.sterileAdhesiveDressingsCheckBy = this.sterileAdhesiveDressingsCheckBy.value;
        this.model.washproofPlastersQuantity = this.washproofPlastersQuantity.value;
        this.model.washproofPlastersCheckBy = this.washproofPlastersCheckBy.value;
        this.model.bluePlastersQuantity = this.bluePlastersQuantity.value;
        this.model.bluePlastersCheckBy = this.bluePlastersCheckBy.value;
        this.model.burngelQuantity = this.burngelQuantity.value;
        this.model.burngelCheckBy = this.burngelCheckBy.value;

        this.model.signoffBy = this.signoffBy.value;
        this.model.isSignedOff = this.isSignedOff;
        this.model.locationId = this.locationId.value;
        this.model.careHomeId = this.careHomeId.value;

        this.model.createdBy = this.createdBy.value;
        this.model.createdAt = this.createdAt.value;
        this.model.updatedBy = this.updatedBy.value;
        this.model.updatedAt = this.updatedAt.value;
        this.model.auditor = null;

        return this.model;
    }

}