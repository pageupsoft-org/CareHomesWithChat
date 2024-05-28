import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormElevenService } from 'src/app/services/form-eleven.service';
import { LocationServices } from 'src/app/services/location.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { AuditFormEleven } from 'src/app/shared/models/audit-form-eleven';
import { Location } from 'src/app/shared/models/location';
import { Constants } from 'src/app/util/Constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-eleven-overview',
  templateUrl: './form-eleven-overview.component.html',
  styleUrls: ['./form-eleven-overview.component.scss']
})
export class FormElevenOverviewComponent extends BaseComponent implements OnInit {

  public formEleven: Array<AuditFormEleven> = [];
  public locationList: Array<Location> = [];
  public formElevenData: AuditFormEleven;
  public locationId: number = 0;
  public baseUrl: string = environment.baseUrl + 'PdfGenerator/DownloadForm11/';


  constructor( private formElevenService: FormElevenService, private router: Router, private locationService: LocationServices ) { super();  }

  ngOnInit(): void {
    this.getLocations();
  }

  public getForms(event: any) {
    this.locationId = event.target.value;
    if (this.locationId) {
      this.SetLoading(true);
      this.formElevenService.getForms(this.locationId).subscribe(
        (response) => {
          if (response.length > 0) {
            this.formEleven = response;
          }
          else {
            this.formEleven = [];
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

  public createFormEleven() {
    this.router.navigate([Constants.routes.locationAudits.formEleven()]);
  }

  public editForm(formData) {
    this.router.navigate([Constants.routes.locationAudits.formElevenEdit(formData.id)]);
  }

  public showForm(formData) {
    // alert('this feature is unavailable for now');
    // return;
    this.router.navigate([Constants.routes.locationAudits.formElevenShow(formData.id)]);
   
  }

  public removeForm(formId) {
    if (confirm('Are you sure you want to remove this?')) {
      this.SetLoading(true);
      this.formElevenService.deleteForm(formId).subscribe(
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
