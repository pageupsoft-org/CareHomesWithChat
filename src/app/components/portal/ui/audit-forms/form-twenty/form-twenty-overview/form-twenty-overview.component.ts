import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormTwentyService } from 'src/app/services/form-twenty.service';
import { LocationServices } from 'src/app/services/location.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { AuditFormTwenty } from 'src/app/shared/models/audit-form-twenty';
import { Location } from 'src/app/shared/models/location';
import { Constants } from 'src/app/util/Constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-twenty-overview',
  templateUrl: './form-twenty-overview.component.html',
  styleUrls: ['./form-twenty-overview.component.scss'],
})
export class FormTwentyOverviewComponent extends BaseComponent implements OnInit {
  public formTwenty: Array<AuditFormTwenty> = [];
  public locationList: Array<Location> = [];
  public formTwentyteenData: AuditFormTwenty;
  public showAuditForm: boolean = false;
  public locationId: number = 0;
  public baseUrl: string = environment.baseUrl + 'PdfGenerator/DownloadForm20/';

  constructor(
    private formTwentyService: FormTwentyService,
    private router: Router,
    private locationService: LocationServices
  ) { super();  }

  ngOnInit(): void {
    this.getLocations();
  }

  public getForms(event: any) {
    this.locationId = event.target.value;
    if (this.locationId) {
      this.SetLoading(true);
      this.showAuditForm = false;
      this.formTwentyteenData = null;
      this.formTwentyService.getForms(this.locationId).subscribe(
        (response) => {
          if (response.length > 0) {
            this.formTwenty = response;
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

  public createFormTwenty() {
    this.router.navigate([Constants.routes.locationAudits.formTwenty()]);
  }

  public editForm(formData) {
    this.router.navigate([Constants.routes.locationAudits.formTwentyEdit(formData.id)]);
  }

  public showForm(formData) {
    // alert('this feature is unavailable for now');
    // return;
    this.router.navigate([Constants.routes.locationAudits.formTwentyShow(formData.id)]);
    this.showAuditForm = true;
    this.formTwentyteenData = formData;
  }

  public removeForm(formId) {
    if (confirm('Are you sure you want to remove this?')) {
      this.SetLoading(true);
      this.formTwentyService.deleteForm(formId).subscribe(
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
