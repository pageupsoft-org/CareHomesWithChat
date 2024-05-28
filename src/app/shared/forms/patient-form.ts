import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Patient } from "../models/patient";

export class PatientForm extends FormGroup {
    public id: number;
    public name: FormControl;
    public dob: FormControl;
    public age: FormControl;
    public careCoordinatorId: number;
    public zoningCategory: FormControl;
    public alert1: FormControl;
    public alert1SD: FormControl;
    public alert1ED: FormControl;
    public alert2: FormControl;
    public alert2SD: FormControl;
    public alert2ED: FormControl;
    public alert3: FormControl;
    public alert3SD: FormControl;
    public alert3ED: FormControl;

    public model: Patient;

    /**
   * Creates an instance of PatientForm.
   *
   * @param {Patient} [model=null]
   */
    constructor(model: Patient) {
        super({});
        this.model = model || new Patient();
        this.id = this.model.id;
        this.name = new FormControl({ value: this.model.name }, Validators.required);
        this.dob = new FormControl({ value: this.model.dob }, Validators.required);
        this.age = new FormControl({ value: this.model.age }, Validators.required);
        this.careCoordinatorId = this.model.careCoordinatorId;
        this.zoningCategory = new FormControl({ value: this.model.zoningCategory }, Validators.required);
        this.alert1 = new FormControl({ value: this.model.alert1 }, Validators.required);
        this.alert1SD = new FormControl({ value: this.model.alert1SD });
        this.alert1ED = new FormControl({ value: this.model.alert1ED }, Validators.required);
        this.alert2 = new FormControl({ value: this.model.alert2 });
        this.alert2SD = new FormControl({ value: this.model.alert2SD });
        this.alert2ED = new FormControl({ value: this.model.alert2ED }, Validators.required);
        this.alert3 = new FormControl({ value: this.model.alert3 }, Validators.required);
        this.alert3SD = new FormControl({ value: this.model.alert3SD }, Validators.required);
        this.alert3ED = new FormControl({ value: this.model.alert3ED }, Validators.required);

        this.registerControl("name", this.name);
        this.registerControl("dob", this.dob);
        this.registerControl("age", this.age);
        this.registerControl("zoningCategory", this.zoningCategory);
        this.registerControl("alert1", this.alert1);
        this.registerControl("alert1SD", this.alert1SD);
        this.registerControl("alert1ED", this.alert1ED);
        this.registerControl("alert2", this.alert2);
        this.registerControl("alert2SD", this.alert2SD);
        this.registerControl("alert2ED", this.alert2ED);
        this.registerControl("alert3", this.alert3);
        this.registerControl("alert3SD", this.alert3SD);
        this.registerControl("alert3ED", this.alert3ED);
    }

    public initialize(model: Patient) {
        this.name.setValue(model.name);
        this.dob.setValue(model.dob);
        this.age.setValue(model.age);
        this.zoningCategory.setValue(model.zoningCategory);
        this.alert1.setValue(model.alert1);
        this.alert1SD.setValue(model.alert1SD);
        this.alert1ED.setValue(model.alert1ED);
        this.alert2.setValue(model.alert2);
        this.alert2SD.setValue(model.alert2SD);
        this.alert2ED.setValue(model.alert2ED);
        this.alert3.setValue(model.alert3);
        this.alert3SD.setValue(model.alert3SD);
        this.alert3ED.setValue(model.alert3ED);
    }

    /**
   * converts form values to {Patient} instance
   *
   * @returns {Patient}
   */
    public save(): Patient {
        this.model.id = this.id;
        this.model.name = this.name.value;
        this.model.dob = this.dob.value;
        this.model.age = this.dob.value;
        this.model.careCoordinatorId = this.careCoordinatorId;
        this.model.zoningCategory = this.zoningCategory.value;
        this.model.alert1 = this.alert1.value;
        this.model.alert1SD = this.alert1SD.value;
        this.model.alert1ED = this.alert1ED.value;
        this.model.alert2 = this.alert2.value;
        this.model.alert2SD = this.alert2SD.value;
        this.model.alert2ED = this.alert2ED.value;
        this.model.alert3 = this.alert3.value;
        this.model.alert3SD = this.alert3SD.value;
        this.model.alert3ED = this.alert3ED.value;

        return this.model;
    }

}