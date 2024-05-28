import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ChangePassword } from "../models/change-password";



export class ChangePasswordForm extends FormGroup {

    public userId: FormControl;
    public oldPassword: FormControl;
    public newPassword: FormControl;
    public confirmPassword: FormControl;


    public model: ChangePassword;

    /**
   * Creates an instance of LoginForm.
   *
   * @param {ChangePassword} [model=null]
   */
    constructor(model: ChangePassword = null) {
        super({});
        this.model = model || new ChangePassword();
        this.userId = new FormControl({ value: this.model.oldPassword }, Validators.required);
        this.oldPassword = new FormControl({ value: this.model.oldPassword }, Validators.required);
        this.newPassword = new FormControl({ value: this.model.newPassword }, Validators.required);
        this.confirmPassword = new FormControl({ value: this.model.confirmPassword }, Validators.required);

        this.registerControl("oldPassword", this.oldPassword);
        this.registerControl("newPassword", this.newPassword);
        this.registerControl("confirmPassword", this.confirmPassword);

        this.initialize(this.model);
    }

    public initialize(model: ChangePassword) {
        this.oldPassword.setValue(model.oldPassword);
        this.newPassword.setValue(model.newPassword);
        this.confirmPassword.setValue(model.confirmPassword);
    }

    /**
   * converts form values to {Patient} instance
   *
   * @returns {ChangePassword}
   */
    public save(): ChangePassword {
        this.model.oldPassword = this.oldPassword.value;
        this.model.newPassword = this.newPassword.value;
        this.model.confirmPassword = this.confirmPassword.value;
        return this.model;
    }

}