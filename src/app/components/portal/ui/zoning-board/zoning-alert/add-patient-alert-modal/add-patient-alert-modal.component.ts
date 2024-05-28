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
import { DialogResult } from 'src/app/util/DialogResult ';

@Component({
  selector: 'app-add-patient-alert-modal',
  templateUrl: './add-patient-alert-modal.component.html',
  styleUrls: ['./add-patient-alert-modal.component.scss'],
})
export class AddPatientAlertModalComponent
  extends BaseComponent
  implements OnInit
{
  @ViewChild('patientAlertModal') patientAlertModal: ModalDirective;
  @Input() locationId: number;

  private callback: any;
  public patientAlertForm: FormGroup;
  public patientAlert: PatientAlert;
  public isEdit: boolean = false;
  public patientList: any;
  public alertList: Array<LocationAlert> = [];
  public patientLocationId: number;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private locationAlertService: LocationAlertService,
    private patientAlerService: PatientAlertService
  ) {
    super();
  }

  ngOnInit(): void {}

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

    this.patientAlertForm = this.fb.group({
      id: [0],
      patientId: ['', Validators.compose([Validators.required])],
      locationId: [9],
      careHomeId: [
        Number(JSON.parse(localStorage.getItem('_identity')).careHomeId),
      ],

      updatedBy: [null],
      updatedAt: [null],
      alerts: this.fb.array([this.addAlerts()]),
    });

    this.isBusy = false;
    this.patientAlertModal.show();
    return promise;
  }

  public cancel() {
    this.patientAlertModal.hide();
    if (this.callback != null) {
      this.callback(DialogResult.Canceled);
    }
  }

  public addAlertButtonClick(alert?: any): void {
    if (alert) {
      (<FormArray>this.patientAlertForm.get('alerts')).push(
        this.addAlerts(alert)
      );
    } else {
      if ((<FormArray>this.patientAlertForm.get('alerts')).length < 3) {
        (<FormArray>this.patientAlertForm.get('alerts')).push(this.addAlerts());
      } else {
      }
    }
  }

  public removeAlert(i: number) {
    (<FormArray>this.patientAlertForm.get('alerts')).removeAt(i);
    if ((<FormArray>this.patientAlertForm.get('alerts')).length == 0) {
      this.addAlertButtonClick();
    } else {
    }
  }

  public getPatientLocation(event) {
    this.patientLocationId = this.patientList.find(
      (x) => x.id == this.patientAlertForm.value.patientId
    ).locationId;
  }

  public alertValidation(event: any, index: number) {

    if (this.patientAlertForm.value.alerts.length > 1) {
      this.patientAlertForm.value.alerts.forEach((element, i) => {
        if (event.target.value == element.locationAlertId && i != index) {
         
          (<FormArray>this.patientAlertForm.get('alerts')).at(index)['controls']['locationAlertId'].setValue('');
          window.alert('This Alert already selected');
        }
      });
      return false;
    }
  }

  public onSubmit(form: PatientAlert) {
    this.patientAlertForm.value.alerts.forEach((element) => {
      this.patientAlert = new PatientAlert();
      this.patientAlert.patientId = form.patientId;
      this.patientAlert.locationAlertId = element.locationAlertId;
      this.patientAlert.startDate = element.startDate;
      this.patientAlert.endDate = element.endDate;
      this.patientAlert.status = element.status;
      this.patientAlert.createdAt = element.createdAt;
      this.patientAlert.createdBy = element.createdBy;
      this.patientAlert.careHomeId = Number(
        JSON.parse(localStorage.getItem('_identity')).careHomeId
      );
      this.patientAlert.locationId = this.locationId;
      this.addPatientAlert(this.patientAlert);
    });

    this.patientAlertModal.hide();
    this.callback(DialogResult.Confirmed);
    // this.patientAlert.
  }

  public dateValidation(index: number) {
    let alert = (<FormArray>this.patientAlertForm.get('alerts')).at(index);

    if (!alert['controls']['startDate'].value) {
      window.alert('Please Select start Date First');
      alert['controls']['endDate'].setValue('');

      return;
    }
    let startDate = new Date(alert['controls']['startDate'].value);
    let endDate = new Date(alert['controls']['endDate'].value);

    var time = endDate.getTime() - startDate.getTime();
    var days = time / (1000 * 3600 * 24); //Diference in Days

    if (Math.round(days) <= 0) {
      window.alert('Please Select proper dates');
      alert['controls']['endDate'].setValue('');
    }
  }

  private addPatientAlert(form) {
    this.patientAlerService.addPatientAlert(form).subscribe(
      (response) => {
        if (response) {
        }
      },
      (err) => {
        alert(err.error);
      }
    );
  }

  private addAlerts(alert?: any): FormGroup {
    if (alert) {
      return this.fb.group({
        locationAlertId: ['', Validators.compose([Validators.required])],
        startDate: [null, Validators.compose([Validators.required])],
        endDate: [null, Validators.compose([Validators.required])],
        status: [true],
        createdBy: [
          Number(JSON.parse(localStorage.getItem('_identity')).id),
          Validators.compose([Validators.required]),
        ],
        createdAt: [
          new Date() ? formatDate(new Date(), 'yyyy-MM-dd', 'en') : null,
        ],
      });
    } else {
      return this.fb.group({
        locationAlertId: ['', Validators.compose([Validators.required])],
        startDate: [null, Validators.compose([Validators.required])],
        endDate: [null, Validators.compose([Validators.required])],
        status: [true],
        createdBy: [
          Number(JSON.parse(localStorage.getItem('_identity')).id),
          Validators.compose([Validators.required]),
        ],
        createdAt: [
          new Date() ? formatDate(new Date(), 'yyyy-MM-dd', 'en') : null,
        ],
      });
    }
  }

  private getPatients() {
    this.SetLoading(true);
    this.patientService.getPatients(this.locationId).subscribe(
      (response) => {
        if (response) {
          this.patientList = Object.keys(response).map((key) => ({
            id: key,
            name: response[key],
          }));
        }
        this.SetLoading(false);
      },
      (error) => {
        alert(error.error);
        this.SetLoading(false);
      }
    );
  }

  private getAllAlerts() {
    this.locationAlertService.getAlerts(this.locationId).subscribe(
      (response) => {
        if (response.length > 0) {
          this.alertList = response;
        }
      },
      (err) => {
        console.error(err.error);
      }
    );
  }
}
