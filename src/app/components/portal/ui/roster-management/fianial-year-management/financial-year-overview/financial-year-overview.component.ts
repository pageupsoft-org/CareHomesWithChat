import { Component, OnInit, ViewChild } from '@angular/core';
import { FinancialYearService } from 'src/app/services/roster/financial-year.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { FinancialYear } from 'src/app/shared/models/leave-management/financial-year';
import { DialogResult } from 'src/app/util/DialogResult ';
import { SetFinancialYearModalComponent } from '../../leave-management-master/fianial-year-management/set-financial-year-modal/set-financial-year-modal.component';
import { FinancialYearModalComponent } from '../financial-year-modal/financial-year-modal.component';

@Component({
  selector: 'app-financial-year-overview',
  templateUrl: './financial-year-overview.component.html',
  styleUrls: ['./financial-year-overview.component.scss']
})
export class FinancialYearOverviewComponent extends BaseComponent implements OnInit {
  @ViewChild('financialYearModal') financialYearModal: FinancialYearModalComponent;
  @ViewChild('setYearModal') setYearModal: SetFinancialYearModalComponent;

  public financialYears: Array<FinancialYear> = [];

  constructor(private financialYearService: FinancialYearService) { super(); }

  ngOnInit(): void {
    this.getFinancilaYears();
  }

  getFinancilaYears() {
    this.SetLoading(true);
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.financialYearService.getFinancialYears().subscribe(response => {
      this.financialYears = response;
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  remove(id: number) {
    if (window.confirm('Are sure you want to delete this?')) {
      this.financialYearService.deleteFinancialYear(id).subscribe(response => {
        this.getFinancilaYears();
      },
        error => {
          alert(error.error);
          console.error(error);
        })
    }
  }

  addFinancialYear() {
    this.financialYearModal.showModal().then((result: DialogResult) => {
      if (result == DialogResult.Confirmed) {
        this.getFinancilaYears();
      }
    });
  }
 
  setFinancialYear() {
    this.setYearModal.showModal().then((result: DialogResult) => {
      if (result == DialogResult.Confirmed) {
        this.getFinancilaYears();
      }
    });
  }

  editFinancialYear(FinancialYear: FinancialYear) {
    this.financialYearModal.showModal(FinancialYear).then((result: DialogResult) => {
      if (result == DialogResult.Confirmed) {
        this.getFinancilaYears();
      }
    });
  }
}
