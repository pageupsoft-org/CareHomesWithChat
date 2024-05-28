import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormSixteenService } from 'src/app/services/form-sixteen.service';
import { LocationServices } from 'src/app/services/location.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { AuditFormSixteen } from 'src/app/shared/models/audit-form-sixteen';
import { Location } from 'src/app/shared/models/location';
import { Constants } from 'src/app/util/Constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-sixteen-overview',
  templateUrl: './form-sixteen-overview.component.html',
  styleUrls: ['./form-sixteen-overview.component.scss']
})
export class FormSixteenOverviewComponent extends BaseComponent implements OnInit {
  public formSixteen: Array<AuditFormSixteen> = [];
  public locationList: Array<Location> = [];
  public locationId: number = 0;
  public baseUrl: string = environment.baseUrl + 'PdfGenerator/DownloadForm16/';


  constructor(private formSixteenService: FormSixteenService, private router: Router, private locationService: LocationServices) { super(); }

  ngOnInit(): void {
    this.getLocations();
  }

  public getForms(locationId: any) {
    this.locationId = locationId;
    if (this.locationId) {
      this.SetLoading(true);
      this.formSixteenService.getForms(this.locationId).subscribe(
        (response) => {
          if (response.length > 0) {
            this.formSixteen = response;
          }else{
            this.formSixteen = [];

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

  public createFormSixteen() {
    this.router.navigate([Constants.routes.locationAudits.formSixteen()]);
  }

  public editForm(formData) {
    this.router.navigate([Constants.routes.locationAudits.formSixteenEdit(formData.id)]);
  }

  public showForm(formData) {
    this.router.navigate([Constants.routes.locationAudits.formSixteenShow(formData.id)]);
  }

  public removeForm(formId) {
    if (confirm('Are you sure you want to remove this?')) {
      this.SetLoading(true);
      this.formSixteenService.deleteForm(formId).subscribe(
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
    this.locationService.getLocations(careHomeId).subscribe((response) => {
      if (response.length > 0) {
        if (this.currentUserRole != this.userType.Admin) {
          let locationIds = JSON.parse(localStorage.getItem('_identity')).locationIds;
          locationIds.forEach((element) => {
            this.locationList.push(response.filter((x) => x.id == element)[0]);
          });
          // this.locationList = response;
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
