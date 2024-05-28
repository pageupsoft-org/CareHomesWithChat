import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Course } from "../models/course";

export class CourseForm extends FormGroup {
    public id: number;
    public name: FormControl;
    public isMandatory: FormControl;


    public model: Course;

    /**
   * Creates an instance of Course.
   *
   * @param {Course} [model=null]
   */
    constructor(model: Course = null) {
        super({});
        this.model = model || new Course();
        this.id = this.model.id;
        this.name = new FormControl(this.model.name,[ Validators.required, Validators.minLength(2),Validators.maxLength(250),Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,60}$")]);
        this.isMandatory = new FormControl(this.model.isMandatory, Validators.required);


        this.registerControl("name", this.name);
        this.registerControl("is_mandatory", this.isMandatory);
        this.initialize(this.model);
    }

    public initialize(model: Course) {
        this.name.setValue(model.name);
        this.isMandatory.setValue(model.isMandatory);
    }

    /**
   * converts form values to {Patient} instance
   *
   * @returns {Course}
   */
    public save(): Course {
        this.model.id = this.id;
        this.model.name = this.name.value;
        this.model.isMandatory = (this.isMandatory.value);
        return this.model;
    }
}