import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LocationActionService } from 'src/app/services/location-action.service';
import { LocationServices } from 'src/app/services/location.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { LocationActionForm } from 'src/app/shared/forms/location-action-form';
import { Location } from 'src/app/shared/models/location';
import { LocationAction } from 'src/app/shared/models/location-action';
import { DialogResult } from 'src/app/util/DialogResult ';

@Component({
  selector: 'app-add-action-modal',
  templateUrl: './add-action-modal.component.html',
  styleUrls: ['./add-action-modal.component.scss']
})
export class AddActionModalComponent extends BaseComponent implements OnInit {
  @ViewChild("actionModal") actionModal: ModalDirective;

  private callback: any;
  public locationActionForm: LocationActionForm;
  public locationList: Array<Location> = [];
  public isEdit: boolean = false;

  constructor(private locationService: LocationServices, private locationActionService: LocationActionService) { super()}

  ngOnInit(): void {

    this.getLocations();
  }

  public showModal(locationAction: LocationAction = null): Promise<DialogResult> {
    let promise = new Promise<DialogResult>((resolve) => {
      this.callback = resolve;
    });

    if (locationAction) {
      this.isEdit = true;
      this.locationActionForm = new LocationActionForm(locationAction);

    } else {
      this.isEdit = false;

      this.locationActionForm = new LocationActionForm();
      this.locationActionForm.careHomeId.setValue(Number(JSON.parse(localStorage.getItem('_identity')).careHomeId));

    }

    this.actionModal.show();
    return promise;
  }


  public cancel() {
    this.actionModal.hide();
    if (this.callback != null) {
      this.callback(DialogResult.Canceled);
    }
  }

  public onSubmit() {
    if (this.isEdit) {
      this.updateLocationAction();
    } else {
      this.addLocationAction();
    }
  }

  private addLocationAction() {
    this.locationActionService.addAction(this.locationActionForm.save()).subscribe(response => {
      if (response) {
        this.locationActionForm.reset();
        this.actionModal.hide();
        this.callback(DialogResult.Confirmed);
      }
    }, err => {
      alert(err.error);
    })
  }

  private updateLocationAction() {
    this.locationActionService.updateAction(this.locationActionForm.save()).subscribe(response => {
      if (response) {
        this.locationActionForm.reset();
        this.actionModal.hide();
        this.callback(DialogResult.Confirmed);
      }
    }, err => {
      alert(err.error);
    })
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
