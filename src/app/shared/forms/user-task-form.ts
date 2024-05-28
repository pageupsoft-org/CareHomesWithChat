import { FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../models/user";
import { UserTask } from "../models/user-task";


export class UserTaskForm extends FormGroup {
    public id: number;
    public taskName: FormControl;
    public description: FormControl;
    public careHomeId: FormControl;
    public locationId: FormControl;
    public userId: FormControl; //UserId
    public remark: FormControl;
    public taskDate: FormControl;
    public isActive: boolean;
    public taskStatus: boolean;
    public createdBy: FormControl;
    public createdAt: Date;
    public updatedAt: Date;
    public updatedBy: FormControl;
    public user: User;


    public model: UserTask;

    /**
   * Creates an instance of UserTask.
   *
   * @param {UserTask} [model=null]
   */
    constructor(model: UserTask = null) {
        super({});
        this.model = model || new UserTask();
        this.id = this.model.id;
        // this.taskName = new FormControl({ value: this.model.taskName }, [Validators.required,Validators.minLength(2),Validators.maxLength(30),Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,50}$")]);//TODO:generating error
        this.taskName = new FormControl(this.model.taskName, [Validators.required, Validators.minLength(2), Validators.maxLength(250), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,50}$")]);
        // this.description = new FormControl({ value: this.model.description }, [Validators.required,Validators.minLength(2),Validators.maxLength(100),Validators.pattern("^[a-zA-Z][a-zA-Z 0-9]{1,100}$")]);//TODO:generating error
        this.description = new FormControl(this.model.description, [Validators.required, Validators.minLength(2), Validators.maxLength(5000)]);
        // this.careHomeId = new FormControl({ value: this.model.careHomeId }, Validators.required);//TODO:generating error
        this.careHomeId = new FormControl(this.model.careHomeId, Validators.required);
        // this.locationId = new FormControl({ value: this.model.locationId }, Validators.required);//TODO:generating error
        this.locationId = new FormControl(this.model.locationId, Validators.required);
        // this.userId = new FormControl({ value: this.model.userId }, Validators.required); //TODO:generating error
        this.userId = new FormControl(this.model.userId, Validators.required);
        // this.remark = new FormControl({ value: this.model.remark },[Validators.maxLength(100),Validators.pattern("^[a-zA-Z][a-zA-Z 0-9]{1,100}$")]);//TODO:generating error
        this.remark = new FormControl(this.model.remark, [Validators.maxLength(100), Validators.pattern("^[a-zA-Z][a-zA-Z 0-9]{1,100}$")]);
        // this.taskDate = new FormControl({ value: this.model.taskDate }, Validators.required);//TODO:generating error
        this.taskDate = new FormControl(this.model.taskDate, Validators.required);
        this.taskStatus = this.model.status;
        this.isActive = this.model.isActive;
        // this.createdBy = new FormControl({ value: this.model.createdBy }, Validators.required);//TODO:generating error
        this.createdBy = new FormControl(this.model.createdBy, Validators.required);
        this.createdAt = this.model.createdAt;
        this.updatedAt = this.model.updatedAt;
        // this.updatedBy = new FormControl({ value: this.model.updatedBy });//TODO:generating error
        this.updatedBy = new FormControl(this.model.updatedBy);
        this.user = this.model.user;

        this.registerControl("taskName", this.taskName);
        this.registerControl("description", this.description);
        this.registerControl("careHomeId", this.careHomeId);
        this.registerControl("locationId", this.locationId);
        this.registerControl("userId", this.userId);
        this.registerControl("remark", this.remark);
        this.registerControl("taskDate", this.taskDate);
        this.registerControl("createdBy", this.createdBy);
        this.registerControl("updatedBy", this.updatedBy);

        this.initialize(this.model);
    }

    public initialize(model: UserTask) {
        this.taskName.setValue(model.taskName);
        this.description.setValue(model.description);
        this.careHomeId.setValue(model.careHomeId);
        this.locationId.setValue(model.locationId);
        this.userId.setValue(model.userId);
        this.remark.setValue(model.remark);
        this.taskDate.setValue(model.taskDate);
        this.createdBy.setValue(model.createdBy);
        this.updatedBy.setValue(model.updatedBy);
    }

    /**
   * converts form values to {Patient} instance
   *
   * @returns {UserTask}
   */
    public save(): UserTask {
        this.model.id = this.id;
        this.model.taskName = (this.taskName.value.trim());
        this.model.description = (this.description.value);
        this.model.careHomeId = (this.careHomeId.value);
        this.model.locationId = (this.locationId.value);
        this.model.userId = (this.userId.value);
        this.model.remark = (this.remark.value);
        this.model.taskDate = (this.taskDate.value);
        this.model.isActive = this.isActive;
        this.model.status = this.taskStatus;
        this.model.createdBy = (this.createdBy.value);
        this.model.createdAt = (this.createdAt);
        this.model.updatedAt = (this.updatedAt);
        this.model.updatedBy = (this.updatedBy.value);
        this.model.user = null;
        return this.model;
    }
}