import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/AuthGuards/auth.guard';

import { UserType } from 'src/app/shared/enums/user-type.enum';
import { Constants } from 'src/app/util/Constants';
import { LeaveManagementMasterComponent } from '../leave-management/leave-management-master/leave-management-master.component';
import { RosterOverviewComponent } from '../roster-overview/roster-overview.component';
import { RotaManagementComponent } from '../rota-management/rota-management.component';
import { UserWorkingHoursComponent } from '../user-working-hours/user-working-hours.component';

const routes: Routes = [
  {
    path: '',
    component: RosterOverviewComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }

  },
  {
    path: Constants.routes.rosterManagement.leaveManagementPath,
    component: LeaveManagementMasterComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser,UserType.User]
    }
  },
  {

    path: Constants.routes.rosterManagement.rotaManagementPath,
    component: RotaManagementComponent,

    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  {

    path: Constants.routes.rosterManagement.usersWorkingHourReportPath,
    component: UserWorkingHoursComponent,

    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RosterRoutingModule { }
