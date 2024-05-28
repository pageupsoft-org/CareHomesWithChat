import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormTenService } from 'src/app/services/form-ten.service';
import { LocationServices } from 'src/app/services/location.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { AuditFormTen } from 'src/app/shared/models/audit-form-ten';
import { Location } from 'src/app/shared/models/location';
import { Constants } from 'src/app/util/Constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-ten-overview',
  templateUrl: './form-ten-overview.component.html',
  styleUrls: ['./form-ten-overview.component.scss'],
})
export class FormTenOverviewComponent extends BaseComponent implements OnInit {

  public formTen: Array<AuditFormTen> = [];
  public locationList: Array<Location> = [];
  public locationId: number = 0;
  public baseUrl: string = environment.baseUrl + 'PdfGenerator/DownloadForm10/';


  constructor(
    private formTenService: FormTenService,
    private router: Router,
    private locationService: LocationServices
  ) {
    super();
  }

  ngOnInit(): void {
    this.getLocations();
  }

  public getForms(event: any) {
    this.locationId = event.target.value;
    if (this.locationId) {
      this.SetLoading(true);

      this.formTenService.getForms(this.locationId).subscribe(
        (response) => {
          if (response.length > 0) {
            this.formTen = response;
          }
          else {
            this.formTen = [];
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

  public createFormTen() {
    this.router.navigate([Constants.routes.locationAudits.formTen()]);
  }

  public editForm(formData) {
    this.router.navigate([Constants.routes.locationAudits.formTenEdit(formData.id)]);
  }

  public showForm(formData) {
    // alert('this feature is unavailable for now');
    // return;
    this.router.navigate([Constants.routes.locationAudits.formTenShow(formData.id)]);
  }

  public removeForm(formId) {
    if (confirm('Are you sure you want to remove this?')) {
      this.SetLoading(true);
      this.formTenService.deleteForm(formId).subscribe(
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
