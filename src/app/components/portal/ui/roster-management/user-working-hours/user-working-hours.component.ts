import { Component, OnInit } from '@angular/core';
import { ShiftManagementService } from 'src/app/services/roster/shift-management.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { User } from 'src/app/shared/models/user';
import { WorkingHoursRequest } from 'src/app/shared/models/working-hours-request';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { UserType } from 'src/app/shared/enums/user-type.enum';

@Component({
  selector: 'app-user-working-hours',
  templateUrl: './user-working-hours.component.html',
  styleUrls: ['./user-working-hours.component.scss']
})
export class UserWorkingHoursComponent extends BaseComponent implements OnInit {

  public records: WorkingHoursRequest;
  public recordCount: number;
  public lastRecord: number;
  public userWorkingHours: Array<any> = [];
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  public users: Array<User> = [];
  public userId: number = 0;

  public rotate = true;
  public maxSize = 6;

  constructor(private userShiftService: ShiftManagementService, private userService: UserService) { super(); }

  ngOnInit(): void {
    this.getUsers();
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.records = new WorkingHoursRequest();
    this.records.skip = 0;
    this.records.top = 10;
    this.records.paginate = true;
    this.records.careHomeId = careHomeId;
    if (this.currentUserRole != this.userType.Admin) {
      this.records.userId = this.currentUserId;
    }
    this.getRecords(this.records);
  }

  public getRecords(record: WorkingHoursRequest) {
    if (record) {
      this.SetLoading(true);
      this.userShiftService.getUserWorkingHours(record).subscribe(
        (response) => {
          if (response) {
            this.userWorkingHours = response.items;
            this.recordCount = response.totalCount;
            this.lastRecord = response.count;
          }
          this.SetLoading(false);
        },
        (error) => {
          this.SetLoading(false);
          alert(error.error);
        }
      );
    }
  }

  public search() {
    let startDate = new Date(this.startDate);
    let endDate = new Date(this.endDate);
    if (endDate < startDate) {
      alert('Please select proper dates');
    } else {
      this.records.startDate = startDate;
      this.records.endDate = endDate;
    }

    this.records.userId = this.userId;
    this.getRecords(this.records);
  }

  private getUsers() {
    let userId = null;
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    if (this.currentUserRole != UserType.Admin) {
      userId = this.currentUserId;
    }
    this.userService.getUsersList(careHomeId, userId).subscribe((response) => {
      if (response) {
        this.users = response.filter((x) => x.userType != this.userType.Auditor);
      }
      this.SetLoading(false);
    },
      (err) => {
        this.SetLoading(false);
        console.error('could not fetch users::' + err.error);
      });
  }

  public pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.lastRecord = event.page * event.itemsPerPage;

    this.records.skip = startItem;
    this.records.paginate = true;
    this.getRecords(this.records);
  }


}
