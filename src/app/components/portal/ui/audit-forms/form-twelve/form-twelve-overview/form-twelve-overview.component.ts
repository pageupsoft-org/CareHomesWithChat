import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormTwelveService } from 'src/app/services/form-twelve.service';
import { LocationServices } from 'src/app/services/location.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { AuditFormTwelve } from 'src/app/shared/models/audit-form-twelve';
import { Location } from 'src/app/shared/models/location';
import { Constants } from 'src/app/util/Constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-twelve-overview',
  templateUrl: './form-twelve-overview.component.html',
  styleUrls: ['./form-twelve-overview.component.scss']
})
export class FormTwelveOverviewComponent extends BaseComponent implements OnInit {

  public formSeven: Array<AuditFormTwelve> = [];
  public locationList: Array<Location> = [];
  public locationId: number = 0;
  public baseUrl: string = environment.baseUrl + 'PdfGenerator/DownloadForm12/';


  constructor(private formTwelveService: FormTwelveService, private router: Router, private locationService: LocationServices) { super(); }

  ngOnInit(): void {
    this.getLocations();
  }

  public getForms(locationId: any) {
    this.locationId = locationId;
    if (this.locationId) {
      this.SetLoading(true);
      this.formTwelveService.getForms(this.locationId).subscribe(
        (response) => {
          if (response.length > 0) {
            this.formSeven = response;
          } else {
            this.formSeven = [];

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

  public createFormTwelve() {
    this.router.navigate([Constants.routes.locationAudits.formTwelve()]);
  }

  public editForm(formData) {
    this.router.navigate([Constants.routes.locationAudits.formTwelveEdit(formData.id)]);
  }

  public showForm(formData) {
    this.router.navigate([Constants.routes.locationAudits.formTwelveShow(formData.id)]);
  }

  public removeForm(formId) {
    if (confirm('Are you sure you want to remove this?')) {
      this.SetLoading(true);
      this.formTwelveService.deleteForm(formId).subscribe(
        (response) => {
          if (response) {
            alert('Form deleted successfully');
            this.getForms(this.locationId);
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

  public goBack() {
    window.history.back();
  }

  private getLocations() {
    this.SetLoading(true);
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.locationService.getLocations(careHomeId).subscribe((response) => {
      if (response) {
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
