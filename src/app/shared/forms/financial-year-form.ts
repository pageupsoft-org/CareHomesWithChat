import { FormControl, FormGroup, Validators } from "@angular/forms";

export class FinancialYearForm extends FormGroup {
    public id: number;
    public name: FormControl;
    public isMandatory: FormControl;


    public model: FinancialYear;

    /**
   * Creates an instance of Course.
   *
   * @param {FinancialYear} [model=null]
   */
    constructor(model: FinancialYear = null) {
        super({});
        this.model = model || new FinancialYear();
        this.id = this.model.id;
        this.name = new FormControl({ value: this.model.name },[ Validators.required, Validators.minLength(2),Validators.maxLength(60),Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,60}$")]);
        this.isMandatory = new FormControl({ value: this.model.isMandatory }, Validators.required);


        this.registerControl("name", this.name);
        this.registerControl("is_mandatory", this.isMandatory);
        this.initialize(this.model);
    }

    public initialize(model: FinancialYear) {
        this.name.setValue(model.name);
        this.isMandatory.setValue(model.isMandatory);
    }

    /**
   * converts form values to {Patient} instance
   *
   * @returns {FinancialYear}
   */
    public save(): FinancialYear {
        this.model.id = this.id;
        this.model.name = this.name.value;
        this.model.isMandatory = (this.isMandatory.value);
        return this.model;
    }
}