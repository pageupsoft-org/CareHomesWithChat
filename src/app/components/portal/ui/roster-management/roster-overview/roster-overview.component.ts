import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/util/Constants';
import { UserType } from '../../../../../shared/enums/user-type.enum';

@Component({
  selector: 'app-roster-overview',
  templateUrl: './roster-overview.component.html',
  styleUrls: ['./roster-overview.component.scss']
})
export class RosterOverviewComponent implements OnInit {

  public userType = UserType;
  public currentUserRole: number = Number((localStorage.getItem('_identity')) ? JSON.parse(localStorage.getItem('_identity')).role : '');

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public openTab(index: number) {
    if (index == 1) {
      this.router.navigate([Constants.routes.rosterManagement.leaveManagement()]);
    } else if (index == 2) {
      this.router.navigate([Constants.routes.rosterManagement.rotaManagement()]);
    }
    else {
      this.router.navigate([Constants.routes.rosterManagement.usersWorkingHourReport()]);
    }
  }

}
