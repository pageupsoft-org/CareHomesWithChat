import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LocationActionService } from 'src/app/services/location-action.service';
import { LocationServices } from 'src/app/services/location.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { LocationAction } from 'src/app/shared/models/location-action';
import { DialogResult } from 'src/app/util/DialogResult ';
import { AddActionModalComponent } from '../add-action-modal/add-action-modal.component';

@Component({
  selector: 'app-action-master',
  templateUrl: './action-master.component.html',
  styleUrls: ['./action-master.component.scss']
})
export class ActionMasterComponent extends BaseComponent implements OnInit {
  @ViewChild('actionModal') actionModal: AddActionModalComponent;
  @Input() locationId: number;

  public locationActionList: Array<LocationAction> = [];

  constructor(private locationService: LocationServices, private locationActionService: LocationActionService) { super() }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (!this.locationId) {
      alert('Please select location');
      return;
    }

    this.getAllActions();
  }


  public getAllActions() {
    this.SetLoading(true);
    let locationId = this.locationId;
    this.locationActionService.getActions(locationId).subscribe(res => {
      if (res.length > 0) {
        this.locationActionList = res;
      } else {
        this.locationActionList = [];
      }
      this.SetLoading(false);
    }, err => {
      alert(err.error);
      this.SetLoading(false);
    })
  }

  public addAction() {
    this.actionModal.showModal().then((result: DialogResult) => {
      if (result == DialogResult.Confirmed) {
        this.getAllActions();
      }
    });
  }

  public editAction(locationAction: LocationAction) {
    this.actionModal.showModal(locationAction).then((result: DialogResult) => {
      if (result == DialogResult.Confirmed) {
        this.getAllActions();
      }
    });
  }

  public remove(id: number) {
    if (window.confirm('Are sure you want to delete this?')) {
      this.locationActionService.deleteAction(id).subscribe(response => {
        if (response)
          this.getAllActions();
      },
        error => {
          alert(error.error);
          console.error(error);
        })
    }
  }

}
