import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormTwoService } from 'src/app/services/form-two.service';
import { LocationServices } from 'src/app/services/location.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { AuditFormTwo } from 'src/app/shared/models/audit-form-two';
import { Location } from 'src/app/shared/models/location';
import { Constants } from 'src/app/util/Constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-two-overview',
  templateUrl: './form-two-overview.component.html',
  styleUrls: ['./form-two-overview.component.scss']
})
export class FormTwoOverviewComponent extends BaseComponent implements OnInit {
  public formTwo: Array<AuditFormTwo> = [];
  public locationList: Array<Location> = [];
  public locationId: number = 0;
  public baseUrl: string = environment.baseUrl + 'PdfGenerator/DownloadForm2/';

  constructor(private formTwoService: FormTwoService, private router: Router, private locationService: LocationServices) { super(); }

  ngOnInit(): void {
    this.getLocations();
  }

  public getForms(locationId: any) {
    this.locationId = locationId;
    if (this.locationId) {
      this.SetLoading(true);
      this.formTwoService.getForms(this.locationId).subscribe(
        (response) => {
          if (response.length > 0) {
            this.formTwo = response;
          }else{
            this.formTwo = [];

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

  public createFormTwo() {
    this.router.navigate([Constants.routes.locationAudits.formTwo()]);
  }

  public editForm(formData) {
    this.router.navigate([Constants.routes.locationAudits.formTwoEdit(formData.id)]);
  }

  public showForm(formData) {
    this.router.navigate([Constants.routes.locationAudits.formTwoShow(formData.id)]);
  }

  public removeForm(formId) {
    if (confirm('Are you sure you want to remove this?')) {
      this.SetLoading(true);
      this.formTwoService.deleteForm(formId).subscribe(
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
      if (response.length > 0) {
        if (this.currentUserRole != this.userType.Admin) {
          let locationIds = JSON.parse(localStorage.getItem('_identity')).locationIds;
          locationIds.forEach((element) => {
            this.locationList.push(response.filter((x) => x.id == element)[0]);
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
