import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ShiftManagementService } from 'src/app/services/roster/shift-management.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { UserType } from 'src/app/shared/enums/user-type.enum';
import { Shift } from 'src/app/shared/models/roster-management/shift';
import { UserShift } from 'src/app/shared/models/roster-management/user-shift';
import { DialogResult } from 'src/app/util/DialogResult ';
@Component({
  selector: 'app-show-shift-modal',
  templateUrl: './show-shift-modal.component.html',
  styleUrls: ['./show-shift-modal.component.scss']
})
export class ShowShiftModalComponent extends BaseComponent implements OnInit {
  @Input() locationId: number;
  @ViewChild("showShiftModal") showShiftModal: ModalDirective;
  @Output() shiftId: EventEmitter<number> = new EventEmitter<number>();


  public shift: Shift;
  // public shift: Shift;
  public isClose: boolean;
  public selectUsers: Array<number> = [];
  public shiftUsers: Array<any> = [];
  public onLeave: Array<any> = [];
  public today: Date;
  private callback: any;
  private userShift: UserShift;


  constructor(private shiftService: ShiftManagementService) { super(); }

  ngOnInit(): void {
  }

  public showModal(shiftId?: number): Promise<DialogResult> {
    let promise = new Promise<DialogResult>((resolve) => {
      this.isClose = true;
      this.callback = resolve;
      this.today = new Date();
      let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);

      if (shiftId) {
        this.getShiftById(shiftId);
        this.allotedUsers(shiftId, careHomeId)
      }
      this.showShiftModal.show();
    })
    return promise;
  }

  public getShiftUsers() {
    this.isClose = !this.isClose;
    if (this.isClose) {
      return
    }
    this.SetLoading(true);
    this.shiftUsers = [];
    this.onLeave = [];
    this.shiftService.getShiftUsers(this.shift).subscribe(response => {
      if (response) {
        this.shiftUsers = [...response.filter(x => x.userType != UserType.Admin && x.userType != UserType.Auditor)];
        response.filter(x => {
          if (x.isLeaveAllocated == true || x.isShiftAllocated == true) {
            this.onLeave.push(x.id);
          }
        });
  
      }
      this.SetLoading(false);
    },
      err => {
        this.SetLoading(false);
        alert(err.error);
      })

  }

  public selectStaff(userId, event) {
    if (event.target.checked) {
      this.selectUsers.push(userId);
    } else {
      this.selectUsers = this.selectUsers.filter(id => id !== userId);
    }
  }

  public isSelected(value) {
    return this.selectUsers.includes(value);
  }

  public cancel() {
    this.showShiftModal.hide();
    if (this.callback != null) {
      this.callback(DialogResult.Canceled);
    }
  }

  public edit(shiftId) {
    if (new Date(this.shift.startTime) <= new Date()) {
      return alert("shift updation time is over");
    }
    if (shiftId) {
      this.shiftId.emit(shiftId);
      this.showShiftModal.hide();
    }
  }

  public remove(shiftId) {
    if (new Date(this.shift.startTime) <= new Date()) {
      return alert("shift updation time is over");
    }
    if (shiftId && window.confirm('Are sure you want remove this shift?')) {
      this.shiftService.delete(shiftId).subscribe(response => {
        if (response) {
          alert("Shift removed successfully");
        }
        this.SetLoading(false);
        this.showShiftModal.hide();
        this.callback(DialogResult.Confirmed);
      },
        err => {
          this.SetLoading(false);
          alert(err.error);
        })
    }
  }

  public assignUser() {
    if (new Date(this.shift.startTime) <= new Date()) {
      return alert("shift updation time is over");
    }
    if (this.selectUsers.length == 0) {
      return alert("Please Select at least one staff");
    }
    this.SetLoading(true);

    // let selectedUser = this.selectUsers.filter(function (n) { return this.shiftUsers.indexOf(n).id !== -1; }.bind(this));
    this.userShift.userIds = this.selectUsers.filter(x => !this.onLeave.includes(x));

    this.shiftService.updateAllotedUsers(this.userShift).subscribe(response => {
      if (response) {
        alert("users allocated successfully");
        this.showShiftModal.hide();
        this.callback(DialogResult.Confirmed);
      }
      this.SetLoading(false);
    },
      err => {
        alert(err.error);
        this.SetLoading(false);
      })

  }

  private getShiftById(shiftId) {
    this.SetLoading(true);
    this.shiftService.getShift(shiftId).subscribe(response => {
      if (response) {
        this.shift = response;
      }
      this.SetLoading(false);
    },
      err => {
        console.error(err.error);
        this.SetLoading(false);
      })
  }

  private allotedUsers(shiftId, careHomeId) {
    this.selectUsers = [];
    this.shiftService.getAllotedUsers(shiftId, this.locationId).subscribe(response => {
      if (response) {
        this.userShift = new UserShift();
        this.userShift.shiftId = response.shiftId;
        this.userShift.userIds = response.userIds;
        this.userShift.careHomeId = response.careHomeId;
        this.userShift.locationId = (response.locationId) ? response.locationId : this.locationId;
        this.selectUsers = response.userIds;
      } else {
        // let careHomeId =

        this.userShift = new UserShift();
        this.userShift.shiftId = this.shift.id;
        this.userShift.careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
        this.userShift.locationId = this.shift.locationId;
      }
      this.SetLoading(false);
    },
      err => {
        console.error(err.error);
        this.SetLoading(false);
      })
  }
}
