import { formatDate } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LocationAlertService } from 'src/app/services/location-alert.service';
import { PatientAlertService } from 'src/app/services/patient-alert.service';
import { PatientService } from 'src/app/services/patient.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { LocationAlert } from 'src/app/shared/models/location-alerts';
import { PatientAlert } from 'src/app/shared/models/patient-alert';
import { RecordFilterParameter } from 'src/app/shared/models/RecordFilterParameter';
import { DialogResult } from 'src/app/util/DialogResult ';

@Component({
  selector: 'app-edit-patient-alert-modal',
  templateUrl: './edit-patient-alert-modal.component.html',
  styleUrls: ['./edit-patient-alert-modal.component.scss']
})
export class EditPatientAlertModalComponent extends BaseComponent implements OnInit {
  @ViewChild("patientAlertEditModal") patientAlertEditModal: ModalDirective;
  @Input() locationId: number;

  private callback: any;
  public patientAlertForm: FormGroup;
  public isEdit: boolean = false;
  public patientList: any;
  public alertList: Array<LocationAlert> = [];
  public patientLocationId: number;


  constructor(private fb: FormBuilder, private patientService: PatientService, private locationAlertService: LocationAlertService, private patientAlerService: PatientAlertService) { super() }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.locationId) {
      this.getAllAlerts();
      this.getPatients();
    }

  }

  public showModal(patientAlert: PatientAlert = null): Promise<DialogResult> {
    let promise = new Promise<DialogResult>((resolve) => {
      this.callback = resolve;
    });

    if (patientAlert) {
      this.patientAlertForm = this.fb.group({
        id: [patientAlert.id],
        patientId: [patientAlert.patientId, Validators.compose([Validators.required])],
        locationId: [patientAlert.locationId],
        careHomeId: [patientAlert.careHomeId],
        locationAlertId: [patientAlert.locationAlertId, Validators.compose([Validators.required])],
        startDate: [(patientAlert.startDate) ? formatDate(patientAlert.startDate, 'yyyy-MM-dd', 'en') : null, Validators.compose([Validators.required])],
        endDate: [(patientAlert.endDate) ? formatDate(patientAlert.endDate, 'yyyy-MM-dd', 'en') : null, Validators.compose([Validators.required])],
        status: [true],
        createdBy: [patientAlert.createdBy],
        createdAt: [patientAlert.createdAt],
        updatedBy: [Number(JSON.parse(localStorage.getItem('_identity')).id)],
        updatedAt: [(new Date()) ? formatDate(new Date(), 'yyyy-MM-dd', 'en') : null],

      });
    }

    this.isBusy = false
    this.patientAlertEditModal.show();
    return promise;
  }

  public cancel() {
    this.patientAlertEditModal.hide();
    if (this.callback != null) {
      this.callback(DialogResult.Canceled);
    }
  }

  public getPatientLocation(event) {
    this.patientLocationId = this.patientList.find(x => x.id == this.patientAlertForm.value.patientId).locationId;
  }

  public checkAlert(event: any) {
    if (this.patientAlertForm.value.alerts.length > 1) {
      this.patientAlertForm.value.alerts.forEach(element => {
        
      });
      return false;
    }
  }

  public onSubmit(form: PatientAlert) {

    this.patientAlerService.updatePatientAlert(form).subscribe(response => {
      if (response) {
        alert("record updated successfully");
        this.patientAlertEditModal.hide();
        this.callback(DialogResult.Confirmed);
      }
    }, err => {
      alert(err.error);

    })
  }

  private getPatients() {
    this.SetLoading(true);
    this.patientService.getPatients(this.locationId).subscribe(response => {
      if (response) {
        this.patientList = Object.keys(response).map(key => ({ id: key, name: response[key] }));
      }
      this.SetLoading(false);
    }, error => {
      alert(error.error);
      this.SetLoading(false);
    });
  }

  private getAllAlerts() {

    this.locationAlertService.getAlerts(this.locationId).subscribe(response => {
      if (response.length > 0) {
        this.alertList = response;
      }
    },
    (err) => {
      console.error(err.error);
    });
  }
}
