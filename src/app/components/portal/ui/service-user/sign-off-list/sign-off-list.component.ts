import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PatientService } from 'src/app/services/patient.service';
import { SignOffService } from 'src/app/services/sign-off.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { FormName } from 'src/app/shared/enums/form-name.enum';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/util/Constants';

@Component({
  selector: 'app-sign-off-lis',
  templateUrl: './sign-off-list.component.html',
  styleUrls: ['./sign-off-lis.component.scss']
})
export class SignOffListComponent extends BaseComponent implements OnInit {

  public formsName = FormName;
  public formName: number = 0;
  public showForm: boolean = false
  public formsList: Array<any> = [];
  public formData: any;
  public isUserLoading: boolean;
  public userData: PatientAdmission;
  private usersList: Array<User> = [];
  private userId = Number(JSON.parse(localStorage.getItem('_identity')).id);

  constructor(private route: ActivatedRoute, private router: Router, private signOffService: SignOffService, private userService: UserService, private patientService: PatientService) { super(); }

  ngOnInit(): void {
    if (this.currentUserRole == this.userType.Auditor || this.currentUserRole == this.userType.User) {
      alert("you don't have access to this respource");
      window.history.back();
    }

    this.formName = this.route.snapshot.params['formId'];
    this.getUsers();

    if (this.formName == this.formsName.Patient) {
      this.getPatientsForms();
    }

    else if (this.formName == this.formsName.RiskAssessment) {
      this.getRiskAssessmentForms();
    }

    else if (this.formName == this.formsName.SharedPathway) {
      this.getSharedPathwaysForms();
    }

    else if (this.formName == this.formsName.RecoveryStar) {
      this.getRecoveryStarsForms();
    }

    else if (this.formName == this.formsName.ProgressNote) {
      this.getProgressNotesForms();
    }

    else if (this.formName == this.formsName.MoveOnFunctional) {
      this.getMoveOnFunctionalForms();
    }

    else if (this.formName == this.formsName.PatientTransaction) {
      this.getPatientTransactionsForms();
    }

    else if (this.formName == this.formsName.Form13) {
      this.getForm13();
    }

    else if (this.formName == this.formsName.Form15) {
      this.getForm15();
    }

    else if (this.formName == this.formsName.Form17) {
      this.getForm17();
    }

    else if (this.formName == this.formsName.Form2) {
      this.getForm2();
    }

    else if (this.formName == this.formsName.Form7) {
      this.getForm7();
    }

    else if (this.formName == this.formsName.Form8) {
      this.getForm8();
    }

    else if (this.formName == this.formsName.Form9) {
      this.getForm9();
    }

    else if (this.formName == this.formsName.Form10) {
      this.getForm10();
    }

    else if (this.formName == this.formsName.Form12) {
      this.getForm12();
    }

    else if (this.formName == this.formsName.Form14) {
      this.getForm14();
    }

    else if (this.formName == this.formsName.Form16) {
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
      this.router.navigate([Constants.routes.locationAudits.formTwoEdit(formData.id)]);
    }

    else if (this.formName == this.formsName.Form7) {
      // this.getForm7();
      this.router.navigate([Constants.routes.locationAudits.formSevenEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

   else if (this.formName == this.formsName.Form8) {
      // this.getForm8();
      this.router.navigate([Constants.routes.locationAudits.formEightEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

   else if (this.formName == this.formsName.Form9) {
      // this.getForm9();
      this.router.navigate([Constants.routes.locationAudits.formNineEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

   else if (this.formName == this.formsName.Form10) {
      // this.getForm10();
      this.router.navigate([Constants.routes.locationAudits.formTenEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

   else if (this.formName == this.formsName.Form12) {
      // this.getForm12();
      this.router.navigate([Constants.routes.locationAudits.formTwelveEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

   else if (this.formName == this.formsName.Form14) {
      // this.getForm14();
      this.router.navigate([Constants.routes.locationAudits.formFourteenEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

   else if (this.formName == this.formsName.Form16) {
      // this.getForm16();
      this.router.navigate([Constants.routes.locationAudits.formSixteenEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

   else if (this.formName == this.formsName.Form11) {
      // this.getForm11();
      this.router.navigate([Constants.routes.locationAudits.formElevenEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

   else if (this.formName == this.formsName.Form19) {
      // this.getForm19();
      this.router.navigate([Constants.routes.locationAudits.formNineteenEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

   else if (this.formName == this.formsName.Form20) {
      // this.getForm20();
      this.router.navigate([Constants.routes.locationAudits.formTwentyEdit(formData.id)],{ queryParams: { fromDashboard: true } });
    }

   else if (this.formName == this.formsName.Form21) {
      // this.getForm21();
      this.router.navigate([Constants.routes.locationAudits.formTwentyOneEdit(formData.id)],{ queryParams: { fromDashboard: true } });
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

  private getPatientsForms() {
    this.SetLoading(true);
    this.signOffService.getPatientsForms(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getRiskAssessmentForms() {
    this.SetLoading(true);
    this.signOffService.getRiskAssessmentForms(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getSharedPathwaysForms() {
    this.SetLoading(true);
    this.signOffService.getSharedPathwaysForms(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getRecoveryStarsForms() {
    this.SetLoading(true);
    this.signOffService.getRecoveryStarsForms(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getProgressNotesForms() {
    this.SetLoading(true);
    this.signOffService.getProgressNotesForms(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getMoveOnFunctionalForms() {
    this.SetLoading(true);
    this.signOffService.getMoveOnFunctionalForms(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getPatientTransactionsForms() {
    this.SetLoading(true);
    this.signOffService.getPatientTransactionsForms(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getForm13() {
    this.SetLoading(true);
    this.signOffService.getForm13(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getForm15() {
    this.SetLoading(true);
    this.signOffService.getForm15(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getForm17() {
    this.SetLoading(true);
    this.signOffService.getForm17(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getForm2() {
    this.SetLoading(true);
    this.signOffService.getForm2(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getForm7() {
    this.SetLoading(true);
    this.signOffService.getForm7(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getForm8() {
    this.SetLoading(true);
    this.signOffService.getForm8(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getForm9() {
    this.SetLoading(true);
    this.signOffService.getForm9(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getForm10() {
    this.SetLoading(true);
    this.signOffService.getForm10(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getForm12() {
    this.SetLoading(true);
    this.signOffService.getForm12(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getForm14() {
    this.SetLoading(true);
    this.signOffService.getForm14(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getForm16() {
    this.SetLoading(true);
    this.signOffService.getForm16(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }
  

  private getForm11() {
    this.SetLoading(true);
    this.signOffService.getForm11(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getForm19() {
    this.SetLoading(true);
    this.signOffService.getForm19(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getForm20() {
    this.SetLoading(true);
    this.signOffService.getForm20(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private getForm21() {
    this.SetLoading(true);
    this.signOffService.getForm21(this.userId).subscribe(response => {
      if (response.length > 0) {
        this.formsList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }


  private getUsers() {
    this.isUserLoading = true;
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe(response => {
      if (response) {
        this.usersList = response;
      }
      this.isUserLoading = false;
    }, err => {
      this.isUserLoading = false;
      console.error("could not fetch users::" + err.error);
    })
    // this.isBusy = false;
  }


}
