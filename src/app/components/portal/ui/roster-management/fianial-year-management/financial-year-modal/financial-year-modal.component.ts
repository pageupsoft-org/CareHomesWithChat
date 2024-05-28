import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FinancialYearService } from 'src/app/services/roster/financial-year.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { FinancialYear } from 'src/app/shared/models/leave-management/financial-year';
import { DialogResult } from 'src/app/util/DialogResult ';

@Component({
  selector: 'app-financial-year-modal',
  templateUrl: './financial-year-modal.component.html',
  styleUrls: ['./financial-year-modal.component.scss']
})
export class FinancialYearModalComponent extends BaseComponent implements OnInit {

  @ViewChild("financialYearModal") financialYearModal: ModalDirective;

  financialYearForm: FormGroup;
  isEdit: boolean = false;
  private callback: any;


  constructor(private fb: FormBuilder, private financialYearService: FinancialYearService) { super(); }

  ngOnInit(): void {
  }

  public showModal(financialYear: FinancialYear = null): Promise<DialogResult> {
    let promise = new Promise<DialogResult>((resolve) => {
      this.callback = resolve;
    });
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    if (financialYear) {
      this.isEdit = true;
      this.financialYearForm = this.fb.group({
        id: [financialYear.id],
        financialYearName: [financialYear.financialYearName, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10)])],
        careHomeId: [financialYear.careHomeId],
        createdAt: [financialYear.createdAt],
        createdBy: [financialYear.createdBy],
        isActive: [true],
        updatedAt: [new Date()],
        updatedBy: [this.currentUserId],
      });
    } else {

      this.financialYearForm = this.fb.group({
        id: [0],
        financialYearName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10)])],
        careHomeId: [careHomeId],
        isActive: [true],
        createdAt: [new Date()],
        createdBy: [this.currentUserId],
      });
    }
    this.financialYearModal.show();
    return promise;
  }


  onSubmit() {
    if (this.isEdit) {
      this.editYear();
    }
    else {
      this.addYear();
    }
  }

  public cancel() {
    this.financialYearModal.hide();
    if (this.callback != null) {
      this.callback(DialogResult.Canceled);
    }
  }

  private addYear() {
    this.financialYearService.addFinancialYear(this.financialYearForm.value).subscribe(response => {
      alert("Financial year created successfully");
      this.financialYearModal.hide();
      this.callback(DialogResult.Confirmed);

    },
      err => {
        alert(err.error);
      })
  }

  private editYear() {
    this.financialYearService.updateFinancialYear(this.financialYearForm.value).subscribe(res => {

      alert("Financial year updated successfully");
      this.financialYearForm.reset();
      this.financialYearModal.hide();
      this.callback(DialogResult.Confirmed);
    }, error => {
      alert(error.error);
    });
  }


}
