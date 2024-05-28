import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShiftManagementService } from 'src/app/services/roster/shift-management.service';
import { UserLeavesService } from 'src/app/services/roster/user-leaves.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { LeaveStatus } from 'src/app/shared/enums/leave-status';
import { LeaveType } from 'src/app/shared/enums/leave-type.enum';
import { UserType } from 'src/app/shared/enums/user-type.enum';
import { UserLeave } from 'src/app/shared/models/leave-management/user-leave';
import { UserShifts } from 'src/app/shared/models/leave-management/user-shifts';
import { UserShift } from 'src/app/shared/models/roster-management/user-shift';
import { User } from 'src/app/shared/models/user';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-apply-user-leave',
  templateUrl: './apply-user-leave.component.html',
  styleUrls: ['./apply-user-leave.component.scss']
})
export class ApplyUserLeaveComponent extends BaseComponent implements OnInit {
  @Output() showUsersLeaves: EventEmitter<any> = new EventEmitter<any>();
  @Input() userLeave: UserLeave;


  public today: Date = new Date();
  public usersList: Array<User> = [];
  public usershifts: Array<UserShift> = [];
  public leaveTypes: any;
  public isEdit: boolean = false;
  public totalLeave: number = 0;
  public applyLeave: FormGroup;
  public shiftIds: Array<number>;

  constructor(private userService: UserService, private userShiftsService: ShiftManagementService, private fb: FormBuilder, private userLeaveService: UserLeavesService) { super(); }

  ngOnInit(): void {
    this.shiftIds = [];
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);

    this.leaveTypes = EnumConverter.ConvertEnumToArray(LeaveType);
    if (this.userLeave) {
      this.isEdit = true;
      this.getUserLeave(this.userLeave.id);
    } else {
      this.applyLeave = this.fb.group({
        id: [0],
        userId: ['', Validators.compose([Validators.required])],
        leaveType: [LeaveType.AnnualLeave],
        startDate: ['', Validators.compose([Validators.required])],
        endDate: ['', Validators.compose([Validators.required])],
        isHalfDay: [false],
        reason: [''],
        totalLeaveCount: [0],
        status: [LeaveStatus.Approverd],
        isActive: [true],
        shiftIds: [''],
        careHomeId: [careHomeId],
        createdAt: [new Date()],
        createdBy: [this.currentUserId],

      },
        {
          validator: this.dateValidation('startDate', 'endDate')
        })
    }
    this.getUsers();

  }

  public getUserBalance(userId: number) {
    this.totalLeave = 0;
    if (userId) {
      let leaveBalance = this.usersList.find(x => x.id == Number(userId)).leaveBalance;
      this.totalLeave = (leaveBalance) ? leaveBalance : 0;
    }
  }

  public checkIsHalfDay() {
    let sDate = this.applyLeave.controls['startDate'].value;
    if (this.applyLeave.controls['isHalfDay'].value) {
      this.applyLeave.controls['endDate'].setValue(sDate);
      this.applyLeave.controls['endDate'].disable();
    } else {
      this.applyLeave.controls['endDate'].setValue(sDate);
      this.applyLeave.controls['endDate'].enable();
      this.shiftIds = [];
    }

  }

  public calculateLeaves() {
    if (this.applyLeave.controls['startDate'].value && this.applyLeave.controls['endDate'].value && new Date(this.applyLeave.controls['startDate'].value) <= new Date(this.applyLeave.controls['endDate'].value)) {
      var diff = Math.abs(new Date(this.applyLeave.controls['endDate'].value).getTime() - new Date(this.applyLeave.controls['startDate'].value).getTime());
      var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      if (this.applyLeave.controls['isHalfDay'].value) {
        this.applyLeave.controls['totalLeaveCount'].setValue(0.5);
      } else
        this.applyLeave.controls['totalLeaveCount'].setValue((diffDays + 1));

      return this.applyLeave.controls['totalLeaveCount'].value

    }
    return '0';
  }

  public getUsersLeave() {
    this.showUsersLeaves.emit();
  }

  public checkUserShifts() {
    this.SetLoading(true);
    if (this.shiftIds.length > 0) {
      this.applyLeave.controls['shiftIds'].setValue(this.shiftIds);
      this.onSubmit();
      return;
    } else {
      this.applyLeave.controls['shiftIds'].setValue(this.shiftIds);
    }
    let userShifts = new UserShifts();
    userShifts.userId = this.applyLeave.controls['userId'].value;
    userShifts.startDate = this.applyLeave.controls['startDate'].value;
    userShifts.endDate = this.applyLeave.controls['endDate'].value;
    this.userShiftsService.getUserShifts(userShifts).subscribe((response) => {
      if (response) {
        if (response.length > 0) {
          this.usershifts = [...response];
        } else {
          this.onSubmit();
        }
      }
      this.SetLoading(false);
    },
      (err) => {
        this.SetLoading(false);
        alert(err.error);
      });
  }

  public onSubmit() {

    if ((this.totalLeave - this.calculateLeaves()) < 0 && this.applyLeave.controls['leaveType'].value == LeaveType.AnnualLeave) {
      alert("You don't have sufficient leaves");
    }
    this.applyLeave.controls['endDate'].enable();
    if (this.isEdit) {
      this.updateLeave();
    } else {
      this.addLeave();
    }
  }

  public getRemainigLeave() {
    if (LeaveType.AnnualLeave == this.applyLeave.controls['leaveType'].value) {
      return this.totalLeave - this.calculateLeaves();
    } else {
      return this.totalLeave;
    }
  }

  public removeFromShift(shiftId: number) {
    if (!shiftId) {
      return alert("something went wrong!! contact support");
    }
    if (this.currentUserRole != UserType.Admin) {
      let shiftLocation = this.usershifts.find(x => x.shiftId == shiftId).locationId;
      let userLocations = JSON.parse(localStorage.getItem('_identity')).locationIds;
      if (!userLocations.includes(shiftLocation)) {
        return alert("Please contact location super user to remove from shift")
      }
    }

    if (confirm('Are you sure you want to remove user from shift?')) {
      this.userShiftsService.userShiftRemove(shiftId, this.applyLeave.controls['userId'].value).subscribe((response) => {
        if (response) {
          this.usershifts = this.usershifts.filter(x => x.shiftId != shiftId);
          // if (response.length > 0) {
          //   this.usershifts = [...response];
          // } else {
          //   this.onSubmit();
          // }

        }
        this.SetLoading(false);
      },
        (err) => {
          this.SetLoading(false);
          alert(err.error);
        });
    }
  }

  public shiftHalfDay(shiftId: number) {
    if (shiftId) {
      if (this.shiftIds.includes(shiftId)) {
        this.shiftIds = this.shiftIds.filter(el => el != shiftId);
      } else {
        this.shiftIds.push(shiftId)
      }

    }

  }

  public isChecked(value) {
    return this.shiftIds.includes(value);
  }

  private updateLeave() {
    this.SetLoading(true);

    this.userLeaveService.updateUserLeave(this.applyLeave.value).subscribe((response) => {
      if (response) {
        alert("Leave updated successfully");
        this.getUsersLeave();
      }
      this.SetLoading(false);
    },
      (err) => {
        this.SetLoading(false);
        alert(err.error);
      });
  }

  private addLeave() {
    this.SetLoading(true);

    this.userLeaveService.applyUserLeave(this.applyLeave.value).subscribe((response) => {
      if (response) {
        alert("Leave added successfully");
        this.getUsersLeave();
      }
      this.SetLoading(false);
    },
      (err) => {
        this.SetLoading(false);
        alert(err.error);
      });
  }

  private getUsers() {
    let userId = null;
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    if (this.currentUserRole != UserType.Admin) {
      userId = this.currentUserId;
    }
    this.userService.getUsersList(careHomeId, userId).subscribe((response) => {
      if (response) {
        this.usersList = response.filter((x) => x.userType != this.userType.Auditor);
      }
      this.SetLoading(false);
    },
      (err) => {
        this.SetLoading(false);
        console.error('could not fetch users::' + err.error);
      });
  }

  private getUserLeave(id: number) {
    this.userLeaveService.getUserLeave(id).subscribe(response => {
      if (response) {
        this.applyLeave = this.fb.group({
          id: [response.id],
          userId: [response.userId, Validators.compose([Validators.required])],
          leaveType: [response.leaveType],
          startDate: [formatDate(response.startDate, 'yyyy-MM-dd', 'en'), Validators.compose([Validators.required])],
          endDate: [formatDate(response.endDate, 'yyyy-MM-dd', 'en'), Validators.compose([Validators.required])],
          isHalfDay: [response.isHalfDay],
          reason: [response.reason],
          totalLeaveCount: [response.totalLeaveCount],
          status: [response.status],
          isActive: [response.isActive],
          careHomeId: [response.careHomeId],
          createdAt: [response.createdAt],
          createdBy: [response.createdBy],
          updatedAt: [new Date()],
          updatedBy: [this.currentUserId]

        })
      }
    }, err => {
      alert(err.error);
      console.error(err.error);
      this.getUsersLeave();
    })
  }

  private dateValidation(startDate: string, endDate: string) {
    return (group: FormGroup) => {
      let startDateInput = group.controls[startDate];
      let endDateInput = group.controls[endDate];
      let currentDate = new Date();
      if (new Date(startDateInput.value).setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) {
        return startDateInput.setErrors({ inValidDateError: true });
      }
      if (new Date(startDateInput.value) > new Date(endDateInput.value)) {
        return endDateInput.setErrors({ inValidDateError: true });
      }
    }

  }

}
