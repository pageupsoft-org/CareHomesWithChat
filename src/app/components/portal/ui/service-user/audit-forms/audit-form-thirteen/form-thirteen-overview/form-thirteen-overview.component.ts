import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormThirteenService } from 'src/app/services/form-thirteen.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { MedicationAudit } from 'src/app/shared/models/medication-audit';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-thirteen-overview',
  templateUrl: './form-thirteen-overview.component.html',
  styleUrls: ['./form-thirteen-overview.component.scss'],
})
export class FormThirteenOverviewComponent
  extends BaseComponent
  implements OnInit {
  @Input() serviceUserData: PatientAdmission;

  @Output() hideForms: EventEmitter<any> = new EventEmitter<any>();

  public createAudit: boolean = false;
  public filledForms: Array<MedicationAudit> = [];
  public formThirteenData: any;
  public showAuditForm: boolean = false;
  public baseUrl: string = environment.baseUrl + 'PdfGenerator/DownloadForm13/';

  constructor(private formThirteenService: FormThirteenService) {
    super();
  }

  ngOnInit(): void {
    if (!this.serviceUserData) {
      return;
    }
    this.getFormsThirteen();
  }

  public getFormsThirteen() {
    this.SetLoading(true);
    this.createAudit = false;
    this.showAuditForm = false;
    this.formThirteenData = null;
    this.formThirteenService.getForms(this.serviceUserData.id).subscribe(
      (response) => {
        if (response.length > 0) {
          this.filledForms = response;
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
    this.formThirteenData = formData;
  }

  public showForm(formData) {
    this.createAudit = false;
    this.showAuditForm = true;
    this.formThirteenData = formData;
  }

  public removeForm(formId) {
    if (confirm('Are you sure you want to remove this?')) {
      this.SetLoading(true);
      this.formThirteenService.deleteForm(formId).subscribe(
        (response) => {
          if (response) {
            alert('Form deleted successfully');
            this.getFormsThirteen();
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
