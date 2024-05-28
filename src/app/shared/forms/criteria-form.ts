import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Criteria } from "../models/criteria";

export class CriteriaForm extends FormGroup {
    public id: number;
    public name: FormControl;
    public zoningCategory: FormControl;
    public locationId: FormControl;
    public careHomeId: FormControl;


    public model: Criteria;

    /**
   * Creates an instance of Criteria.
   *
   * @param {Criteria} [model=null]
   */
    constructor(model: Criteria = null) {
        super({});
        this.model = model || new Criteria();
        this.id = this.model.id;
        this.name = new FormControl(this.model.name, [Validators.required,Validators.minLength(2),Validators.maxLength(90),Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,60}$")]);
        this.zoningCategory = new FormControl(this.model.zoningCategory, Validators.required);
        this.locationId = new FormControl(this.model.locationId, Validators.required);
        this.careHomeId = new FormControl(this.model.careHomeId, Validators.required);


        this.registerControl("name", this.name);
        this.registerControl("zoningCategory", this.zoningCategory);
        this.registerControl("locationId", this.locationId);
        this.registerControl("careHomeId", this.careHomeId);
        this.initialize(this.model);
    }

    public initialize(model: Criteria) {
        this.name.setValue(model.name);
        this.zoningCategory.setValue(model.zoningCategory);
        this.locationId.setValue(model.locationId);
        this.careHomeId.setValue(model.careHomeId);
    }

    /**
   * converts form values to {Patient} instance
   *
   * @returns {Criteria}
   */
    public save(): Criteria {
        this.model.id = this.id;
        this.model.name = (this.name.value.trim());
        this.model.zoningCategory = (this.zoningCategory.value);
        this.model.locationId = (this.locationId.value);
        this.model.careHomeId = (this.careHomeId.value);
        return this.model;
    }
}