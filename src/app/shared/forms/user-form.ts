import { FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../models/user";

export class UserForm extends FormGroup {
    public id: number;
    public firstName: FormControl;
    public lastName: FormControl;
    public userName: FormControl;
    public email: FormControl;
    public userType: FormControl;
    public staffNumber: FormControl;
    public joiningDate: FormControl;
   

    public model: User;

    /**
   * Creates an instance of UserForm.
   *
   * @param {User} [model=null]
   */
    constructor(model: User = null) {
        super({});
        this.model = model || new User();
        this.id = this.model.id;
        this.firstName = new FormControl({ value: this.model.firstName }, Validators.required);
        this.lastName = new FormControl({ value: this.model.lastName }, Validators.required);
        this.userName = new FormControl({ value: this.model.userName }, Validators.required);
        this.email = new FormControl({ value: this.model.email }, Validators.required);
        this.userType = new FormControl({ value: this.model.userType }, Validators.required);
        this.staffNumber = new FormControl({ value: this.model.staffNumber }, Validators.required);
        this.joiningDate = new FormControl({ value: this.model.joiningDate }, Validators.required);
    

        this.registerControl("firstName", this.firstName);
        this.registerControl("lastName", this.lastName);
        this.registerControl("userName", this.userName);
        this.registerControl("email", this.email);
        this.registerControl("userType", this.userType);
        this.registerControl("staffNumber", this.staffNumber);
        this.registerControl("joiningDate", this.joiningDate);
        
        
        this.initialize(this.model);

    }

    public initialize(model: User) {
        this.firstName.setValue(model.firstName);
        this.lastName.setValue(model.lastName);
        this.userName.setValue(model.userName);
        this.email.setValue(model.email);
        this.userType.setValue(model.userType);
        this.staffNumber.setValue(model.staffNumber);
        this.joiningDate.setValue(model.joiningDate);
    }

    /**
   * converts form values to {User} instance
   *
   * @returns {User}
   */
    public save(): User {
        this.model.id = this.id;
        this.model.firstName = this.firstName.value;
        this.model.lastName = this.lastName.value;
        this.model.userName = this.userName.value;
        this.model.email = this.email.value;
        this.model.userType = this.userType.value;
        this.model.staffNumber = this.staffNumber.value;
        this.model.joiningDate = this.joiningDate.value;
        return this.model;
    }

}