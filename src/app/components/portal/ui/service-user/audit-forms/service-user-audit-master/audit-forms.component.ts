import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';

@Component({
  selector: 'app-audit-forms',
  templateUrl: './audit-forms.component.html',
  styleUrls: ['./audit-forms.component.scss']
})
export class AuditFormsComponent extends BaseComponent implements OnInit {
  @Input() auditType: number;
  @Input() serviceUserData: PatientAdmission;

  public formNo: any = 0;
  public showForm = true;

  constructor() { super() }

  ngOnInit(): void {
    if (!this.serviceUserData) {
      return;
    }
    // this.SetLoading(true);
    this.showForm = false;
  }

  public hideForms() {
    this.showForm = false;
    this.formNo = 0;
  }

  public openForm(formNumber: number) {
    this.formNo = formNumber;
    this.showForm = true;

  }


}
