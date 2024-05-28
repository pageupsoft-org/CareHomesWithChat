import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserType } from "../enums/user-type.enum";
import { ProgressNote } from '../models/progress-note';

export class ProgressNoteForm extends FormGroup {

    public id: number;
    public patientId: FormControl;
    public noteDate: FormControl;
    public shift: FormControl;
    public userId: FormControl;
    public answer1: FormControl;
    public answer2: FormControl;
    public answer3: FormControl;
    public answer4: FormControl;
    public answer5: FormControl;
    public additionalNotes: FormControl;
    public circulatedTo: FormControl;
    public signOffBy: FormControl;
    public isSignOff: FormControl;
    public healthAndHyginus:FormControl;
    public medicationCompliance:FormControl;
    public risksAndConcerns:FormControl;
    public formStatus:FormControl;
    public formMessageLog:FormControl;

    public currentUserRole: number = Number((localStorage.getItem('_identity')) ? JSON.parse(localStorage.getItem('_identity')).role : '');
    public currentUserId: number = Number((localStorage.getItem('_identity')) ? JSON.parse(localStorage.getItem('_identity')).id : '');

    public model: ProgressNote;

    /**
   * Creates an instance of ProgressNote.
   *
   * @param {ProgressNote} [model=null]
   */
    constructor(model: ProgressNote = null) {
        super({});

        
        this.model = model || new ProgressNote();
        this.id = this.model.id;
        this.patientId = new FormControl(this.model.patientId);
        this.noteDate = new FormControl(this.model.noteDate, [Validators.required]);
        this.shift = new FormControl(this.model.shift, [Validators.required, Validators.minLength(2), Validators.maxLength(250)]);
        this.userId = new FormControl(this.model.userId);
        this.answer1 = new FormControl(this.model.answer1, [Validators.required, Validators.minLength(2), Validators.maxLength(5000)]);
        this.answer2 = new FormControl(this.model.answer2, [Validators.required, Validators.minLength(2), Validators.maxLength(5000)]);
        this.answer3 = new FormControl(this.model.answer3, [Validators.required, Validators.minLength(2), Validators.maxLength(5000)]);
        this.answer4 = new FormControl(this.model.answer4, [Validators.required, Validators.minLength(2), Validators.maxLength(5000)]);
        this.answer5 = new FormControl(this.model.answer5, [Validators.required, Validators.minLength(2), Validators.maxLength(5000)]);

        this.medicationCompliance = new FormControl(this.model.medicationCompliance, [Validators.required, Validators.minLength(2), Validators.maxLength(5000)]);

        this.healthAndHyginus = new FormControl(this.model.healthAndHyginus, [Validators.required, Validators.minLength(2), Validators.maxLength(5000)]);

        this.risksAndConcerns = new FormControl(this.model.risksAndConcerns, [Validators.required, Validators.minLength(2), Validators.maxLength(5000)]);

        this.additionalNotes = new FormControl(this.model.additionalNotes);
        this.circulatedTo = new FormControl(this.model.circulatedTo, [Validators.required]);
        this.signOffBy = new FormControl({ value:this.model.signOffBy, disabled:this.currentUserRole == UserType.Admin || this.currentUserRole == UserType.SuperUser}, [Validators.required]);
        this.isSignOff = new FormControl(this.model.isSignOff);
        this.formStatus = new FormControl(this.model.formStatus);
        this.formMessageLog = new FormControl(this.model.formMessageLog)

        this.registerControl("patientId", this.patientId);
        this.registerControl("noteDate", this.noteDate);
        this.registerControl("shift", this.shift);
        this.registerControl("userId", this.userId);
        this.registerControl("answer1", this.answer1);
        this.registerControl("answer2", this.answer2);
        this.registerControl("answer3", this.answer3);
        this.registerControl("answer4", this.answer4);
        this.registerControl("answer5", this.answer5);

        this.registerControl("medicationCompliance", this.medicationCompliance);
        this.registerControl("risksAndConcerns", this.risksAndConcerns);
        this.registerControl("healthAndHyginus", this.healthAndHyginus);

        this.registerControl("additionalNotes", this.additionalNotes);
        this.registerControl("circulatedTo", this.circulatedTo);
        this.registerControl("signOffBy", this.signOffBy);
        this.registerControl("isSignOff", this.isSignOff);

         // Register form controls
         this.registerControl("formMessageLog", this.formMessageLog);
        this.initialize(this.model);

        // this.formMessageLog = new FormControl({
        //     id: null,
        //     entityName: '',
        //     message: '', // Initialize message property with an empty string
        //     tableKeyId: null,
        //     careHomeId: null,
        //     locationId: null,
        //     patientId: null,
        //     createdDate: '',
        //     updatedDate: '',
        //     createBy: null,
        //     updateBy: null
        // });

    }

    

    public initialize(model: ProgressNote) {
        this.patientId.setValue(model.patientId);
        this.noteDate.setValue(model.noteDate);
        this.shift.setValue(model.shift);
        this.userId.setValue(model.userId);
        this.answer1.setValue(model.answer1);
        this.answer2.setValue(model.answer2);
        this.answer3.setValue(model.answer3);
        this.answer4.setValue(model.answer4);
        this.answer5.setValue(model.answer5);

        this.medicationCompliance.setValue(model.medicationCompliance);
        this.healthAndHyginus.setValue(model.healthAndHyginus);
        this.risksAndConcerns.setValue(model.risksAndConcerns);

        this.additionalNotes.setValue(model.additionalNotes);
        this.circulatedTo.setValue(model.circulatedTo);
        this.signOffBy.setValue(model.signOffBy);
        this.isSignOff.setValue(model.isSignOff);
        this.formMessageLog.setValue(model.formMessageLog);
    }

    /**
   * converts form values to {Patient} instance
   *
   * @returns {ProgressNote}
   */
    public save(): ProgressNote {
        this.model.id = this.id;
        this.model.patientId = this.patientId.value;
        this.model.noteDate = this.noteDate.value;
        this.model.shift = this.shift.value.trim();
        this.model.userId = this.userId.value;
        this.model.answer1 = this.answer1.value.trim();
        this.model.answer2 = this.answer2.value.trim();
        this.model.answer3 = this.answer3.value.trim();
        this.model.answer4 = this.answer4.value.trim(); 
        this.model.answer5 = this.answer5.value.trim();

        this.model.medicationCompliance = this.medicationCompliance.value.trim();
        this.model.risksAndConcerns = this.risksAndConcerns.value.trim();
        this.model.healthAndHyginus = this.healthAndHyginus.value.trim();

        this.model.additionalNotes = this.additionalNotes.value;
        this.model.circulatedTo = this.circulatedTo.value;
        this.model.signOffBy = this.signOffBy.value;
        this.model.isSignOff = this.isSignOff.value;

        this.model.formStatus = this.formStatus.value;

     // Check if formMessageLog is null and initialize it if necessary
     if (!this.model.formMessageLog) {
        this.model.formMessageLog = {
            id: 0,
            entityName: '',
            message: '', // Initialize message property with an empty string
            tableKeyId: 0,
            careHomeId: 0,
            locationId: 0,
            patientId: 0,
            createdDate: new Date().toISOString(),
            updatedDate: null,
            createBy: 0,
            updateBy: 0
        };
    }

    // Update formMessageLog property
    let updatedFormMessageLog = {
        ...this.model.formMessageLog, // Retain existing properties
        message: this.formMessageLog.value.message // Update message property with the value from the form control
    };
    this.model.formMessageLog = updatedFormMessageLog;
     
        this.model.currentUserId = Number(JSON.parse(localStorage.getItem('_identity')).id);
        // this.model.careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);

        return this.model;
    }

}