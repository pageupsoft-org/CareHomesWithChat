import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LocationAlertService } from 'src/app/services/location-alert.service';
import { PatientAlertService } from 'src/app/services/patient-alert.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { LocationAlert } from 'src/app/shared/models/location-alerts';
import { PatientAlert } from 'src/app/shared/models/patient-alert';
import { DialogResult } from 'src/app/util/DialogResult ';
import { AddPatientAlertModalComponent } from '../add-patient-alert-modal/add-patient-alert-modal.component';
import { EditPatientAlertModalComponent } from '../edit-patient-alert-modal/edit-patient-alert-modal.component';

@Component({
  selector: 'app-patient-alerts-master',
  templateUrl: './patient-alerts-master.component.html',
  styleUrls: ['./patient-alerts-master.component.scss'],
})
export class PatientAlertsMasterComponent
  extends BaseComponent
  implements OnInit
{
  @ViewChild('patientAlertModal')
  patientAlertModal: AddPatientAlertModalComponent;
  @ViewChild('patientAlertEditModal')
  patientAlertEditModal: EditPatientAlertModalComponent;
  @Input() locationId: number;

  public patientAlertList: Array<PatientAlert> = [];
  public patientList: Array<PatientAlert> = [];
  public alertList: Array<LocationAlert> = [];
  public status: boolean = true;
  public alertId: number=0;

  constructor(
    private patientAlertService: PatientAlertService,
    private locationAlertService: LocationAlertService
  ) {
    super();
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.locationId) {
      this.getAllAlertts();
      this.getAllPatientAlert();
    }
  }

  public addPatientAlert() {
    this.patientAlertModal.showModal().then((result: DialogResult) => {
      if (result == DialogResult.Confirmed) {
        this.getAllPatientAlert();
      }else{
        this.getAllPatientAlert();
      }
    });
  }

  public editPatientAlert(patientAlert) {
    this.patientAlertEditModal
      .showModal(patientAlert)
      .then((result: DialogResult) => {
        if (result == DialogResult.Confirmed) {
          this.getAllPatientAlert();
        }
      });
  }

  public remove(patientAlertId: number) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.SetLoading(true);
      this.patientAlertService.deletePatientAlert(patientAlertId).subscribe(
        (response) => {
          if (response) {
            alert('Successfully  removed');
            this.getAllPatientAlert();
          }
          this.SetLoading(false);
        },
        (err) => {
          alert(err.error);
          this.SetLoading(false);
        }
      );
    }
  }

  public getLocationName(locationAlertId: number) {
    if (locationAlertId) {
      if (this.alertList.find((x) => x.id == locationAlertId)) {
        let name;

        name = this.alertList.find((x) => x.id == locationAlertId).name;
        return name;
      } else {
        return '-';
      }
    }
  }

  public turnOffAlert(patientAlert: PatientAlert) {
    if (confirm('Are you sure you want to off this alert?')) {
      this.SetLoading(true);
      patientAlert.status = false;
      this.patientAlertService.updatePatientAlert(patientAlert).subscribe(
        (response) => {
          if (response) {
            alert('Successfully off');
            this.getAllPatientAlert();
          }
          this.SetLoading(false);
        },
        (err) => {
          alert(err.error);
          this.SetLoading(false);
        }
      );
    }
  }

  public filterRecord(alertId, status: boolean) {
    this.SetLoading(true);
    if (alertId && alertId !=0) {
      this.patientList = [...this.patientAlertList.filter(
        (x) => x.locationAlertId == alertId && x.status == status
      )];
    } else {
      this.patientList = [...this.patientAlertList.filter(
        (x) => x.status == status
      )];
    }
    this.SetLoading(false);
  }

  private getAllPatientAlert() {
    this.SetLoading(true);
    this.patientAlertService.getPatientByLocation(this.locationId).subscribe(
      (response) => {
        if (response.length >0) {
          this.patientAlertList = [...response];
          this.filterRecord(this.alertId, this.status);
        }
        this.SetLoading(false);
      },
      (err) => {
        alert(err.error);
        this.SetLoading(false);
      }
    );
  }

  private getAllAlertts() {
    this.SetLoading(true);
    this.locationAlertService.getAlerts(this.locationId).subscribe(
      (response) => {
        if (response.length > 0) {
          this.alertList = response;
        }
      },
      (err) => {
        console.error(err.error);
      });
  }
}
