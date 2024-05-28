import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LocationAlertService } from 'src/app/services/location-alert.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { LocationAlert } from 'src/app/shared/models/location-alerts';
import { DialogResult } from 'src/app/util/DialogResult ';
import { AddAlertModalComponent } from '../add-alert-modal/add-alert-modal.component';

@Component({
  selector: 'app-alert-master',
  templateUrl: './alert-master.component.html',
  styleUrls: ['./alert-master.component.scss']
})
export class AlertMasterComponent extends BaseComponent implements OnInit {
  @ViewChild('locationAlertModal') locationAlertModal: AddAlertModalComponent;
  @Input() locationId: number;


  public alertList: Array<LocationAlert> = [];


  constructor(private locationAlertService: LocationAlertService) { super() }

  ngOnInit(): void {
    // if (!this.locationId) {
    //    alert('Please select location');
    //   return;
    // }
    // this.getAllAlertts();
  }

  ngOnChanges(): void {
    if (this.locationId) {
      this.getAllAlertts();
    }

  }

  public addAlert() {
    this.locationAlertModal.showModal().then((result: DialogResult) => {
      if (result == DialogResult.Confirmed) {
        this.getAllAlertts();
      }
    });
  }

  public editAlert(alert: LocationAlert) {
    this.locationAlertModal.showModal(alert).then((result: DialogResult) => {
      if (result == DialogResult.Confirmed) {
        this.getAllAlertts();
      }
    });
  }

  public remove(alertId: number) {
    if (confirm("Are you sure you want to delete this record?")) {
      this.SetLoading(true);
      this.locationAlertService.deleteAlert(alertId).subscribe(response => {
        if (response) {
          alert("Successfully  removed");
          this.getAllAlertts();
        }
        this.SetLoading(false);
      }, (err) => {
        alert(err.error);
        this.SetLoading(false);
      })
    }
  }

  private getAllAlertts() {
    this.SetLoading(true);
    this.locationAlertService.getAlerts(this.locationId).subscribe(response => {
      if (response.length > 0) {
        this.alertList = response;
      }
      this.SetLoading(false);
    },
      (err) => {
        this.SetLoading(false);
        console.error(err.error);
      });
  }
}
