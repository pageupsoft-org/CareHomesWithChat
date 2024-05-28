import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Login } from "../models/login";


export class LoginForm extends FormGroup {

    public userName: FormControl;
    public password: FormControl;
    public fbtoken: FormControl;


    public model: Login;

    /**
   * Creates an instance of LoginForm.
   *
   * @param {Login} [model=null]
   */
    constructor(model: Login = null) {
        super({});
        this.model = model || new Login();
        this.userName = new FormControl(this.model.userName, Validators.required);
        this.password = new FormControl(this.model.password, Validators.required);
        this.fbtoken = new FormControl(this.model.fbtoken, Validators.required);

        this.registerControl("userName", this.userName);
        this.registerControl("password", this.password);
        this.registerControl("password", this.fbtoken);

        this.initialize(this.model);
    }

    public initialize(model: Login) {
        this.userName.setValue(model.userName);
        this.password.setValue(model.password);
        this.fbtoken.setValue(model.fbtoken);
    }

    /**
   * converts form values to {Patient} instance
   *
   * @returns {Login}
   */
    public save(): Login {
        this.model.userName = this.userName.value;
        this.model.password = this.password.value;
        this.model.fbtoken = String(localStorage.getItem('permission'));
        return this.model;
    }

}