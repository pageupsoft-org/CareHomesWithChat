import { Component, Input, OnInit } from '@angular/core';
import { MedicationService } from 'src/app/services/medication.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { Medication } from 'src/app/shared/models/medication';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';

@Component({
  selector: 'app-medication-overview',
  templateUrl: './medication-overview.component.html',
  styleUrls: ['./medication-overview.component.scss']
})
export class MedicationOverviewComponent extends BaseComponent implements OnInit {
  @Input() userData: PatientAdmission;

  public showNotification: boolean = false;
  public medicationList: Array<Medication> = [];
  public showMedicationList: Boolean = true;
  public showMedication: Boolean = false;
  public medicationData: Medication;

  constructor(private medicationService: MedicationService) { super(); }

  ngOnInit(): void {
    if (!this.userData) {
      this.showNotification = true;
      return;
    }
    this.SetLoading(true);
    this.getMedications();
  }

  public getMedications() {
    this.SetLoading(true);
    this.showMedication = false;
    this.showMedicationList = true;
    this.medicationService.getMedications(this.userData.id).subscribe(response => {
      if (response.length > 0) {
        this.medicationList = response.sort((a, b) => {
          if (a.id < b.id) {
            return 1
          }
          if (a.id > b.id) {
            return -1
          }
          return 0
        });
      } else {
        this.medicationList = [];
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    });
  }

  public createMedication() {
    this.showMedication = false;
    this.showMedicationList = false;
    this.medicationData = null
  }

  public editMedication(medication: Medication) {
    this.medicationData = medication;
    this.showMedicationList = false
    this.showMedication = false;
  }

  public removeMedication(medicationId: number) {
    if (medicationId) {

      if (confirm("Are you sure you want to remove this record?")) {
        this.SetLoading(true);
        this.medicationService.removeMedication(medicationId).subscribe(response => {
          if (response) {
            alert("Record deleted successfully");
            this.getMedications();
          }
          this.SetLoading(false);
        }, err => {
          this.SetLoading(false);
          alert(err.error);
        })
      }
    }
  }

  public viewMedication(medication: Medication) {
    this.medicationData = medication;
    this.showMedicationList = false
    this.showMedication = true;
  }




}
