import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormEightService } from 'src/app/services/form-eight.service';
import { LocationServices } from 'src/app/services/location.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { AuditFormEight } from 'src/app/shared/models/audit-form-eight';
import { Location } from 'src/app/shared/models/location';
import { Constants } from 'src/app/util/Constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-eight-overview',
  templateUrl: './form-eight-overview.component.html',
  styleUrls: ['./form-eight-overview.component.scss']
})
export class FormEightOverviewComponent extends BaseComponent implements OnInit {

  public formEight: Array<AuditFormEight> = [];
  public locationList: Array<Location> = [];
  public locationId: number = 0;
  public baseUrl: string = environment.baseUrl + 'PdfGenerator/DownloadForm8/';

  constructor(private formEightService: FormEightService, private router: Router, private locationService: LocationServices) { super() }
  ngOnInit(): void {
    this.getLocations();
  }

  public getForms(locationId: any) {
    this.locationId = locationId;
    if (this.locationId) {
      this.SetLoading(true);
      this.formEightService.getForms(this.locationId).subscribe(
        (response) => {
          if (response.length > 0) {
            this.formEight = response;
          }
          else{
            this.formEight = [];
          }
          this.SetLoading(false);
        },
        (err) => {
          this.SetLoading(false);
          alert(err.error);
        }
      );
    }
  }

  public createFormEight() {
    this.router.navigate([Constants.routes.locationAudits.formEight()]);
  }

  public editForm(formData) {
    this.router.navigate([Constants.routes.locationAudits.formEightEdit(formData.id)]);
  }

  public showForm(formData) {
    // alert('this feature is unavailable for now');
    // return;
    this.router.navigate([Constants.routes.locationAudits.formEightShow(formData.id)]);
  }

  public removeForm(formId) {
    if (confirm('Are you sure you want to remove this?')) {
      this.SetLoading(true);
      this.formEightService.deleteForm(formId).subscribe(
        (response) => {
          if (response) {
            alert('Form deleted successfully');
            this.getForms(this.locationId);
          }
          this.SetLoading(false);
        },
        (err) => {
          alert(err.error);
          this.SetLoading(false);
        }
      );
    }
  }

  public goBack() {
    window.history.back();
  }

  private getLocations() {
    this.SetLoading(true);
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.locationService.getLocations(careHomeId).subscribe(
      (response) => {
        if (response) {
          if (this.currentUserRole != this.userType.Admin) {
            let locationIds = JSON.parse(
              localStorage.getItem('_identity')
            ).locationIds;
            locationIds.forEach((element) => {
              this.locationList.push(
                response.filter((x) => x.id == element)[0]
              );
            });
            // this.locationList = response.Result;
          } else {
            this.locationList = response;
          }
        }
        this.SetLoading(false);
      },
      (error) => {
        this.SetLoading(false);
        console.error('could not fetch::' + error.error);
      }
    );
  }
}
