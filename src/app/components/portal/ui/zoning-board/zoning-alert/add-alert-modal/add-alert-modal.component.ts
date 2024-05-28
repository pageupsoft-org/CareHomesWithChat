import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LocationAlertService } from 'src/app/services/location-alert.service';
import { LocationServices } from 'src/app/services/location.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { LocationAlertForm } from 'src/app/shared/forms/location-alert-form';
import { Location } from 'src/app/shared/models/location';
import { LocationAlert } from 'src/app/shared/models/location-alerts';
import { DialogResult } from 'src/app/util/DialogResult ';

@Component({
  selector: 'app-add-alert-modal',
  templateUrl: './add-alert-modal.component.html',
  styleUrls: ['./add-alert-modal.component.scss']
})
export class AddAlertModalComponent extends BaseComponent implements OnInit {
  @ViewChild("locationAlertModal") locationAlertModal: ModalDirective;

  private callback: any;
  public locationAlertForm: LocationAlertForm;
  public locationList: Array<Location> = [];
  public isEdit: boolean = false;

  constructor(private locationService: LocationServices, private locationAlertService: LocationAlertService) { super(); }

  ngOnInit(): void {
    this.getLocations();
  }

  public showModal(locationAlert: LocationAlert = null): Promise<DialogResult> {
    let promise = new Promise<DialogResult>((resolve) => {
      this.callback = resolve;
    });


    if (locationAlert) {
      this.isEdit = true;
      this.locationAlertForm = new LocationAlertForm(locationAlert);

    } else {
      this.locationAlertForm = new LocationAlertForm();
      this.locationAlertForm.careHomeId.setValue(Number(JSON.parse(localStorage.getItem('_identity')).careHomeId));

    }

    this.isBusy = false
    this.locationAlertModal.show();
    return promise;
  }

  public cancel() {
    this.locationAlertModal.hide();
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
    this.locationAlertService.addAlert(this.locationAlertForm.save()).subscribe(response => {
      if (response) {
        this.locationAlertForm.reset();
        this.locationAlertModal.hide();
        this.callback(DialogResult.Confirmed);
      }
    }, err => {
      alert(err.error);
    })
  }

  private updateLocationAction() {
    this.locationAlertService.updateAlert(this.locationAlertForm.save()).subscribe(response => {
      if (response) {
        this.locationAlertForm.reset();
        this.locationAlertModal.hide();
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
          // this.locationList = response;
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
