import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MedicationService } from 'src/app/services/medication.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { Medication } from 'src/app/shared/models/medication';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.scss']
})
export class MedicationComponent extends BaseComponent implements OnInit {
  @Input() userData: any;
  @Input() medicationData: Medication;
  @Input() isReload: boolean;
  @Output() getMedications: EventEmitter<any> = new EventEmitter<any>();

  public usersList: Array<User> = [];
  public medicationForm: FormGroup;
  public showNotification: boolean = false;
  private isEdit: boolean = false;


  constructor(private fb: FormBuilder, private userService: UserService, private medicationService: MedicationService) {
    super();
  }

  ngOnInit(): void {

    if (!this.userData) {
      this.showNotification = true;
      return;
    }
    if (this.medicationData) {
      this.isEdit = true;
      this.getMedication(this.medicationData.id);
    } else {
      this.medicationForm = this.fb.group({
        id: [0],
        patientId: [this.userData.id, Validators.compose([Validators.required])],
        depotType: ['', Validators.compose([Validators.required, Validators.minLength(2),Validators.maxLength(250)])],
        dose: ['', Validators.compose([Validators.required, Validators.minLength(2),Validators.maxLength(250)])],
        strength: ['', Validators.compose([Validators.required, Validators.minLength(2),Validators.maxLength(250)])],
        frequency: ['', Validators.compose([Validators.required, Validators.minLength(2),Validators.maxLength(250)])],
        prescriber: ['', Validators.compose([Validators.required, Validators.minLength(2),Validators.maxLength(250)])],
        startDate: [null, Validators.compose([Validators.required])],
        endDate: [null, Validators.compose([Validators.required])],
        createdBy: [Number(JSON.parse(localStorage.getItem('_identity')).id), Validators.compose([Validators.required])],
        createdDate: [(new Date()) ? formatDate(new Date(), 'yyyy-MM-dd', 'en') : null],
        medicationInfos: this.fb.array([
          this.addMedicationInfo()
        ]),
      });
    }
    this.getUsers();
  }

  public addMedicationInfo(medicationInfo?: any): FormGroup {
    if (medicationInfo) {
      return this.fb.group({
        id: [medicationInfo.id],
        dueDate: [(medicationInfo.dueDate) ? formatDate(medicationInfo.dueDate, 'yyyy-MM-dd', 'en') : null],
        dateGiven: [(medicationInfo.dateGiven) ? formatDate(medicationInfo.dateGiven, 'yyyy-MM-dd', 'en') : null],
        locationAdministered: [medicationInfo.locationAdministered],
        userId: [medicationInfo.userId],
        isFinished: [medicationInfo.isFinished]
      })
    }
    else {
      return this.fb.group({
        id: [0],
        dueDate: [null, Validators.compose([Validators.required])],
        dateGiven: [null, Validators.compose([Validators.required])],
        locationAdministered: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(250)])],
        userId: ['', Validators.compose([Validators.required])],
        isFinished: [false]
      })
    }
  }

  public addMedicationButtonClick(medicationInfo?: any): void {
    if (medicationInfo) {
      (<FormArray>this.medicationForm.get('medicationInfos')).push(this.addMedicationInfo(medicationInfo));
    }
    else {
      (<FormArray>this.medicationForm.get('medicationInfos')).push(this.addMedicationInfo());
    }
  }

  public removeMedicationInfo(i: number) {
    (<FormArray>this.medicationForm.get('medicationInfos')).removeAt(i);
    if ((<FormArray>this.medicationForm.get('medicationInfos')).length == 0) {
      this.addMedicationButtonClick();
    }
  }

  public onSubmit(form: Medication) {
    if (this.isEdit) {
      this.updateMedication(form);
    } else {
      this.addMedication(form);
    }

  }

  public getMedicationList() {
    if (this.isReload) {
      location.reload();
    } else
      this.getMedications.emit();
  }

  public checkDateValidation() {
    if (this.medicationForm.controls['startDate'].value && this.medicationForm.controls['endDate'].value) {
      let sDate = new Date(this.medicationForm.controls['startDate'].value);
      let eDate = new Date(this.medicationForm.controls['endDate'].value);
      if (sDate > eDate) {
        alert("End Date must be less than Start Date");
        this.medicationForm.controls['endDate'].setValue(null);
      }
    }
  }

  private getUsers() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe(response => {
      if (response) {
        this.usersList = response;
      }
    }, err => {
      console.error("could not fetch users::" + err.error);
    })
    // this.isBusy = false;
  }

  private addMedication(form) {
    this.SetLoading(true);
    this.medicationService.addMedication(form).subscribe(response => {
      if (response) {
        alert("Medication added successfully");
        this.getMedicationList();
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private updateMedication(form) {
    this.SetLoading(true);
    this.medicationService.updateMedication(form).subscribe(response => {
      if (response) {
        alert("Medication updated successfully");
        this.getMedicationList();
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getMedication(medicationId) {
    this.SetLoading(true);
    this.medicationService.getMedication(medicationId).subscribe(response => {
      if (response) {
        this.medicationForm = this.fb.group({
          id: [response.id],
          patientId: [this.userData.id, Validators.compose([Validators.required])],
          depotType: [response.depotType, Validators.compose([Validators.required, Validators.minLength(2)])],
          dose: [response.dose, Validators.compose([Validators.required, Validators.minLength(2)])],
          strength: [response.strength, Validators.compose([Validators.required, Validators.minLength(2)])],
          frequency: [response.frequency, Validators.compose([Validators.required, Validators.minLength(2)])],
          prescriber: [response.prescriber, Validators.compose([Validators.required, Validators.minLength(2)])],
          startDate: [(response.startDate) ? formatDate(response.startDate, 'yyyy-MM-dd', 'en') : null, Validators.compose([Validators.required])],
          endDate: [(response.endDate) ? formatDate(response.endDate, 'yyyy-MM-dd', 'en') : null, Validators.compose([Validators.required])],
          createdBy: [Number(JSON.parse(localStorage.getItem('_identity')).id), Validators.compose([Validators.required])],
          createdDate: [response.createdDate],
          medicationInfos: this.fb.array([])
        });
        if (response.medicationInfos) {
          response.medicationInfos.forEach(element => {
            this.addMedicationButtonClick(element);
          });

        }
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

}
