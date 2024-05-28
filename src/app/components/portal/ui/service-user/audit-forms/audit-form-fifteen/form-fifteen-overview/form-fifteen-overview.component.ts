import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormFifteenService } from 'src/app/services/form-fifteen.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { MedicationSpotCheck } from 'src/app/shared/models/medication-spot-check';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-fifteen-overview',
  templateUrl: './form-fifteen-overview.component.html',
  styleUrls: ['./form-fifteen-overview.component.scss']
})
export class FormFifteenOverviewComponent extends BaseComponent implements OnInit {
  @Input() serviceUserData: PatientAdmission;
  @Output() hideForms: EventEmitter<any> = new EventEmitter<any>();

  public createAudit: boolean = false;
  public medicationSpotChecks: Array<MedicationSpotCheck> = [];
  public formFifteenData: MedicationSpotCheck;
  public showAuditForm: boolean = false;
  public baseUrl: string = environment.baseUrl + 'PdfGenerator/DownloadForm15/';

  constructor(private formFifteenService: FormFifteenService) {
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
    this.formFifteenService.getForms(this.serviceUserData.id).subscribe(
      (response) => {
        if (response.length > 0) {
          this.medicationSpotChecks = response;
          this.formFifteenData = null;
        } else {
          this.medicationSpotChecks = [];
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
    this.formFifteenData = formData;
  }

  public showForm(formData) {
    this.createAudit = false;
    this.showAuditForm = true;
    this.formFifteenData = formData;
  }

  public removeForm(formId) {
    if (confirm('Are you sure you want to remove this?')) {
      this.SetLoading(true);
      this.formFifteenService.deleteForm(formId).subscribe(
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
