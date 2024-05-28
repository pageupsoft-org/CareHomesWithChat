import { Component, Input, OnInit } from '@angular/core';
import { FunctionalChecklistService } from 'src/app/services/functional-checklist.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { FunctionalChecklist } from 'src/app/shared/models/functional-checklist';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-functional-checklist-overview',
  templateUrl: './functional-checklist-overview.component.html',
  styleUrls: ['./functional-checklist-overview.component.scss']
})
export class FunctionalChecklistOverviewComponent extends BaseComponent implements OnInit {
  @Input() userData: PatientAdmission;

  public showNotification: boolean = false;
  public functionalities: Array<FunctionalChecklist> = [];
  public functionalChecklistList: Boolean = true;
  public showFunctionalChecklist: Boolean = false;
  public functionalityData: FunctionalChecklist;
  private usersList: Array<User> = [];

  constructor(private functionalityService: FunctionalChecklistService, private userService: UserService) { super(); }

  ngOnInit(): void {
    if (!this.userData) {
      this.showNotification = true;
      return;
    }
    this.SetLoading(true);
    this.getUsers();
    this.getFunctionalities();
  }

  public getFunctionalities() {
    this.showFunctionalChecklist = false;
    this.functionalChecklistList = true
      ;
    this.functionalityData = null
    this.SetLoading(true);
    this.functionalityService.getFunctionalities(this.userData.id).subscribe(response => {
      if (response.length > 0) {
        this.functionalities = response;
      } else {
        this.functionalities = [];
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  public createFunctionality() {
    this.showFunctionalChecklist = false;
    this.functionalChecklistList = false;
    this.functionalityData = null
  }

  public editFunctionality(functionality: FunctionalChecklist) {
    this.showFunctionalChecklist = false;
    this.functionalChecklistList = false;
    this.functionalityData = functionality;
  }

  public removeFunctionalty(functionalityId: number) {
    if (functionalityId) {
      this.SetLoading(true);
      if (confirm("Are you sure you want to remove this record?")) {
        this.functionalityService.deleteFunctionality(functionalityId).subscribe(response => {
          if (response) {
            alert("Record deleted successfully");
            this.getFunctionalities();
          }
          this.SetLoading(false);
        }, err => {
          this.SetLoading(false);
          alert(err.error);
        })
      }
    }
    this.SetLoading(false);
  }

  public viewMedication(functionality: FunctionalChecklist) {
    this.showFunctionalChecklist = true;
    this.functionalChecklistList = false;
    this.functionalityData = functionality;
  }

  public getCompletedBy(userId: number) {
    if (userId) {
      let userName = '';
      this.usersList.forEach((el) => {
        if (el.id == userId) {
          userName = (el.firstName == null && el.lastName == null) ? el.email : el.firstName + " " + el.lastName;
        }
      });
      return userName

    }
  }

  private getUsers() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe(response => {
      if (response.length > 0) {
        this.usersList = response;
      }
    }, err => {
      console.error("could not fetch users::" + err.error);
    })

  }

}
