import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Location } from "../models/location";

export class LocationForm extends FormGroup {
    public id: number;
    public name: FormControl;
    public address1: FormControl;
    public address2: FormControl;
    public address3: FormControl;
    public address4: FormControl;
    public postalCode: FormControl;


    public model: Location;

    /**
   * Creates an instance of LocationForm.
   *
   * @param {Location} [model=null]
   */
    constructor(model: Location = null) {
        super({});
        this.model = model || new Location();
        this.id = this.model.id;
        this.name = new FormControl(this.model.name,[ Validators.required,Validators.maxLength(250),Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,60}$")]);
        this.address1 = new FormControl(this.model.address1, [Validators.required,Validators.minLength(2),Validators.maxLength(5000)]);
        this.address2 = new FormControl(this.model.address2);
        this.address3 = new FormControl(this.model.address3);
        this.address4 = new FormControl(this.model.address4);
        this.postalCode = new FormControl(this.model.postalCode, [Validators.required,Validators.maxLength(20)]);

        this.registerControl("name", this.name);
        this.registerControl("address1", this.address1);
        this.registerControl("address2", this.address2);
        this.registerControl("address3", this.address3);
        this.registerControl("address4", this.address4);
        this.registerControl("postalCode", this.postalCode);

        this.initialize(this.model);
    }

    public initialize(model: Location ) {
        this.name.setValue(model.name);
        this.address1.setValue(model.address1);
        this.address2.setValue(model.address2);
        this.address3.setValue(model.address3);
        this.address4.setValue(model.address4);
        this.postalCode.setValue(model.postalCode);
    }

    /**
   * converts form values to {Patient} instance
   *
   * @returns {Location}
   */
    public save(): Location {
        this.model.id = this.id;
        this.model.name = this.name.value;
        this.model.address1 = this.address1.value;
        this.model.address2 = this.address2.value;
        this.model.address3 = this.address3.value;
        this.model.address4 = this.address4.value;
        this.model.postalCode = this.postalCode.value;
        this.model.careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);

        return this.model;
    }

}