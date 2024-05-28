import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { FinancialYearService } from 'src/app/services/roster/financial-year.service';
import { UserLeavesService } from 'src/app/services/roster/user-leaves.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { LeaveType } from 'src/app/shared/enums/leave-type.enum';
import { FinancialYear } from 'src/app/shared/models/leave-management/financial-year';
import { UserLeave } from 'src/app/shared/models/leave-management/user-leave';
import { userLeavesFilter } from 'src/app/shared/models/user-leaves-filter';

@Component({
  selector: 'app-user-leaves-overview',
  templateUrl: './user-leaves-overview.component.html',
  styleUrls: ['./user-leaves-overview.component.scss']
})
export class UserLeavesOverviewComponent extends BaseComponent implements OnInit {

  public applyLeave: boolean = false;
  public financialYears: Array<FinancialYear> = [];

  public userLeaves: Array<UserLeave> = [];
  public userLeave: UserLeave;
  public leaveType = LeaveType;
  public records: userLeavesFilter;
  public recordCount: number;
  public lastRecord: number;
  public rotate = true;
  public maxSize = 6;

  public startDate: Date = new Date();
  public endDate: Date = new Date();

  constructor(private financialYearService: FinancialYearService, private userLeaveService: UserLeavesService) { super(); }

  ngOnInit(): void {
    this.setFilters();
    this.getFinancialYears();
  }

  public applyUserLeave() {
    this.applyLeave = true;
    this.userLeave = null;
  }

  public editUserLeave(userLeave: UserLeave) {
    if (userLeave) {
      this.applyLeave = true;
      this.userLeave = userLeave;
    }
  }

  public pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.lastRecord = event.page * event.itemsPerPage;

    this.records.skip = startItem;
    this.records.paginate = true;
    this.getUsersLeaves(this.records);
  }

  public filterByDates() {
    let startDate = new Date(this.startDate);
    let endDate = new Date(this.endDate);
    if (endDate < startDate) {
      alert('Please select proper dates');
    } else {
      this.records.startDate = startDate;
      this.records.endDate = endDate;
    }

    this.getUsersLeaves(this.records);
  }

  public getLeavesByYear(yearId: number) {
    if (yearId && yearId != 0) {
      this.records.financialYearId = yearId;
    } else {
      this.records.financialYearId = 0;
    }
    this.getUsersLeaves(this.records);

  }

  public getUsersLeaves(records: userLeavesFilter) {
    if (records) {
      this.applyLeave = false;
      this.userLeaveService.getUserLeaves(records).subscribe(response => {
        if (response) {
          this.userLeaves = response.items;
          this.recordCount = response.totalCount;
          this.lastRecord = response.count;
        }
      }, error => {
        console.error("Something went wrong unable to load leaves:: " + error.error);
      });
    }
  }

  public setFilters() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);

    this.records = new userLeavesFilter();
    this.records.skip = 0;
    this.records.top = 10;
    this.records.paginate = true;
    this.records.careHomeId = careHomeId;
    if (this.currentUserRole != this.userType.Admin && this.currentUserRole != this.userType.SuperUser) {
      this.records.userId = this.currentUserId;
    }
    this.getUsersLeaves(this.records);
  }

  public remove(id: number) {
    if (confirm('Are you sure you want to remove this?')) {

      this.SetLoading(true);
      this.userLeaveService.delete(id).subscribe(response => {
        if (response) {
          this.setFilters();
        }
        this.SetLoading(false);
      }, (err) => {
        this.SetLoading(false);
        alert(err.error);
      })
    }
  }

  private getFinancialYears() {
    this.financialYearService.getFinancialYears().subscribe(response => {
      if (response) {
        this.financialYears = response;
      }
    }, error => {
      console.error("Something went wrong unable to load years:: " + error.error);
    });
  }
}
