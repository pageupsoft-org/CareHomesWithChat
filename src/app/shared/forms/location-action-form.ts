import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LocationAction } from "../models/location-action";


export class LocationActionForm extends FormGroup {
    public id: number;
    public name: FormControl;
    public locationId: FormControl;
    public careHomeId: FormControl;


    public model: LocationAction;

    /**
   * Creates an instance of LocationAction.
   *
   * @param {LocationAction} [model=null]
   */
    constructor(model: LocationAction = null) {
        super({});
        this.model = model || new LocationAction();
        this.id = this.model.id;
        this.name = new FormControl(this.model.name, [ Validators.required,Validators.maxLength(60),Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,60}$")]);
        this.locationId = new FormControl(this.model.locationId, Validators.required);
        this.careHomeId = new FormControl(this.model.careHomeId, Validators.required);


        this.registerControl("name", this.name);
        this.registerControl("locationId", this.locationId);
        this.registerControl("careHomeId", this.careHomeId);
        this.initialize(this.model);
    }

    public initialize(model: LocationAction) {
        this.name.setValue(model.name);
        this.locationId.setValue(model.locationId);
        this.careHomeId.setValue(model.careHomeId);
    }

    /**
   * converts form values to {Patient} instance
   *
   * @returns {LocationAction}
   */
    public save(): LocationAction {
        this.model.id = this.id;
        this.model.name = (this.name.value.trim());
        this.model.locationId = (this.locationId.value);
        this.model.careHomeId = (this.careHomeId.value);
        return this.model;
    }
}