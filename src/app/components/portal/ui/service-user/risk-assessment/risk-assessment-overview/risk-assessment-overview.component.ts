import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from 'src/app/services/patient.service';
import { RiskAssessmentService } from 'src/app/services/risk-assessment.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { CirculatedTo } from 'src/app/shared/enums/circulated-to.enum';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { RiskAssessment } from 'src/app/shared/models/risk-assessment';
import { User } from 'src/app/shared/models/user';
import { EnumConverter } from 'src/app/util/EnumConverter';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-risk-assessment-overview',
  templateUrl: './risk-assessment-overview.component.html',
  styleUrls: ['./risk-assessment-overview.component.scss']
})
export class RiskAssessmentOverviewComponent extends BaseComponent implements OnInit {
  @Input() userData: PatientAdmission;

  public riskAssessmentList: Array<any> = [];
  public showRiskAssessment: boolean;
  public addRiskAssessment: boolean;
  public viewAssessment: boolean;
  public editRiskAssessment: boolean;
  // public userData: PatientAdmission;
  public usersList: User[] = [];
  public showNotification: boolean = false;
  riskAssessmentData: RiskAssessment;
  patientAdmission: PatientAdmission;
  circulatedToArray: Array<any> = [];
  private id: number = 0;

  public baseUrl: string = environment.baseUrl + "PdfGenerator/DownloadRiskAssessment";

  constructor(private route: ActivatedRoute, private riskAssessmentService: RiskAssessmentService, private userService: UserService, private patientService: PatientService) { super(); }

  ngOnInit(): void {

    this.SetLoading(true);
    this.id = this.route.snapshot.params['id'];
    if (this.userData) {
      this.id = this.userData.id;
    }
    else {
      this.showNotification = true;
      this.SetLoading(false);
      return;
    }
    if (this.id) {
      this.patientService.getPatient(this.id).subscribe(response => {
        if (response) {
          this.userData = response;
        }
      }, err => {
        alert(err.error);
      })
      // this.getRiskAssessments();

    }

    this.showAllRiskAssessment();
    this.circulatedToArray = this.getCirculatedTo();
  }

  createRiskAssessment() {

    this.userData;
    this.viewAssessment = false;
    this.showRiskAssessment = false;
    this.addRiskAssessment = true;
  }

  removeRiskAssessment(id: number) {
    if (id) {
      if (confirm("Are you sure you want to delete this record?")) {
        this.SetLoading(true);
        this.riskAssessmentService.deleteRiskAssessment(id).subscribe(response => {
          if (response) {
            alert("Successfully  removed");
            this.getRiskAssessments();
          }
          this.SetLoading(false);
        }, error => {
          alert(error.error);
          this.SetLoading(false);
        })
      }
    } else {
      alert('Opps!! Something went wrong.Try again later');
    }
  }

  getRiskAssessments() {
    this.SetLoading(true);
    this.riskAssessmentService.getRiskAssessments(this.id).subscribe(response => {
      if (response) {
        this.riskAssessmentList = response;
        this.riskAssessmentList = this.riskAssessmentList.sort((a, b) => {
          if (a.id < b.id) {
            return 1
          }
          if (a.id > b.id) {
            return -1
          }
          return 0
        });
        this.viewAssessment = false;
        this.showRiskAssessment = true;
        this.addRiskAssessment = false;
      }
      this.SetLoading(false);
    }, error => {
      this.SetLoading(false);
      alert(error.error)
    })
  }

  viewRiskAssessment(id: number) {
    if (id) {
      this.SetLoading(true);
      this.riskAssessmentService.getRiskAssessment(id).subscribe(response => {
        if (response) {
          this.viewAssessment = true;
          this.showRiskAssessment = false;
          this.addRiskAssessment = false;
          this.riskAssessmentData = response;
        }
        this.SetLoading(false);
      }, error => {
        alert(error.error);
        this.SetLoading(false);
      })
    }
  }

  editAssessment(riskAssessment: RiskAssessment) {
    this.showRiskAssessment = false;
    this.addRiskAssessment = false;
    this.viewAssessment = false;
    this.editRiskAssessment = true;
    this.riskAssessmentData = riskAssessment;
  }

  getSignOffName(signOffId: number) {
    let userName = '';
    this.usersList.forEach((el) => {
      if (el.id == signOffId) {
        userName = el.firstName;

      }
    });
    return userName;
  }

  getUsers() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe(response => {
      if (response) {
        this.usersList = response;
      }
    }, err => {
      console.error("could not fetch users::" + err.error);
    })
    this.isBusy = false;
  }

  getCirculateToString(circulatedToString: string) {
    let newString = [];
    circulatedToString.split('|').forEach(element => {
      this.circulatedToArray.forEach((el) => {
        if (el.value == element) {
          newString.push(el.key);
        }
      });
    });
    return newString.join();

  }

  getCirculatedTo() {
    var circulatedTo = EnumConverter.ConvertEnumToArray(CirculatedTo);
    return circulatedTo;
  }

  public showAllRiskAssessment() {
    this.showRiskAssessment = true;
    this.addRiskAssessment = false;
    this.viewAssessment = false;
    this.editRiskAssessment = false;
    this.getRiskAssessments();
  }
}
