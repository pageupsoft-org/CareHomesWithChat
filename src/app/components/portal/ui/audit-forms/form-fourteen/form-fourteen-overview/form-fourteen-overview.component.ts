import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormFourteenService } from 'src/app/services/form-fourteen.service';
import { LocationServices } from 'src/app/services/location.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { AuditFormFourteen } from 'src/app/shared/models/audit-form-fourteen';
import { Location } from 'src/app/shared/models/location';
import { Constants } from 'src/app/util/Constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-fourteen-overview',
  templateUrl: './form-fourteen-overview.component.html',
  styleUrls: ['./form-fourteen-overview.component.scss'],
})
export class FormFourteenOverviewComponent
  extends BaseComponent
  implements OnInit {
  public formFourteen: Array<AuditFormFourteen> = [];
  public locationList: Array<Location> = [];
  public formFourteenteenData: AuditFormFourteen;
  public showAuditForm: boolean = false;
  public locationId: number = 0;
  public baseUrl: string = environment.baseUrl + 'PdfGenerator/DownloadForm14/';


  constructor(
    private formFourteenService: FormFourteenService,
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
      this.showAuditForm = false;
      this.formFourteenteenData = null;
      this.formFourteenService.getForms(this.locationId).subscribe(
        (response) => {
          if (response.length > 0) {
            this.formFourteen = response;
          }
          else {
            this.formFourteen = [];
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

  public createFormFourteen() {
    this.router.navigate([Constants.routes.locationAudits.formFourteen()]);
  }

  public editForm(formData) {
    this.router.navigate([Constants.routes.locationAudits.formFourteenEdit(formData.id)]);
  }

  public showForm(formData) {
    // alert('this feature is unavailable for now');
    // return;
    this.router.navigate([Constants.routes.locationAudits.formFourteenShow(formData.id)]);
    this.showAuditForm = true;
    this.formFourteenteenData = formData;
  }

  public removeForm(formId) {
    if (confirm('Are you sure you want to remove this?')) {
      this.SetLoading(true);
      this.formFourteenService.deleteForm(formId).subscribe(
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
      else {
        this.locationList = [];
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
