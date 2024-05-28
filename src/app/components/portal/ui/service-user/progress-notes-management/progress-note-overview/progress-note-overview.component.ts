import { Component, Input, OnInit } from '@angular/core';
import { ProgressNoteService } from 'src/app/services/progress-note.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { ProgressNote } from 'src/app/shared/models/progress-note';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-progress-note-overview',
  templateUrl: './progress-note-overview.component.html',
  styleUrls: ['./progress-note-overview.component.scss']
})
export class ProgressNoteOverviewComponent extends BaseComponent implements OnInit {
  @Input() userData: PatientAdmission;

  public showNotification: boolean = false;
  public showProgressNote: boolean = false;
  public showProgressNotes: boolean = true;
  public progressNoteList: Array<ProgressNote> = [];
  public usersList: Array<User> = [];
  public progressNote: ProgressNote;

  constructor(private progressNoteService: ProgressNoteService, private userService: UserService) { super() }

  ngOnInit(): void {

    if (!this.userData) {
      this.showNotification = true;
      // this.showProgressNotes = false;

      return;
    }
    this.getProgressNotes();
    this.getUsers()
  }

  public getProgressNotes() {
    this.SetLoading(true);
    this.showProgressNotes = true;
    this.showProgressNote = false;
    this.progressNoteService.getProgressNotes(this.userData.id).subscribe(response => {

      if (response.length > 0) {
        this.progressNoteList = response;
      }
      else {
        this.progressNoteList = [];
      }
      this.SetLoading(false);
    }, err => {
      alert(err.error);
      this.SetLoading(false);

    })
  }

  public addProgressNote() {
    this.showProgressNotes = false;
    this.showProgressNote = false;
    this.progressNote = null;
  }

  public getUserName(userId: number) {
    if (userId) {
      let name;
      name = this.usersList.filter(x => x.id == userId)[0];
      if (name) {
        if (name.firstName == null && name.lastName == null) {
          return name.email;
        }
        else {
          return ((name.firstName)?name.firstName:'') + " " + ((name.lastName)?name.lastName:'');
        }
      }
    }
    return;

  }

  public editProgressNote(progressNote: ProgressNote) {
    this.addProgressNote();
    this.progressNote = progressNote;
  }

  public showNote(progressNote: ProgressNote) {
    this.showProgressNotes = false;
    this.showProgressNote = true;
    this.progressNote = progressNote;
  }

  public removeProgressNote(progressNoteId: number) {
    if (progressNoteId) {
      this.SetLoading(true);
      if (confirm("Are you sure you want to delete this record?")) {
        this.progressNoteService.removeProgressNote(progressNoteId).subscribe(response => {
          if (response) {
            alert("Note removed successfully");
          }
          this.getProgressNotes();
          this.SetLoading(false);
        }, err => {
          alert(err.error);
          this.SetLoading(false);
        })
      }
      this.SetLoading(false);
    }
  }

  private getUsers() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe(response => {
      if (response) {
        this.usersList = response;
      }
    }, err => {
      console.error("could not fetch users::" + err.error);
    })
    // this.isBusy = false;
  }

  
}
