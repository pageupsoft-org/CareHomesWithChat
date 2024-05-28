import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LocationCriteriaService } from 'src/app/services/location-criteria.service';
import { LocationServices } from 'src/app/services/location.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { ZoneCategory } from 'src/app/shared/enums/zone-category.enum';
import { Criteria } from 'src/app/shared/models/criteria';
import { DialogResult } from 'src/app/util/DialogResult ';
import { EnumConverter } from 'src/app/util/EnumConverter';
import { AddCriteriaModalComponent } from '../add-criteria-modal/add-criteria-modal.component';

@Component({
  selector: 'app-criteria-list',
  templateUrl: './criteria-list.component.html',
  styleUrls: ['./criteria-list.component.scss']
})
export class CriteriaListComponent extends BaseComponent implements OnInit {
  @ViewChild('criteriaModal') criteriaModal: AddCriteriaModalComponent;
  @Input() locationId: number;

  public criteriaList: Array<Criteria> = [];
  public zoneCategory;

  constructor(private locationCriteriaService: LocationCriteriaService) { super(); }

  ngOnInit(): void {
    // if (!this.locationId) {
    //   alert('Please select location');
    //   return;
    // }
    this.zoneCategory = this.getZoneCategory();
  }

  ngOnChanges(): void {
    if (this.locationId) {
      this.getCriteria();
    }
  }

  public getCriteria() {
    this.SetLoading(true);
    let locationId = this.locationId;
    this.locationCriteriaService.getCriterias(locationId).subscribe(res => {
      if (res.length > 0) {
        this.criteriaList = res;
      } else {
        this.criteriaList = [];
      }
      this.SetLoading(false);
    }, err => {
      alert(err.error);
      this.SetLoading(false);
    })
  }

  public addCriteria() {
    this.criteriaModal.showModal().then((result: DialogResult) => {
      if (result == DialogResult.Confirmed) {
        this.getCriteria();
      }
    });
  }

  public editCriteria(criteria: Criteria) {
    this.criteriaModal.showModal(criteria).then((result: DialogResult) => {
      if (result == DialogResult.Confirmed) {
        this.getCriteria();
      }
    });
  }

  public remove(id: number) {
    if (window.confirm('Are sure you want to delete this?')) {
      this.locationCriteriaService.deleteCriteria(id).subscribe(response => {
        if (response)
          this.getCriteria();
      },
        error => {
          alert(error.error);
          console.error(error);
        })
    }
  }



  private getZoneCategory() {
    return EnumConverter.ConvertEnumToArray(ZoneCategory);
  }



}
