import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PatientZoneLogService } from 'src/app/services/patient-zone-log.service';
import { DialogResult } from 'src/app/util/DialogResult ';

@Component({
  selector: 'app-latest-log-modal',
  templateUrl: './latest-log-modal.component.html',
  styleUrls: ['./latest-log-modal.component.scss'],
})
export class LatestLogModalComponent implements OnInit {
  @ViewChild('logModal') logModal: ModalDirective;
  // @Input() locationId: number;

  private callback: any;
  public criteria: string;
  public actions: string;

  constructor(private zoneLogService: PatientZoneLogService) { }

  ngOnInit(): void { }

  public showModal(patientId: number): Promise<DialogResult> {
    let promise = new Promise<DialogResult>((resolve) => {
      this.callback = resolve;
    });
    this.criteria = '-';
    this.actions = '-';
    if (patientId) {
      this.getLastestLog(patientId);
    }
    this.logModal.show();
    return promise;
  }

  public cancel() {
    this.logModal.hide();
    if (this.callback != null) {
      this.callback(DialogResult.Canceled);
    }
  }

  private getLastestLog(patinetId) {
    this.zoneLogService.getLatestLog(patinetId).subscribe(
      (response) => {
        if (response) {
          if (response.locationCriterias) {
            let criteriaNames = [];
            response.locationCriterias.forEach((element) => {
              if (element.locationCriteria)
                criteriaNames.push(element.locationCriteria.name);
            });
            this.criteria = criteriaNames.join(',');
          } else {
            this.criteria = '-';
          }

          if (response.locationActions) {
            let actionNames = [];
            response.locationActions.forEach((element) => {
              if (element.locationAction)
                actionNames.push(element.locationAction.name);
            });
            this.actions = actionNames.join(',');
          } else {
            this.actions = '-';
          }
        }
      },
      (err) => {
        alert(err.error);
      }
    );
  }
}
