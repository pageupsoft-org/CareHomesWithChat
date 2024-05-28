import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LocationCriteriaService } from 'src/app/services/location-criteria.service';
import { LocationServices } from 'src/app/services/location.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { ZoneCategory } from 'src/app/shared/enums/zone-category.enum';
import { CriteriaForm } from 'src/app/shared/forms/criteria-form';
import { Criteria } from 'src/app/shared/models/criteria';
import { Location } from 'src/app/shared/models/location';
import { DialogResult } from 'src/app/util/DialogResult ';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-add-criteria-modal',
  templateUrl: './add-criteria-modal.component.html',
  styleUrls: ['./add-criteria-modal.component.scss']
})
export class AddCriteriaModalComponent extends BaseComponent implements OnInit {
  @ViewChild("criteriaModal") criteriaModal: ModalDirective;

  private callback: any;
  public criteria: CriteriaForm;
  public zoneCategory;
  public locationList: Array<Location> = [];
  public isEdit: boolean = false;

  constructor(private locationCriteriaService: LocationCriteriaService, private locationService: LocationServices) { super() }

  ngOnInit(): void {
    this.zoneCategory = this.getZoneCategory();
    this.getLocations();

  }

  public showModal(criteria: Criteria = null): Promise<DialogResult> {
    let promise = new Promise<DialogResult>((resolve) => {
      this.callback = resolve;
    });


    if (criteria) {
      this.isEdit = true;
      this.criteria = new CriteriaForm(criteria);

    } else {
      this.isEdit = false;
      this.criteria = new CriteriaForm();
      this.criteria.careHomeId.setValue(Number(JSON.parse(localStorage.getItem('_identity')).careHomeId));

    }

    this.isBusy = false
    this.criteriaModal.show();
    return promise;
  }

  public onSubmit() {
    this.SetLoading(true);

    // return;
    if (this.isEdit) {
      this.updateCriteria();
    } else {
      this.addCriteria();
    }
  }

  public cancel() {
    this.criteriaModal.hide();
    if (this.callback != null) {
      this.callback(DialogResult.Canceled);
    }
  }

  private updateCriteria() {

    this.locationCriteriaService.updateCriteria(this.criteria.save()).subscribe(response => {
      if (response) {
        this.criteria.reset();
        this.criteriaModal.hide();
        this.callback(DialogResult.Confirmed);
      }
      this.SetLoading(false);
    }, err => {
      alert(err.error);
      this.SetLoading(false);
    })
  }

  private addCriteria() {

    this.locationCriteriaService.addCriteria(this.criteria.save()).subscribe(response => {
      if (response) {
        // this.criteria.reset();
        this.criteriaModal.hide();
        if (this.callback != null) {
          this.callback(DialogResult.Confirmed);
        }
      }
      this.SetLoading(false);
    }, err => {
      alert(err.error);
      this.SetLoading(false);
    })
  }

  private getZoneCategory() {
    return EnumConverter.ConvertEnumToArray(ZoneCategory);
  }

  private getLocations() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.locationService.getLocations(careHomeId).subscribe(response => {
      if (response) {
        if (this.currentUserRole != this.userType.Admin) {
          let locationIds = JSON.parse(localStorage.getItem('_identity')).locationIds;
          locationIds.forEach(element => {
            this.locationList.push(response.filter(x => x.id == element)[0]);
          });
          // this.locationList = response.Result;
        } else {
          this.locationList = response;
        }
      }
    }, error => {
      console.error("could not fetch::" + error.error);
    }
    );
  }

}
