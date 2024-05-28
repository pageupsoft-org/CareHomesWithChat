import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { PatientService } from 'src/app/services/patient.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { FormName } from 'src/app/shared/enums/form-name.enum';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/util/Constants';

@Component({
  selector: 'app-assigned-forms',
  templateUrl: './assigned-forms.component.html',
  styleUrls: ['./assigned-forms.component.scss']
})
export class AssignedFormsComponent extends BaseComponent implements OnInit {

  public formsName = FormName;
  public formName: number = 0;
  public showForm: boolean = false
  public formsList: Array<any> = [];
  public formData: any;
  public userData: PatientAdmission;
  private usersList: Array<User> = [];
  private userId = Number(JSON.parse(localStorage.getItem('_identity')).id);

  constructor(private route: ActivatedRoute, private router: Router, private dashboardService: DashboardService, private userService: UserService, private patientService: PatientService) { super(); }

  ngOnInit(): void {
    if (this.currentUserRole == this.userType.Auditor) {
      alert("you don't have access to this respource");
      window.history.back();
    }
    this.SetLoading(true);
    this.formName = this.route.snapshot.params['formId'];
    this.getUsers();

    if (this.formName == this.formsName.Form13) {
      this.getForms13();
    }
    if (this.formName == this.formsName.Form15) {
      this.getForm15();
    }
    if (this.formName == this.formsName.Form17) {
      this.getForm17();
    }

    if (this.formName == this.formsName.Form2) {
      this.getForm2();
    }

    if (this.formName == this.formsName.Form7) {
      this.getForm7();
    }

    if (this.formName == this.formsName.Form8) {
      this.getForm8();
    }

    if (this.formName == this.formsName.Form9) {
      this.getForm9();
    }

    if (this.formName == this.formsName.Form10) {
      this.getForm10();
    }

    if (this.formName == this.formsName.Form12) {
      this.getForm12();
    }

    if (this.formName == this.formsName.Form14) {
      this.getForm14();
    }

    if (this.formName == this.formsName.Form16) {
      this.getForm16();
    }
    
    else if (this.formName == this.formsName.Form11) {
      this.getForm11();
    }

    else if (this.formName == this.formsName.Form19) {
      this.getForm19();
    }

    else if (this.formName == this.formsName.Form20) {
      this.getForm20();
    }

    else if (this.formName == this.formsName.Form21) {
      this.getForm21();
    }

    this.SetLoading(false);
  }

  public getUserName(userId: number) {
    if (userId) {
      let name;
      name = this.usersList.filter(x => x.id == userId)[0];
      if (name) {
        if (name.firstName == null && name.lastName == null) {
          return name.email;
        }
        else {
          return ((name.firstName)?name.firstName:'') + " " + ((name.lastName)?name.lastName:'');
        }
      }
    }
    return "-";

  }

  public openForm(formData) {

    if (this.formName == this.formsName.Form2) {
      this.router.navigate([Constants.routes.locationAudits.formTwoEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

    if (this.formName == this.formsName.Form7) {
      // this.getForm7();
      this.router.navigate([Constants.routes.locationAudits.formSevenEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

    if (this.formName == this.formsName.Form8) {
      // this.getForm8();
      this.router.navigate([Constants.routes.locationAudits.formEightEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

    if (this.formName == this.formsName.Form9) {
      // this.getForm9();
      this.router.navigate([Constants.routes.locationAudits.formNineEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

    if (this.formName == this.formsName.Form10) {
      // this.getForm10();
      this.router.navigate([Constants.routes.locationAudits.formTenEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

    if (this.formName == this.formsName.Form12) {
      // this.getForm12();
      this.router.navigate([Constants.routes.locationAudits.formTwelveEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

    if (this.formName == this.formsName.Form14) {
      // this.getForm14();
      this.router.navigate([Constants.routes.locationAudits.formFourteenEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

    if (this.formName == this.formsName.Form16) {
      // this.getForm16();
      this.router.navigate([Constants.routes.locationAudits.formSixteenEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

    if (this.formName == this.formsName.Form19) {
      // this.getForm16();
      this.router.navigate([Constants.routes.locationAudits.formNineteenEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

    if (this.formName == this.formsName.Form20) {
      // this.getForm16();
      this.router.navigate([Constants.routes.locationAudits.formTwentyEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

    if (this.formName == this.formsName.Form21) {
      // this.getForm16();
      this.router.navigate([Constants.routes.locationAudits.formTwentyOneEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

    if (this.formName == this.formsName.Form11) {
      // this.getForm16();
      this.router.navigate([Constants.routes.locationAudits.formElevenEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }
    
    // get patient records
    if (formData.patientId) {
      this.patientService.getPatient(formData.patientId).subscribe(response => {
        if (response) {
          this.userData = response;
          this.formData = formData
          this.showForm = true;
        }
      }, (err) => {
        alert(err.error);
        this.SetLoading(false);
      })
    } else {
      this.formData = formData
      this.showForm = true;
    }
  }

  private getForms13() {
    this.dashboardService.getPendingAuditForm13(this.userId).subscribe(response => {

      this.formsList = response;
    }, err => {
      alert(err.error);
    })
  }

  private getForm15() {
    this.dashboardService.getPendingAuditForm15(this.userId).subscribe(response => {

      this.formsList = response;
    }, err => {
      alert(err.error);
    })
  }

  private getForm17() {
    this.dashboardService.getPendingAuditForm17(this.userId).subscribe(response => {
        this.formsList = response;
    }, err => {
      alert(err.error);
    })
  }

  private getForm2() {
    this.dashboardService.getPendingAuditForm2(this.userId).subscribe(response => {
      this.formsList = response;
    }, err => {
      alert(err.error);
    })
  }

  private getForm7() {
    this.dashboardService.getPendingAuditForm7(this.userId).subscribe(response => {
      this.formsList = response;
    }, err => {
      alert(err.error);
    })
  }

  private getForm8() {
    this.dashboardService.getPendingAuditForm8(this.userId).subscribe(response => {
      this.formsList = response;
    }, err => {
      alert(err.error);
    })
  }

  private getForm9() {
    this.dashboardService.getPendingAuditForm9(this.userId).subscribe(response => {
      this.formsList = response;
    }, err => {
      alert(err.error);
    })
  }

  private getForm10() {
    this.dashboardService.getPendingAuditForm10(this.userId).subscribe(response => {
      this.formsList = response;
    }, err => {
      alert(err.error);
    })
  }

  private getForm12() {
    this.dashboardService.getPendingAuditForm12(this.userId).subscribe(response => {

      this.formsList = response;

    }, err => {
      alert(err.error);
    })
  }

  private getForm14() {
    this.dashboardService.getPendingAuditForm14(this.userId).subscribe(response => {
      this.formsList = response;
    }, err => {
      alert(err.error);
    })
  }

  private getForm16() {
    this.dashboardService.getPendingAuditForm16(this.userId).subscribe(response => {
        this.formsList = response;
    }, err => {
      alert(err.error);
    })
  }

  private getForm11() {
    this.dashboardService.getPendingAuditForm11(this.userId).subscribe(response => {
        this.formsList = response;
    }, err => {
      alert(err.error);
    })
  }

  private getForm19() {
    this.dashboardService.getPendingAuditForm19(this.userId).subscribe(response => {
        this.formsList = response;
    }, err => {
      alert(err.error);
    })
  }

  private getForm20() {
    this.dashboardService.getPendingAuditForm20(this.userId).subscribe(response => {
        this.formsList = response;
    }, err => {
      alert(err.error);
    })
  }
  
  private getForm21() {
    this.dashboardService.getPendingAuditForm21(this.userId).subscribe(response => {
        this.formsList = response;
    }, err => {
      alert(err.error);
    })
  }

  private getUsers() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe(response => {
      if (response) {
        this.usersList = response;
      }
    }, err => {
      console.error("could not fetch users::" + err.error);
    })
    // this.isBusy = false;
  }

}
