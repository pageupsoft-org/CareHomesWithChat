import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormSeventeenService } from 'src/app/services/form-seventeen.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { WeeklyMedicationStockCheck } from 'src/app/shared/models/weekly-medication-stock-check';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-seventeen-overview',
  templateUrl: './form-seventeen-overview.component.html',
  styleUrls: ['./form-seventeen-overview.component.scss'],
})
export class FormSeventeenOverviewComponent extends BaseComponent implements OnInit {
  @Input() serviceUserData: PatientAdmission;
  @Output() hideForms: EventEmitter<any> = new EventEmitter<any>();

  public createAudit: boolean = false;
  public medicationStockChecks: Array<WeeklyMedicationStockCheck> = [];
  public formSeventeenData: WeeklyMedicationStockCheck;
  public showAuditForm: boolean = false;
  public baseUrl: string = environment.baseUrl + 'PdfGenerator/DownloadForm17/';

  constructor(private formSeventeenService: FormSeventeenService) {
    super();
  }

  ngOnInit(): void {
    if (!this.serviceUserData) {
      return;
    }
    this.getForms();
  }

  public getForms() {
    this.SetLoading(true);
    this.createAudit = false;
    this.showAuditForm = false;
    this.formSeventeenData = null;
    this.formSeventeenService.getForms(this.serviceUserData.id).subscribe(
      (response) => {
        if (response.length > 0) {
          this.medicationStockChecks = response;
        }
        this.SetLoading(false);
      },
      (err) => {
        this.SetLoading(false);
        alert(err.error);
      }
    );
  }

  public editForm(formData) {
    this.createAudit = true;
    this.showAuditForm = false;
    this.formSeventeenData = formData;
  }

  public showForm(formData) {
    // alert('this feature is unavailable for now');
    // return;
    this.createAudit = false;
    this.showAuditForm = true;
    this.formSeventeenData = formData;
  }

  public removeForm(formId) {
    if (confirm('Are you sure you want to remove this?')) {
      this.SetLoading(true);
      this.formSeventeenService.deleteForm(formId).subscribe(
        (response) => {
          if (response) {
            alert('Form deleted successfully');
            this.getForms();
          }
          this.SetLoading(false);
        },
        (err) => {
          this.SetLoading(false);
          alert(err.error);
        }
      );
    }
  }

  public goBack() {
    this.hideForms.emit();
  }
}
