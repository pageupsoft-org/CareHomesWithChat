import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LocationServices } from 'src/app/services/location.service';
import { ShiftManagementService } from 'src/app/services/roster/shift-management.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { DayOfWeek } from 'src/app/shared/enums/day-week.enum';
import { Location } from 'src/app/shared/models/location';
import { Constants } from 'src/app/util/Constants';
import { DialogResult } from 'src/app/util/DialogResult ';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-add-shift-modal',
  templateUrl: './add-shift-modal.component.html',
  styleUrls: ['./add-shift-modal.component.scss']
})
export class AddShiftModalComponent extends BaseComponent implements OnInit {
  @ViewChild('addShiftModal') addShiftModal: ModalDirective;

  public shiftForm: FormGroup;
  public today = new Date();
  public weekDays;
  public selectAll: boolean = false;
  public isEdit: boolean = false;
  public selectedDays: Array<number> = [];
  public locationList: Array<Location> = [];
  public callback: any;

  constructor(private locationService: LocationServices, private router: Router, private fb: FormBuilder, private shiftManagementService: ShiftManagementService) { super(); }

  ngOnInit(): void {
    this.getLocations();
    this.weekDays = EnumConverter.ConvertEnumToArray(DayOfWeek);

  }

  public showModal(shiftId?: number): Promise<DialogResult> {
    let promise = new Promise<DialogResult>((resolve) => {
      let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
      this.callback = resolve;
      this.selectAll = false;
      this.selectedDays= [];
      if (shiftId) {
        this.isEdit = true;
        this.getShift(shiftId);
      } else {
        this.isEdit = false;
        this.shiftForm = this.fb.group({
          id: [0],
          title: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])],
          weekDays: [''],
          startTime: ['', Validators.compose([Validators.required])],
          endTime: ['', Validators.compose([Validators.required])],
          startDate: ['', Validators.compose([Validators.required])],
          endDate: ['', Validators.compose([Validators.required])],
          locationId: ['', Validators.compose([Validators.required])],
          careHomeId: [careHomeId],
          createdAt: [new Date()],
          createdBy: [this.currentUserId]

        },
          {
            validator: [this.dateValidation('startDate', 'endDate'), this.timeValidation('startTime', 'endTime')]
          })
        this.addShiftModal.show();

      }
    })
    return promise;
  }

  public cancel() {
    this.addShiftModal.hide();
    if (this.callback != null) {
      this.callback(DialogResult.Canceled);
    }
  }

  public selectAllDays(isSeleceted: boolean) {
    this.selectedDays = [];
    if (isSeleceted) {
      this.selectedDays = [...this.weekDays.keys()];
 
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
  }

  public onSelect(isSeleceted, i) {
    if (isSeleceted) {
      this.selectedDays.push(i);
    } else {
      this.selectedDays = this.selectedDays.filter(x => x != i);
    }

    if (this.selectedDays.length == this.weekDays.length) {
      this.selectAll = true;
    } else
      this.selectAll = false;
  }

  public isChecked(value) {
    return this.selectedDays.includes(value);
  }

  public onSumbit() {
    if (this.isEdit) {
      this.updateShift();
    } else
      this.addShift();
  }

  private addShift() {
    this.SetLoading(true);
    this.shiftForm.controls['weekDays'].setValue(this.selectedDays);
    // console.log(this.shiftForm.value);
    // return;
    this.shiftManagementService.addShift(this.shiftForm.value).subscribe((response) => {
      if (response) {
        alert("Shift(s) added successfully");
        this.addShiftModal.hide();
        this.callback(DialogResult.Confirmed);
      }
      this.SetLoading(false);
    },
      (err) => {
        this.SetLoading(false);
        console.log(err.error);
      }
    );
  }

  private updateShift() {
    this.SetLoading(true);
    // console.log(this.shiftForm.value);
    // return;
    this.shiftManagementService.updateShift(this.shiftForm.value).subscribe((response) => {
      if (response) {
        alert("Shift(s) added successfully");
        this.addShiftModal.hide();
        this.callback(DialogResult.Confirmed);
      }
      this.SetLoading(false);
    },
      (err) => {
        this.SetLoading(false);
        alert(err.error);
      }
    );
  }

  private dateValidation(startDate: string, endDate: string) {
    return (group: FormGroup) => {
      let startDateInput = group.controls[startDate];
      let endDateInput = group.controls[endDate];
      let currentDate = new Date();
      if (Date.parse(startDateInput.value) - Date.parse(String(currentDate)) < 0) {
        return startDateInput.setErrors({ inValidDateError: true });
      }
      if (new Date(startDateInput.value) > new Date(endDateInput.value)) {
        return endDateInput.setErrors({ inValidDateError: true });
      }
    }

  }

  private timeValidation(startTime: string, endTime: string) {
    return (group: FormGroup) => {
      let startTimeInput = group.controls[startTime];
      let endTimeInput = group.controls[endTime];
      if (this.diff_minutes(startTimeInput.value, endTimeInput.value)) {
        return endTimeInput.setErrors({ lessDurationError: true });
      }
    }

  }

  private diff_minutes(dt1, dt2) {

    let msDifference = +new Date(dt2) - +new Date(dt1);
    let minutes = Math.floor(msDifference / 1000 / 60);
    if (minutes < 60) {
      return true;  //Invalid 
    } else
      return false;  //valid time
  }

  private getLocations() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.locationService.getLocations(careHomeId).subscribe((response) => {
      if (response.length > 0) {
        // this.locationList = response;
        if (this.currentUserRole != this.userType.Admin) {
          let locationIds = JSON.parse(localStorage.getItem('_identity')).locationIds;
          locationIds.forEach((element) => {
            this.locationList.push(response.filter((x) => x.id == element)[0]);
          });
        } else {
          this.locationList = response;
        }
      }
    },
      (err) => {
        console.error('could not fetch locations ::' + err.error);
      }
    );
  }

  private getShift(shiftId: number) {
    this.SetLoading(true);

    this.shiftManagementService.getShift(shiftId).subscribe((response) => {
      if (response) {
        this.shiftForm = this.fb.group({
          id: [response.id],
          title: [response.title, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])],
          startTime: [formatDate(response.startTime, 'yyyy-MM-ddTHH:mm:ss', 'en'), Validators.compose([Validators.required])],
          endTime: [formatDate(response.endTime, 'yyyy-MM-ddTHH:mm:ss', 'en'), Validators.compose([Validators.required])],
          locationId: [response.locationId, Validators.compose([Validators.required])],
        },
          {
            validator: [this.timeValidation('startTime', 'endTime')]
          })

        this.selectedDays.push(1); // there is no sence for this is only for update purpose
        this.addShiftModal.show();
      }
      this.SetLoading(false);
    },
      (err) => {
        this.SetLoading(false);
        console.log(err.error);
      });


  }

}
