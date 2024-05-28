import { formatDate } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LocationActionService } from 'src/app/services/location-action.service';
import { LocationCriteriaService } from 'src/app/services/location-criteria.service';
import { PatientZoneLogService } from 'src/app/services/patient-zone-log.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { Criteria } from 'src/app/shared/models/criteria';
import { LocationAlert } from 'src/app/shared/models/location-alerts';
import { DialogResult } from 'src/app/util/DialogResult ';

@Component({
  selector: 'app-patient-zone-log-modal',
  templateUrl: './patient-zone-log-modal.component.html',
  styleUrls: ['./patient-zone-log-modal.component.scss'],
})
export class PatientZoneLogModalComponent
  extends BaseComponent
  implements OnInit {
  @ViewChild('patientZoneLog') patientZoneLog: ModalDirective;
  @Input() locationId: number;

  public criteriaList: Array<Criteria> = [];
  public locationActionList: Array<LocationAlert> = [];
  public patientZoneForm: FormGroup;
  private callback: any;
  private criterias: Array<Criteria> = [];

  public selectedCriteria;
  public selectedAction;
  public dropdownSettings: IDropdownSettings = {};
  public actionDropdownSettings: IDropdownSettings = {};

  constructor(
    private fb: FormBuilder,
    private locationCriteriaService: LocationCriteriaService,
    private locationActionService: LocationActionService,
    private zoneLogService: PatientZoneLogService
  ) {
    super();
  }

  ngOnInit(): void {
    // if (this.locationId) {
    //   this.getCriteria();
    //   this.getAllActions();
    // }
  }

  ngOnChanges() {
    if (this.locationId) {
      this.getCriteria();
      this.getAllActions();
    }

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
    };

    this.actionDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
    };
  }

  public showModal(
    toZone: string,
    fromZone: string,
    patientId: any
  ): Promise<DialogResult> {
    let promise = new Promise<DialogResult>((resolve) => {
      this.callback = resolve;
    });
    this.clearSeleced();
    this.dropdownSettings

    this.criteriaList = this.criterias.filter(
      (x) => x.zoningCategory == toZone
    );

    let userId = Number(JSON.parse(localStorage.getItem('_identity')).id);
    this.patientZoneForm = this.fb.group({
      id: [0],
      patientId: [patientId, Validators.compose([Validators.required])],
      fromZone: [fromZone, Validators.compose([Validators.required])],
      toZone: [toZone, Validators.compose([Validators.required])],
      createdBy: [userId, Validators.compose([Validators.required])],
      createdAt: [
        new Date() ? formatDate(new Date(), 'yyyy-MM-dd', 'en') : null,
      ],

      locationCriterias: this.fb.array([]),
      locationActions: this.fb.array([]),
    });
    this.isBusy = false;
    this.patientZoneLog.show();
    return promise;
  }

  addCriteriasFormGroup(criteriaId: any): FormGroup {
    if (criteriaId)
      return this.fb.group({
        locationCriteriaId: [
          criteriaId,
          Validators.compose([Validators.required]),
        ],
      });
  }

  addActionFormGroup(actionId: any): FormGroup {
    if (actionId)
      return this.fb.group({
        locationActionId: [actionId, Validators.compose([Validators.required])],
      });
  }

  public cancel() {
    this.patientZoneLog.hide();
    if (this.callback != null) {
      this.patientZoneForm.reset();
      this.callback(DialogResult.Canceled);
    }
  }

  public onSubmit() {
    if (
      (<FormArray>this.patientZoneForm.get('locationCriterias')).length <= 0
    ) {
      return alert('Please select atleast 1 criteria');
    }
    if ((<FormArray>this.patientZoneForm.get('locationActions')).length <= 0) {
      return alert('Please select atleast 1 action');
    }
    this.SetLoading(true);
    this.zoneLogService.addZoneLog(this.patientZoneForm.value).subscribe(
      (response) => {
        if (response) {
          this.patientZoneForm.reset();
          this.callback(DialogResult.Confirmed);
          this.patientZoneLog.hide();
        }
        this.SetLoading(false);
      },
      (err) => {
        this.SetLoading(false);
        alert(err.error);
      }
    );
  }

  public onItemSelect(item: any) {
    // let obj = { 'locationCriteriaId': item.id };
    (<FormArray>this.patientZoneForm.get('locationCriterias')).push(
      this.addCriteriasFormGroup(item.id)
    );
  }

  public OnItemDeSelect(item: any) {
    // this.selectedItems = this.selectedItems.filter(x => x.locationCriteriaId != item.id);
    this.removeCriteria(item.id);
  }

  public clearSeleced() {
    this.selectedAction = null;
    this.selectedCriteria = null;

  }

  public onSelectAll(items: any) {
    (<FormArray>this.patientZoneForm.get('locationCriterias')).clear();

    items.forEach((element) => {
      (<FormArray>this.patientZoneForm.get('locationCriterias')).push(
        this.addCriteriasFormGroup(element.id)
      );
    });
  }

  public onDeSelectAll(items: any = null) {
    // this.selectedItems = [];
    (<FormArray>this.patientZoneForm.get('locationCriterias')).clear();
  }

  public onActionSelect(item: any) {
    // let obj = { 'locationActionId': item.id };
    // this.selectedActions.push(obj);
    (<FormArray>this.patientZoneForm.get('locationActions')).push(
      this.addActionFormGroup(item.id)
    );
  }

  public OnActionDeSelect(item: any) {
    // this.selectedActions = this.selectedActions.filter(x => x.locationActionId != item.id);
    this.removeAction(item.id);
  }

  public onActionSelectAll(items: any) {
    (<FormArray>this.patientZoneForm.get('locationActions')).clear();
    items.forEach((element) => {
      (<FormArray>this.patientZoneForm.get('locationActions')).push(
        this.addActionFormGroup(element.id)
      );
    });
  }

  public onActionDeSelectAll(items: any = null) {
    // this.selectedActions = [];
    (<FormArray>this.patientZoneForm.get('locationActions')).clear();
  }

  private getCriteria() {
    this.SetLoading(true);
    let locationId = this.locationId;
    this.locationCriteriaService.getCriterias(locationId).subscribe(
      (res) => {
        if (res.length > 0) {
          this.criterias = res;
        }
        this.SetLoading(false);
      },
      (err) => {
        alert(err.error);
        this.SetLoading(false);
      }
    );
  }

  private getAllActions() {
    this.SetLoading(true);
    let locationId = this.locationId;
    this.locationActionService.getActions(locationId).subscribe(
      (res) => {
        if (res.length >0) {
          this.locationActionList = res;
        }
        this.SetLoading(false);
      },
      (err) => {
        alert(err.erro);
        this.SetLoading(false);
      }
    );
  }

  private removeCriteria(i: number) {
    this.patientZoneForm.value.locationCriterias.forEach((element, index) => {
      if (element.locationCriteriaId == i) {
        (<FormArray>this.patientZoneForm.get('locationCriterias')).removeAt(index);
      }
    });
  }

  private removeAction(i: number) {
    this.patientZoneForm.value.locationActions.forEach((element, index) => {
      if (element.locationActionId == i) {
        (<FormArray>this.patientZoneForm.get('locationActions')).removeAt(
          index
        );
      }
    });
  }
}
