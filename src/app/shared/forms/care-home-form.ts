import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CareHome } from "../models/care-home";

export class CareHomeForm extends FormGroup {
    public id: number;
    public name: FormControl;
    public contactFirstName: FormControl;
    public contactLastName: FormControl;
    public contactEmail: FormControl;
    public contactNumber: FormControl;
    public mainAddress1: FormControl;
    public mainAddress2: FormControl;
    public mainAddress3: FormControl;
    public mainAddress4: FormControl;
    public postalCode: FormControl;
    public serviceUserLimit: FormControl;
    public userName: FormControl;
    public userType: FormControl;
    public email: FormControl;
    // public password: FormControl;
    // public user: FormControl;

    public model: CareHome;

    /**
   * Creates an instance of CareHomeForm.
   *
   * @param {CareHome} [model=null]
   */
    constructor(model: CareHome = null) {
        super({});
        this.model = model || new CareHome();
        this.id = this.model.id;
        this.name = new FormControl(this.model.name, [Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,60}$")]);
        this.contactFirstName = new FormControl(this.model.contactFirstName, [Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,30}$")]);
        this.contactLastName = new FormControl(this.model.contactLastName, [Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,30}$"), Validators.maxLength(10)]);
        this.contactEmail = new FormControl(this.model.contactEmail, [Validators.required, Validators.pattern("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]);
        this.contactNumber = new FormControl(this.model.contactNumber, [Validators.required, Validators.pattern("^[0-9]{10,11}$")]);
        this.mainAddress1 = new FormControl(this.model.mainAddress1, [Validators.required, Validators.minLength(2), Validators.maxLength(250)]);
        this.mainAddress2 = new FormControl(this.model.mainAddress2);
        this.mainAddress3 = new FormControl(this.model.mainAddress3);
        this.mainAddress4 = new FormControl(this.model.mainAddress4);
        this.postalCode = new FormControl(this.model.postalCode);
        this.serviceUserLimit = new FormControl(this.model.serviceUserLimit,[Validators.required, Validators.min(5)]);
        this.userName = new FormControl(this.model.user.userName, [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern("^[a-zA-Z_@.0-9--]{5,30}$")]);
        this.email = new FormControl(this.model.user.email);
        // this.password = new FormControl(this.model.name, Validators.required);
        this.userType = new FormControl(this.model.user.userType, Validators.required);

        this.registerControl("name", this.name);
        this.registerControl("contactFirstName", this.contactFirstName);
        this.registerControl("contactLastName", this.contactLastName);
        this.registerControl("contactEmail", this.contactEmail);
        this.registerControl("contactNumber", this.contactNumber);
        this.registerControl("mainAddress1", this.mainAddress1);
        this.registerControl("mainAddress2", this.mainAddress2);
        this.registerControl("mainAddress3", this.mainAddress3);
        this.registerControl("mainAddress4", this.mainAddress4);
        this.registerControl("postalCode", this.postalCode);
        this.registerControl("serviceUserLimit", this.serviceUserLimit);
        this.registerControl("username", this.userName);
        this.registerControl("username", this.email);
        // this.registerControl("password", this.password);
        this.registerControl("userType", this.userType);

        this.initialize(this.model);

    }

    public initialize(model: CareHome) {
        this.name.setValue(model.name);
        this.contactFirstName.setValue(model.contactFirstName);
        this.contactLastName.setValue(model.contactLastName);
        this.contactEmail.setValue(model.contactEmail);
        this.contactNumber.setValue(model.contactNumber);
        this.mainAddress1.setValue(model.mainAddress1);
        this.mainAddress2.setValue(model.mainAddress2);
        this.mainAddress3.setValue(model.mainAddress3);
        this.mainAddress4.setValue(model.mainAddress4);
        this.postalCode.setValue(model.postalCode);
        this.serviceUserLimit.setValue(model.serviceUserLimit);
        this.userName.setValue(model.user.userName);
        this.email.setValue(model.user.email);
        this.userType.setValue(model.user.userType);
        // this.password.setValue(model.password);
        // this.userType.setValue(model.userType);
    }

    /**
   * converts form values to {CareHome} instance
   *
   * @returns {CareHome}
   */
    public save(): CareHome {
        this.model.id = this.id;
        this.model.name = this.name.value;
        this.model.contactFirstName = this.contactFirstName.value;
        this.model.contactLastName = this.contactLastName.value;
        this.model.contactEmail = this.contactEmail.value;
        this.model.contactNumber = this.contactNumber.value;
        this.model.mainAddress1 = this.mainAddress1.value;
        this.model.mainAddress2 = this.mainAddress2.value;
        this.model.mainAddress3 = this.mainAddress3.value;
        this.model.mainAddress4 = this.mainAddress4.value;
        this.model.postalCode = this.postalCode.value;
        this.model.serviceUserLimit = this.serviceUserLimit.value;
        this.model.user.userName = this.userName.value;
        this.model.user.email = this.contactEmail.value;
        // this.model.password = this.password.value;
        this.model.user.userType = 1;

        return this.model;
    }

}