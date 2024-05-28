import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { CreditLeaveService } from 'src/app/services/roster/credit-leave.service';
import { FinancialYearService } from 'src/app/services/roster/financial-year.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { CreditLeave } from 'src/app/shared/models/leave-management/credit-leave';
import { FinancialYear } from 'src/app/shared/models/leave-management/financial-year';
import { userLeavesFilter } from 'src/app/shared/models/user-leaves-filter';

@Component({
  selector: 'app-credit-leave-overview',
  templateUrl: './credit-leave-overview.component.html',
  styleUrls: ['./credit-leave-overview.component.scss']
})
export class CreditLeaveOverviewComponent extends BaseComponent implements OnInit {

  public creditLeaves: boolean = false;
  public isEdit: boolean = false;
  public financialYears: Array<FinancialYear> = [];
  public creditedLeaves: Array<CreditLeave> = [];

  public records: userLeavesFilter;
  public recordCount: number;
  public lastRecord: number;
  public rotate = true;
  public maxSize = 6;

  public startDate: Date = new Date();
  public endDate: Date = new Date();

  constructor(private financialYearService: FinancialYearService, private creditLeaveService: CreditLeaveService) { super(); }

  ngOnInit(): void {
    this.setFilters();
    this.getFinancialYears();
  }

  public pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.lastRecord = event.page * event.itemsPerPage;

    this.records.skip = startItem;
    this.records.paginate = true;
    this.getcreditedLeaves(this.records);
  }

  public creditUserLeaves() {
    this.isEdit = false;
    this.creditLeaves = true;
  }

  public editUserLeaves() {
    this.creditLeaves = true;
    this.isEdit = true;
  }

  // public filterByDates() {
  //   let startDate = new Date(this.startDate);
  //   let endDate = new Date(this.endDate);
  //   if (endDate < startDate) {
  //     alert('Please select proper dates');
  //   } else {
  //     this.records.startDate = startDate;
  //     this.records.endDate = endDate;
  //   }

  //   this.getcreditedLeaves(this.records);
  // }

  public setFilters() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.records = new userLeavesFilter();
    this.records.skip = 0;
    this.records.top = 10;
    this.records.paginate = true;
    this.records.careHomeId = careHomeId;
    if (this.currentUserRole != this.userType.Admin) {
      this.records.userId = this.currentUserId;
    }
    this.getcreditedLeaves(this.records);

  }

  public filterByYear(yearId: number) {
    if (yearId && yearId != 0) {
      this.records.financialYearId = yearId;
    } else {
      this.records.financialYearId = 0;
    }
    this.getcreditedLeaves(this.records);

  }

  public getcreditedLeaves(records: userLeavesFilter) {
    if (records) {
      this.SetLoading(true);
      this.creditLeaves = false;
      this.isEdit = false;

      this.creditLeaveService.getCreditedLeaves(records).subscribe(response => {
        if (response) {
          this.creditedLeaves = response.items;
          this.recordCount = response.totalCount;
          this.lastRecord = response.count;
        }
        this.SetLoading(false);
      }, error => {
        this.SetLoading(false);
        alert(error.error);
      });
    }
  }

  public remove(id: number) {
    if (confirm('Are you sure you want to remove this?')) {

      this.SetLoading(true);
      this.creditLeaveService.delete(id).subscribe(response => {
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
