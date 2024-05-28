import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MedicationService } from 'src/app/services/medication.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { CirculatedTo } from 'src/app/shared/enums/circulated-to.enum';
import { Medication } from 'src/app/shared/models/medication';
import { User } from 'src/app/shared/models/user';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-show-medication',
  templateUrl: './show-medication.component.html',
  styleUrls: ['./show-medication.component.scss']
})
export class ShowMedicationComponent extends BaseComponent implements OnInit {
  @Input() userData: any;
  @Input() medicationData: Medication;
  @Output() getMedications: EventEmitter<any> = new EventEmitter<any>();

  public usersList: Array<User> = [];
  public circulatedToArray: Array<any>;
  public circulatedToEnum = CirculatedTo;
  public circulateTo: Array<number> = [];
  public medicationForm: FormGroup;
  public showNotification: boolean = false;
  private isEdit: boolean = false;


  constructor(private fb: FormBuilder, private userService: UserService, private medicationService: MedicationService) {
    super();
  }

  ngOnInit(): void {

    if (this.medicationData) {
      this.isEdit = true;
      this.getMedication(this.medicationData.id);
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
        locationAdministered: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
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

  public getMedicationList() {
    this.getMedications.emit();
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
      alert(err.error);
      this.SetLoading(false);
    })
  }

}
