import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreditLeaveService } from 'src/app/services/roster/credit-leave.service';
import { FinancialYearService } from 'src/app/services/roster/financial-year.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { CreditLeave } from 'src/app/shared/models/leave-management/credit-leave';
import { FinancialYear } from 'src/app/shared/models/leave-management/financial-year';

@Component({
  selector: 'app-credit-leave',
  templateUrl: './credit-leave.component.html',
  styleUrls: ['./credit-leave.component.scss']
})
export class CreditLeaveComponent extends BaseComponent implements OnInit {

  @Input() isEdit: boolean;
  @Output() creditedLeaves: EventEmitter<any> = new EventEmitter<any>();

  public financialYears: Array<FinancialYear> = [];
  public isSelectedAll: boolean = true;
  public isCarryForwardAll: boolean = true;
  public creditLeaves: Array<CreditLeave> = [];
  constructor(private financialYearService: FinancialYearService, private creditLeaveService: CreditLeaveService) { super() }

  ngOnInit(): void {
    this.getFinancialYears();
  }

  public getCreditedLeaves() {
    this.creditedLeaves.emit();
  }

  public selectAllUsers(isChecked) {
    if (isChecked) {
      this.creditLeaves.forEach((element, index) => {
        this.creditLeaves[index].isSelected = true;
      });
    } else {
      this.creditLeaves.forEach((element, index) => {
        this.creditLeaves[index].isSelected = false;
      });
    }
  }

  public carryForwaerdToAll(isChecked) {
    if (isChecked) {
      this.creditLeaves.forEach((element, index) => {
        this.creditLeaves[index].isCarryForward = true;
      });
    } else {
      this.creditLeaves.forEach((element, index) => {
        this.creditLeaves[index].isCarryForward = false;
      });
    }
  }

  public countSelected(lengthOff) {
    if (lengthOff == "isSelected") {
      this.isSelectedAll = (this.creditLeaves.filter(function (s) { return s.isSelected; }).length == this.creditLeaves.length) ? true : false
    } else if (lengthOff == "isCarryForward") {
      this.isCarryForwardAll = (this.creditLeaves.filter(function (s) { return s.isCarryForward; }).length == this.creditLeaves.length) ? true : false

    }
  }

  public getUsers(financialYearId: number) {
    if (financialYearId && financialYearId != 0) {
      // implemente service
      if (this.isEdit) {
        this.getToUpdate(financialYearId);
      } else {
        this.getToAdd(financialYearId);
      }
    } else {
      this.creditLeaves = [];
    }

  }

  public onSubmit() {
    if (this.creditLeaves.filter(function (s) { return s.isSelected; }).length == 0) {
      return alert("Please select at least one row");
    }

    else if (this.creditLeaves.filter(function (s) { return s.leaveCount; }).length == 0) {
      return alert("Please select at least one row");
    }
    else {
      if (this.isEdit) {
        this.updateCreditLeaves();
      } else
        this.addcreditLeaves();
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

  private getToAdd(financialYearId: number) {
    this.SetLoading(true);
    this.creditLeaveService.getByFinancialYear(financialYearId).subscribe(response => {
      if (response) {
        this.creditLeaves = response;
        this.countSelected("isSelected");
        this.countSelected("isCarryForward");
      }
      this.SetLoading(false);
    }, error => {
      console.error("Something went wrong unable to get users :: " + error.error);
      this.SetLoading(false);
    });
  }

  private getToUpdate(financialYearId: number) {
    this.SetLoading(true);
    this.creditLeaveService.getToUpdate(financialYearId).subscribe(response => {
      if (response) {
        this.creditLeaves = response;
        this.countSelected("isSelected");
        this.countSelected("isCarryForward");
      }
      this.SetLoading(false);
    }, error => {
      console.error("Something went wrong unable to get users :: " + error.error);
      this.SetLoading(false);
    });
  }

  private addcreditLeaves() {
    let formData = this.creditLeaves.filter(x => x.isSelected == true);

    this.creditLeaveService.creditLeaves(formData).subscribe(response => {
      if (response) {
        this.SetLoading(true);

        alert("Leaves credited successfully");
      }
      this.SetLoading(false);
      this.getCreditedLeaves();
    }, error => {
      this.SetLoading(false);
      console.error("Something went wrong unable to load years:: " + error.error);
    });
  }

  private updateCreditLeaves() {
    this.SetLoading(true);
    let formData = this.creditLeaves.filter(x => x.isSelected == true);
    this.creditLeaveService.update(formData).subscribe(response => {
      if (response) {
        alert("Leaves credited successfully");
      }
      this.getCreditedLeaves();
      this.SetLoading(false);
    }, error => {
      this.SetLoading(false);
      console.error("Something went wrong unable to load years:: " + error.error);
    });
  }

}
