import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressNoteService } from 'src/app/services/progress-note.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { CirculatedTo } from 'src/app/shared/enums/circulated-to.enum';
import { FormStatus, FormStatusLabels } from 'src/app/shared/enums/progress-note-form-status';
import { ProgressNoteForm } from 'src/app/shared/forms/progress-note-form';
import { FormMessageLog, ProgressNote } from 'src/app/shared/models/progress-note';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/util/Constants';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-progressnotes',
  templateUrl: './progressnotes.component.html',
  styleUrls: ['./progressnotes.component.scss']
})
export class ProgressnotesComponent extends BaseComponent implements OnInit {
  @Input() userData: any;
  @Input() progressNote: ProgressNote;
  @Input() isReload: boolean;
  @Output() getProgressNotes: EventEmitter<any> = new EventEmitter<any>();

  public FormStatus = FormStatus;

  public FormStatusValues = Object.keys(FormStatus).filter(key => !isNaN(Number(FormStatus[key])));
  public FormStatusLabels = FormStatusLabels;

  public usersList: Array<User> = [];
  public circulatedToArray: Array<any>;
  public circulatedToEnum = CirculatedTo;
  private circulateTo: Array<number> = [];
  public progressNoteForm: ProgressNoteForm;
  public currentUserName: string;
  public isEdit = false;
  public currentUserId: number = 0;
  public formMessageLog: any;

  public showMessageLog: boolean = false;


  constructor(private userService: UserService, private progressNoteService: ProgressNoteService, private router: Router) { super(); }

  ngOnInit(): void {
    this.SetLoading(true);

    this.currentUserId = Number((localStorage.getItem('_identity')) ? JSON.parse(localStorage.getItem('_identity')).id : '');
    this.getUsers();
    if (this.progressNote) {
      this.isEdit = true;
      this.SetLoading(true);
      this.progressNoteForm = new ProgressNoteForm(this.progressNote);
      this.progressNote.circulatedTo.split('|').forEach(element => {
        this.circulateTo.push(Number(element));
      });
      if (this.progressNoteForm.formStatus.value == FormStatus.sendToUpload && this.progressNoteForm.signOffBy.value != this.currentUserId) {
        this.getMessageLog()
      }
    } else {
      this.progressNoteForm = new ProgressNoteForm();
      this.progressNoteForm.isSignOff.setValue(false);
      if (this.currentUserId != this.progressNoteForm.signOffBy.value) {
        this.progressNoteForm.userId.setValue(Number(JSON.parse(localStorage.getItem('_identity')).id));
      }
      if (this.currentUserRole == this.userType.Admin || this.currentUserRole == this.userType.SuperUser) {
        this.progressNoteForm.signOffBy.setValue(Number(JSON.parse(localStorage.getItem('_identity')).id));
        this.progressNoteForm.isSignOff.setValue(true);
      }
    }

    this.circulatedToArray = this.getCirculatedTo();
    this.SetLoading(false);
  }

  public isCirculatedChecked(value) {
    if (this.circulateTo.includes(value)) {
      return true;
    } else {
      return false;
    }
  }

  public changeCirculated(option, event) {
    if (event.target.checked) {
      this.circulateTo.push(option.value);
    } else {
      for (var i = 0; i < this.circulatedToArray.length; i++) {
        if (this.circulateTo[i] == option.value) {
          this.circulateTo.splice(i, 1);
        }
      }
    }
    this.progressNoteForm.circulatedTo.setValue(this.circulateTo.join('|'));
  }

  public getProgressNoteList() {
    if (this.isReload) {
      location.reload();
      this.router.navigate([Constants.routes.dashboard()]);
    } else
      this.getProgressNotes.emit();
  }

  public onSubmit() {
    this.progressNoteForm.patientId.setValue(this.userData.id);
    // this.progressNoteForm.userId.setValue(Number(JSON.parse(localStorage.getItem('_identity')).id));
    // console.log(this.progressNoteForm.save());
    if (this.isEdit) {
      this.updateProgressNote();
    } else {
      this.addProgressNote();
    }
  }

  private addProgressNote() {
    this.SetLoading(true);
    this.progressNoteService.addProgressNote(this.progressNoteForm.save()).subscribe(response => {
      if (response) {
        alert("Note added successfully");
        this.getProgressNoteList();
      }
      this.SetLoading(false);
    }, err => {
      alert(err.error);
      this.SetLoading(false);
    });
  }

  private updateProgressNote() {
    this.SetLoading(true);
    if (this.currentUserId == Number(this.progressNote.signOffBy)) {
      this.progressNoteForm.isSignOff.setValue(true);
    }
    this.progressNoteService.updateProgressNote(this.progressNoteForm.save()).subscribe(response => {
      if (response) {
        alert("Note updated successfully");
        {
          this.getProgressNoteList();
        }
      }
      this.SetLoading(false);

    }, err => {
      this.SetLoading(false);
      alert(err.error);
    });
  }

  private getCirculatedTo() {
    return EnumConverter.ConvertEnumToArray(CirculatedTo);
  }

  private getUsers() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe(response => {
      if (response) {
        this.usersList = response;
        this.usersList.forEach(element => {
          if (element.id == Number(JSON.parse(localStorage.getItem('_identity')).id)) {
            this.currentUserName = element.firstName + " " + element.lastName;
          }
        });

      }
    }, err => {
      console.error("could not fetch users::" + err.error);
    })
    // this.isBusy = false;
  }

  public updateFormMessageLog(event: any) {
    const message = event.target.value; // Get the value entered in the textarea
    // const updatedFormMessageLog = {
    //     ...this.progressNoteForm.value.formMessageLog,
    //     message: message
    // };
    // this.progressNoteForm.controls['formMessageLog'].setValue(updatedFormMessageLog);
    this.progressNoteForm.controls['formMessageLog'].setValue({ message: message });
  }

  private getMessageLog() {
    this.progressNoteService.getMessageLog(this.progressNoteForm.id, this.progressNoteForm.formMessageLog.value.entityName).subscribe(response => {
      if (response) {
        this.formMessageLog = response.data;
        console.log(this.formMessageLog)
      } err => {
        console.error("could not fetch message logs::" + err.error);
      }
    })
  }

  public openMessageLogs(){
      this.showMessageLog = !this.showMessageLog;
  }
}
