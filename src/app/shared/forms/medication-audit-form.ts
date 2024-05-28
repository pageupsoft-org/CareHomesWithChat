import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserType } from "../enums/user-type.enum";
import { MedicationAudit } from "../models/medication-audit";

export class MedicationAuditForm extends FormGroup {
    public id: number;
    public patientId: FormControl;
    public auditedBy: FormControl;
    public auditDate: FormControl;
    public medicationAdministrationRecord: FormControl;
    public treatmentAttached: FormControl;
    public startAndEndDate: FormControl;
    public handwrittenMedicines: FormControl;
    public medicationAdministeredSigned: FormControl;
    public signedOnBack: FormControl;
    public administeredReason: FormControl;
    public dailyCounting: FormControl;
    public nightCounting: FormControl;
    public medicationReceivedDocument: FormControl;
    public medicationsDisposed: FormControl;

    // individual medications

    public expiryDateForPrompts: FormControl;
    public openAndEndDate: FormControl;
    public medicationsStored: FormControl;

    public signoffBy: FormControl;
    public isSignedOff: boolean;

    public locationId: FormControl;
    public careHomeId: FormControl;

    public createdBy: FormControl;
    public createdAt: Date;
    public updatedBy: FormControl;
    public updatedAt: Date;

    public currentUserRole: number = Number((localStorage.getItem('_identity')) ? JSON.parse(localStorage.getItem('_identity')).role : '');
    public currentUserId: number = Number((localStorage.getItem('_identity')) ? JSON.parse(localStorage.getItem('_identity')).id : '');


    public model: MedicationAudit;

    /**
   * Creates an instance of MedicationAuditForm.
   *
   * @param {MedicationAudit} [model=null]
   */
    constructor(model: MedicationAudit = null) {
        super({});
        this.model = model || new MedicationAudit();
        this.id = this.model.id;
        this.patientId = new FormControl(this.model.patientId, [Validators.required]);
        this.auditedBy = new FormControl({  value:this.model.auditedBy,disabled:( (this.currentUserRole != UserType.SuperUser && this.currentUserRole != UserType.Admin ))}, [Validators.required]);

        this.medicationAdministrationRecord = new FormControl(this.model.medicationAdministrationRecord);
        this.treatmentAttached = new FormControl(this.model.treatmentAttached);
        this.startAndEndDate = new FormControl(this.model.startAndEndDate);
        this.handwrittenMedicines = new FormControl(this.model.handwrittenMedicines);
        this.medicationAdministeredSigned = new FormControl(this.model.medicationAdministeredSigned);
        this.signedOnBack = new FormControl(this.model.signedOnBack);
        this.administeredReason = new FormControl(this.model.administeredReason);
        this.dailyCounting = new FormControl(this.model.dailyCounting);
        this.nightCounting = new FormControl(this.model.nightCounting);
        this.medicationReceivedDocument = new FormControl(this.model.medicationReceivedDocument);
        this.medicationsDisposed = new FormControl(this.model.medicationsDisposed);
        this.expiryDateForPrompts = new FormControl(this.model.expiryDateForPrompts);
        this.openAndEndDate = new FormControl(this.model.openAndEndDate);
        this.medicationsStored = new FormControl(this.model.medicationsStored);

        // this.signoffBy = new FormControl(this.model.signoffBy);
        this.isSignedOff = this.model.isSignedOff;
        this.locationId = new FormControl(this.model.locationId, [Validators.required]);
        this.careHomeId = new FormControl(this.model.careHomeId, [Validators.required]);
        this.createdBy = new FormControl(this.model.createdBy);
        this.createdAt = this.model.createdAt;
        this.updatedBy = new FormControl(this.model.updatedBy);
        this.updatedAt = this.model.updatedAt;

        // if (this.auditedBy && this.signoffBy && (this.currentUserId == Number(this.auditedBy.value) || this.currentUserId == Number(this.signoffBy.value))) {
            // this.auditDate = new FormControl(this.model.auditDate, [Validators.required]);
            // this.signoffBy = new FormControl(this.model.signoffBy, [Validators.required]);
        //
        // else {
            this.auditDate = new FormControl(this.model.auditDate);
            this.signoffBy = new FormControl(this.model.signoffBy);
        // }

        this.registerControl("patientId", this.patientId);
        this.registerControl("auditedBy", this.auditedBy);
        this.registerControl("auditDate", this.auditDate);
        this.registerControl("medicationAdministrationRecord", this.medicationAdministrationRecord);
        this.registerControl("treatmentAttached", this.treatmentAttached);
        this.registerControl("startAndEndDate", this.startAndEndDate);
        this.registerControl("handwrittenMedicines", this.handwrittenMedicines);
        this.registerControl("medicationAdministeredSigned", this.medicationAdministeredSigned);
        this.registerControl("signedOnBack", this.signedOnBack);
        this.registerControl("administeredReason", this.administeredReason);
        this.registerControl("dailyCounting", this.dailyCounting);
        this.registerControl("nightCounting", this.nightCounting);
        this.registerControl("medicationReceivedDocument", this.medicationReceivedDocument);
        this.registerControl("medicationsDisposed", this.medicationsDisposed);
        this.registerControl("expiryDateForPrompts", this.expiryDateForPrompts);
        this.registerControl("openAndEndDate", this.openAndEndDate);
        this.registerControl("medicationsStored", this.medicationsStored);
        this.registerControl("signoffBy", this.signoffBy);
        this.registerControl("locationId", this.locationId);
        this.registerControl("careHomeId", this.careHomeId);
        this.registerControl("createdBy", this.createdBy);
        this.registerControl("updatedBy", this.updatedBy);

        this.initialize(this.model);
    }

    public initialize(model: MedicationAudit) {
        this.patientId.setValue(model.patientId);
        this.auditedBy.setValue(model.auditedBy);
        this.auditDate.setValue(model.auditDate);
        this.medicationAdministrationRecord.setValue(model.medicationAdministrationRecord);
        this.treatmentAttached.setValue(model.treatmentAttached);
        this.startAndEndDate.setValue(model.startAndEndDate);
        this.handwrittenMedicines.setValue(model.handwrittenMedicines);
        this.medicationAdministeredSigned.setValue(model.medicationAdministeredSigned);
        this.signedOnBack.setValue(model.signedOnBack);
        this.administeredReason.setValue(model.administeredReason);
        this.dailyCounting.setValue(model.dailyCounting);
        this.nightCounting.setValue(model.nightCounting);
        this.medicationReceivedDocument.setValue(model.medicationReceivedDocument);
        this.medicationsDisposed.setValue(model.medicationsDisposed);
        this.expiryDateForPrompts.setValue(model.expiryDateForPrompts);
        this.openAndEndDate.setValue(model.openAndEndDate);
        this.medicationsStored.setValue(model.medicationsStored);
        this.signoffBy.setValue(model.signoffBy);
        this.locationId.setValue(model.locationId);
        this.careHomeId.setValue(model.careHomeId);
        this.createdBy.setValue(model.createdBy);
        this.updatedBy.setValue(model.updatedBy);
    }

    /**
   * converts form values to {Patient} instance
   *
   * @returns {MedicationAudit}
   */
    public save(): MedicationAudit {
        this.model.id = this.id;
        this.model.patientId = this.patientId.value;
        this.model.auditedBy = this.auditedBy.value;
        this.model.auditDate = this.auditDate.value;
        this.model.medicationAdministrationRecord = this.medicationAdministrationRecord.value;
        this.model.treatmentAttached = this.treatmentAttached.value;
        this.model.startAndEndDate = this.startAndEndDate.value;
        this.model.handwrittenMedicines = this.handwrittenMedicines.value;
        this.model.medicationAdministeredSigned = this.medicationAdministeredSigned.value;
        this.model.signedOnBack = this.signedOnBack.value;
        this.model.administeredReason = this.administeredReason.value;
        this.model.dailyCounting = this.dailyCounting.value;
        this.model.nightCounting = this.nightCounting.value;
        this.model.medicationReceivedDocument = this.medicationReceivedDocument.value;
        this.model.medicationsDisposed = this.medicationsDisposed.value;
        this.model.expiryDateForPrompts = this.expiryDateForPrompts.value;
        this.model.openAndEndDate = this.openAndEndDate.value;
        this.model.medicationsStored = this.medicationsStored.value;
        this.model.signoffBy = this.signoffBy.value;
        this.model.isSignedOff = this.isSignedOff;
        this.model.locationId = this.locationId.value;
        this.model.careHomeId = this.careHomeId.value;

        this.model.createdBy = this.createdBy.value;
        this.model.createdAt = this.createdAt;
        this.model.updatedBy = this.updatedBy.value;
        this.model.updatedAt = this.updatedAt;

        return this.model;
    }

}