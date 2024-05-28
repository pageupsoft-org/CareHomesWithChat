import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LocationAlert } from "../models/location-alerts";


export class LocationAlertForm extends FormGroup {
    public id: number;
    public name: FormControl;
    public locationId: FormControl;
    public careHomeId: FormControl;


    public model: LocationAlert;

    /**
   * Creates an instance of LocationAlert.
   *
   * @param {LocationAlert} [model=null]
   */
    constructor(model: LocationAlert = null) {
        super({});
        this.model = model || new LocationAlert();
        this.id = this.model.id;
        this.name = new FormControl(this.model.name,[Validators.required,Validators.minLength(2),Validators.maxLength(30)]);
        this.locationId = new FormControl(this.model.locationId, Validators.required);
        this.careHomeId = new FormControl(this.model.careHomeId, Validators.required);

        this.registerControl("name", this.name);
        this.registerControl("locationId", this.locationId);
        this.registerControl("careHomeId", this.careHomeId);
        this.initialize(this.model);
    }

    public initialize(model: LocationAlert) {
        this.name.setValue(model.name);
        this.locationId.setValue(model.locationId);
        this.careHomeId.setValue(model.careHomeId);
    }

    /**
   * converts form values to {Patient} instance
   *
   * @returns {LocationAlert}
   */
    public save(): LocationAlert {
        this.model.id = this.id;
        this.model.name = (this.name.value.trim());
        this.model.locationId = (this.locationId.value);
        this.model.careHomeId = (this.careHomeId.value);
        return this.model;
    }
}