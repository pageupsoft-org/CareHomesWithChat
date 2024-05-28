import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PatientAlert } from "../models/patient-alert";


export class PatientAlertForm extends FormGroup {
    public id: number;
    public patientId: FormControl;
    public locationAlertId: FormControl;
    public startDate: FormControl;
    public endDate: FormControl;
    public locationId: FormControl;
    public careHomeId: FormControl;
    // public status: FormControl;
    public createdBy: FormControl;
    public createdAt: FormControl;
    public updatedBy: FormControl;
    public updatedAt: FormControl;


    public model: PatientAlert;

    /**
   * Creates an instance of PatientAlert.
   *
   * @param {PatientAlert} [model=null]
   */
    constructor(model: PatientAlert = null) {
        super({});
        this.model = model || new PatientAlert();
        this.id = this.model.id;
        this.patientId = new FormControl({ value: this.model.patientId }, Validators.required);
        this.locationAlertId = new FormControl({ value: this.model.locationAlertId }, Validators.required);
        this.startDate = new FormControl({ value: this.model.startDate }, Validators.required);
        this.registerControl("name", this.patientId);
        this.registerControl("locationId", this.locationId);
        this.registerControl("careHomeId", this.careHomeId);
        this.initialize(this.model);
    }

    public initialize(model: PatientAlert) {
        this.patientId.setValue(model.patientId);
        this.locationId.setValue(model.locationId);
        this.careHomeId.setValue(model.careHomeId);
    }

    /**
   * converts form values to {Patient} instance
   *
   * @returns {PatientAlert}
   */
    public save(): PatientAlert {
        this.model.id = this.id;
        this.model.patientId = this.patientId.value;
        this.model.locationId = (this.locationId.value);
        this.model.careHomeId = (this.careHomeId.value);
        return this.model;
    }
}