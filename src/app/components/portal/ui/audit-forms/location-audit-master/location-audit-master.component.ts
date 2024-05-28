import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { Constants } from 'src/app/util/Constants';

@Component({
  selector: 'app-location-audit-master',
  templateUrl: './location-audit-master.component.html',
  styleUrls: ['./location-audit-master.component.scss']
})
export class LocationAuditMasterComponent extends BaseComponent implements OnInit {

  public formNo: any = 0;

  constructor(private router: Router) { super() }

  ngOnInit(): void {
    // this.SetLoading(true);
  }

  public openForm(formNumber: number) {
    // this.formNo = formNumber;
    switch (formNumber) {
      case 2:
        this.router.navigate([Constants.routes.locationAudits.formTwoOverview()]);
        break;
      case 7:
        this.router.navigate([Constants.routes.locationAudits.formSevenOverview()]);
        break;
      case 8:
        this.router.navigate([Constants.routes.locationAudits.formEightOverview()]);
        break;
      case 9:
        this.router.navigate([Constants.routes.locationAudits.formNineOverview()]);
        break;
      case 10:
        this.router.navigate([Constants.routes.locationAudits.formTenOverview()]);
        break;
      case 11:
        this.router.navigate([Constants.routes.locationAudits.formElevenOverview()]);
        break;
      case 12:
        this.router.navigate([Constants.routes.locationAudits.formTwelveOverview()]);
        break;
      case 14:
        this.router.navigate([Constants.routes.locationAudits.formFourteenOverview()]);
        break;
      case 16:
        this.router.navigate([Constants.routes.locationAudits.formSixteenOverview()]);
        break;
      case 19:
        this.router.navigate([Constants.routes.locationAudits.formNineteenOverview()]);
        break;
      case 20:
        this.router.navigate([Constants.routes.locationAudits.formTwentyOverview()]);
        break;
      case 21:
        this.router.navigate([Constants.routes.locationAudits.formTwentyOneOverview()]);
        break;
      default:
        break;
    }

  }

}
