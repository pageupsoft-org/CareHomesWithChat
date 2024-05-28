import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FunctionalChecklistService } from 'src/app/services/functional-checklist.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { CirculatedTo } from 'src/app/shared/enums/circulated-to.enum';
import { FormName } from 'src/app/shared/enums/form-name.enum';
import { FunctionalChecklist } from 'src/app/shared/models/functional-checklist';
import { Location } from 'src/app/shared/models/location';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/util/Constants';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-functional-checklist',
  templateUrl: './functional-checklist.component.html',
  styleUrls: ['./functional-checklist.component.scss']
})
export class FunctionalChecklistComponent extends BaseComponent implements OnInit {
  @Input() userData: PatientAdmission;
  @Input() functionalityData: FunctionalChecklist;
  @Input() isReload: boolean;
  @Output() getFunctionalities: EventEmitter<any> = new EventEmitter<any>();


  public functionalChecklist: FunctionalChecklist;
  public usersList: User[] = [];
  public circulatedToEnum = CirculatedTo;
  public circulatedToArray: Array<any> = [];
  public circulateTo: Array<number> = [];

  public totalScore: number = 0;
  public zeroCount: number = 0;
  public maxScore: number = 0;
  public locationList: Array<Location> = [];
  public positon: string = '';
  private scores: Array<any> = [];
  public isEdit: boolean = false;
  public currentUserId: number = 0;
  public formName=FormName;


  constructor(private userService: UserService, private functionalityService: FunctionalChecklistService, private locationService: LocationServices, private router: Router) { super(); }

  ngOnInit(): void {
    this.SetLoading(true);
    this.getUsers();
    this.circulatedToArray = this.getCirculatedTo();
    this.getLocations();
    if (this.functionalityData) {
      this.isEdit = true;
      this.setValues();
    } else {
      this.functionalChecklist = new FunctionalChecklist();
      this.functionalChecklist.completedBy = Number(JSON.parse(localStorage.getItem('_identity')).id);
      if (this.currentUserRole == this.userType.Admin || this.currentUserRole == this.userType.SuperUser) {
        this.functionalChecklist.signOffBy = Number(JSON.parse(localStorage.getItem('_identity')).id);
        this.functionalChecklist.isSignOff = true;
      }

      this.objectKeyMap();
    }
    this.SetLoading(false);

  }

  public onSubmit() {
    if (!this.functionalChecklist.completedBy) {
      alert("please select complete by");
      return;
    }
    if (!this.functionalChecklist.completedDate) {
      alert("please select complete date");
      return;
    }
    if (!this.functionalChecklist.nextReviewDate) {
      alert("please select next review date");
      return;
    }
    if (!this.functionalChecklist.circulatedTo) {
      alert("please select circulated to");
      return;
    }
    if (this.scores.length <= 0) {
      alert("Please select atleat one score");
      return;
    }
    this.SetLoading(true);
    this.functionalChecklist.patientId = this.userData.id;
    this.functionalChecklist.totalScore = this.totalScore;
    this.functionalChecklist.calculatedScore = this.maxScore;

    if (this.isEdit) {
      this.updateFunctionality();
    } else {
      this.addFunctionality();
    }
  }

  public getFunctionalityList() {
    if (this.isReload) {
      // location.reload();   
      this.router.navigate([Constants.routes.dashboard()]);

    } else {
      this.getFunctionalities.emit();
    }
  }

  public changeCirculated(option, event) {
    if (event.target.checked) {
      this.circulateTo.push(option.value);
    } else {
      for (var i = 0; i < this.circulatedToArray.length; i++) {
        if (this.circulateTo[i] == option.value) {
          this.circulateTo.splice(i, 1);
        }
      }
    }
    this.functionalChecklist.circulatedTo = this.circulateTo.join("|");
  }

  public isCirculatedChecked(value) {
    if (this.circulateTo.includes(value)) {
      return true;
    } else {
      return false;
    }
  }

  public changeScore(index: string, value: number) {
    if (this.scoreExists(index, value)) {
      // return;
    } else {
      this.scores.push({ "index": index, "value": value });
    }
    this.getTotalScore();
  }



  private scoreExists(index, value) {
    return this.scores.some(function (el) {
      if (el.index === index) {
        el.value = value;
        return true;
      }
    });
  }

  public getTotalScore() {
    // return this.totalScore;
    let total = 0;
    total = this.scores.reduce((n, { value }) => n + value, 0);  //get_total or sum of array
    this.zeroCount = this.scores.filter(n => n.value == 0).length; // get zero count
    return this.totalScore = total - this.zeroCount;
  }

  public getMaxScore() {
    return this.maxScore = 280 - this.scores.filter(n => n.value == 0).length;;
  }

  public getCalculation(value: number) {
    return Math.round((this.maxScore / 5) * value);
  }

  public getLocationName(locationId: any) {
    let locationName = '';
    this.locationList.forEach(element => {
      if (element.id == locationId) {
        locationName = element.name;
      }
    })
    return locationName;
  }

  public setPosition(event: any) {
    this.positon = this.usersList.find(x => x.id == event).position

  }

  private getUsers() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe(response => {
      if (response) {
        this.usersList = response;
        if (this.functionalityData) {
          this.setPosition(this.functionalChecklist.completedBy);
        }
      }
    }, err => {
      console.error("could not fetch users :: " + err.error);
    })
  }

  private getCirculatedTo() {
    return EnumConverter.ConvertEnumToArray(this.circulatedToEnum);
  }

  private addFunctionality() {
    this.functionalityService.addFunctionality(this.functionalChecklist).subscribe(response => {
      if (response) {
        alert("Record added successfully");
        this.getFunctionalityList();
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private updateFunctionality() {
    this.SetLoading(true);
    if (this.currentUserId == this.functionalChecklist.signOffBy) {
      this.functionalChecklist.isSignOff = true;
    }
    this.functionalityService.updateFunctionality(this.functionalChecklist).subscribe(response => {
      if (response) {
        alert("Record updated successfully");

        this.getFunctionalityList();

      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  private setValues() {
    this.currentUserId = Number((localStorage.getItem('_identity')) ? JSON.parse(localStorage.getItem('_identity')).id : '');
    this.functionalChecklist = this.functionalityData;

    // this.scores = Object.keys(this.functionalChecklist).map(key => ({ index: key, value: this.functionalChecklist[key] }));

    // this.scores = this.scores.filter(x => x.index != "id" && x.index != "patientId" && x.index != "additionalNotes" && x.index != "calculatedScore" && x.index != "totalScore" && x.index != "completedBy" && x.index != "completedDate" && x.index != "nextReviewDate" && x.index != "circulatedTo" && x.index != "signOffBy" && x.index != "isSignOff")
    this.objectKeyMap();
    let total = this.scores.reduce((n, { value }) => n + value, 0)
    this.zeroCount = this.scores.filter(n => n.value == 0).length;
    this.totalScore = total - this.zeroCount;
    this.totalScore = this.functionalChecklist.totalScore;
    this.maxScore = this.functionalChecklist.calculatedScore;

    this.functionalityData.circulatedTo.split('|').forEach(element => {
      this.circulateTo.push(Number(element));
    });
  }

  private getLocations() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.locationService.getLocations(careHomeId).subscribe(response => {
      if (response) {
        this.locationList = response;
      }
    }, err => {
      console.error('could not fetch location::' + err.error);
    });
  }

  private objectKeyMap() {
    this.scores = Object.keys(this.functionalChecklist).map(key => ({ index: key, value: this.functionalChecklist[key] }));

    this.scores = this.scores.filter(x => x.index != "id" && x.index != "patientId" && x.index != "additionalNotes" && x.index != "calculatedScore" && x.index != "totalScore" && x.index != "completedBy" && x.index != "completedDate" && x.index != "nextReviewDate" && x.index != "circulatedTo" && x.index != "signOffBy" && x.index != "isSignOff")

  }
}
