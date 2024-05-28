import { Component, OnInit } from '@angular/core';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';

@Component({
  selector: 'app-service-user-header',
  templateUrl: './service-user-header.component.html',
  styleUrls: ['./service-user-header.component.scss']
})
export class ServiceUserHeaderComponent implements OnInit {
  tabIndex = 1;
  activeTab: number = 1;
  userData: PatientAdmission;
  constructor() { }

  ngOnInit(): void {
    this.onTabChange(1);
  }

  onTabChange(index) {
    this.tabIndex = index;
    this.activeTab = index;
  }
  
  onCompleteRegistration(event: any) {
    // this.onTabChange(2);
    this.userData = event;
  }

}
