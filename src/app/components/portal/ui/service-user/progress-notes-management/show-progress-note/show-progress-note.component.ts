import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { CirculatedTo } from 'src/app/shared/enums/circulated-to.enum';
import { ProgressNoteForm } from 'src/app/shared/forms/progress-note-form';
import { ProgressNote } from 'src/app/shared/models/progress-note';
import { User } from 'src/app/shared/models/user';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-show-progress-note',
  templateUrl: './show-progress-note.component.html',
  styleUrls: ['./show-progress-note.component.scss']
})
export class ShowProgressNoteComponent extends BaseComponent implements OnInit {
  @Input() userData: any;
  @Input() progressNote: ProgressNote;
  @Output() getProgressNotes: EventEmitter<any> = new EventEmitter<any>();

  public progressNoteForm: ProgressNoteForm;
  public circulatedToArray: Array<any> = [];
  public circulateTo: String;
  public usersList: Array<User> = [];

  constructor(private userService: UserService) { super(); }

  ngOnInit(): void {
    if (this.progressNote) {
      this.SetLoading(true);
      this.circulatedToArray = this.getCirculatedTo();
      this.progressNoteForm = new ProgressNoteForm(this.progressNote);
      this.circulateTo = this.getCirculateToString(this.progressNote.circulatedTo);
      // this.progressNote.circulatedTo.split('|').forEach(element => {
      //   this.circulateTo.push(Number(element));
      // });
    } else {
      alert("something went wrong");
      this.getProgressNoteList();
    }
    this.getUsers();
  }

  public getProgressNoteList() {
    this.getProgressNotes.emit();
  }

  public getCirculateToString(circulatedToString: string) {
    let newString = [];
    circulatedToString.split('|').forEach(element => {
      this.circulatedToArray.forEach((el) => {
        if (el.value == element) {
          newString.push(el.key);
        }
      });
    });
    return newString.join(',');

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
            // this.currentUserName = element.firstName + " " + element.lastName;
          }
        });

      }
    }, err => {
      console.error("could not fetch users::" + err.error);
    })
    // this.isBusy = false;
  }
}
