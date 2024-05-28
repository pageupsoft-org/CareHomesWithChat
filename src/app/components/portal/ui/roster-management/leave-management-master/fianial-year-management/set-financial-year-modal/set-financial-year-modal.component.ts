import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FinancialYearService } from 'src/app/services/roster/financial-year.service';
import { FinancialYear } from 'src/app/shared/models/leave-management/financial-year';
import { DialogResult } from 'src/app/util/DialogResult ';

@Component({
  selector: 'app-set-financial-year-modal',
  templateUrl: './set-financial-year-modal.component.html',
  styleUrls: ['./set-financial-year-modal.component.scss']
})
export class SetFinancialYearModalComponent implements OnInit {
  @ViewChild("setYearModal") setYearModal: ModalDirective;

  private callback: any;
  public id: number = 0;
  public financialYears: Array<FinancialYear> = [];

  constructor(private financialYearService: FinancialYearService) { }

  ngOnInit(): void {
  }


  public showModal(): Promise<DialogResult> {
    let promise = new Promise<DialogResult>((resolve) => {
      this.callback = resolve;
    });
    this.getFinancilaYears();
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.setYearModal.show();
    return promise;
  }


  public onSubmit() {
    if (window.confirm('Are sure you want to change current financial year?')) {
      if (!this.id || this.id == 0) {
        return alert("Please select financial year")
      }
      this.financialYearService.setFinancialYear(this.id).subscribe(response => {
      this.setYearModal.hide();
        this.callback(DialogResult.Confirmed);
      },
        error => {
          alert(error.error);
          console.error(error);
        })
    }
  }

  public cancel() {
    this.setYearModal.hide();
    if (this.callback != null) {
      this.callback(DialogResult.Canceled);
    }
  }

  getFinancilaYears() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.financialYearService.getFinancialYears().subscribe(response => {
      this.financialYears = response;
    }, err => {
      alert(err.error);
    })
  }

}
