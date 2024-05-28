import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Constants } from './util/Constants';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { DashboardComponent } from './components/portal/ui/dashboard/dashboard.component';
import { LocationCreateComponent } from './components/portal/ui/user-master/location/location-create/location-create.component';
import { ServiceUserOverviewComponent } from './components/portal/ui/service-user/service-user-overview/service-user-overview.component';
import { UserHeaderComponent } from './components/portal/ui/user-master/user-header/user-header.component';
import { LoginComponent } from './components/portal/ui/login-page/login/login.component';

import { ChangePasswordComponent } from './components/portal/ui/change-password/change-password.component';
import { EditUserComponent } from './components/portal/ui/user-form/edit-user/edit-user.component';
import { ServiceUserHeaderComponent } from './components/portal/ui/service-user/service-user-header/service-user-header.component';
import { RegistrationShowComponent } from './components/portal/ui/service-user/registration-show/registration-show.component';
import { RiskAssessmentComponent } from './components/portal/ui/service-user/risk-assessment/risk-assessment/risk-assessment.component';
import { ShowRiskAssessmentComponent } from './components/portal/ui/service-user/risk-assessment/show-risk-assessment/show-risk-assessment.component';

import { RecoveryStartTestComponent } from './components/portal/ui/service-user/recovery-start-test/recovery-start-test.component';
import { SignOffListComponent } from './components/portal/ui/service-user/sign-off-list/sign-off-list.component';
import { ZoningBoardMasterComponent } from './components/portal/ui/zoning-board/zoning-board-master/zoning-board-master.component';
import { AssignedFormsComponent } from './components/portal/ui/user-assignment-master/assigned-forms/assigned-forms.component';

import { UserType } from './shared/enums/user-type.enum';
import { AuthGuard } from './AuthGuards/auth.guard';

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full"
  },

  {
    path: "",
    // component: ContentAreaComponent,
    children: [
      { path: Constants.routes.dashboardPath, component: DashboardComponent },
    ],
    canActivate: [AuthGuard],
    data: {
      role: [UserType.WECAdmin, UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },

  {
    path: "login",
    component: LoginComponent
  },

  // Location Route
  // {
  //   path: '',
  //   children: [
  //     { path: Constants.routes.locationCreatePath, component: LocationCreateComponent },
  //     // { path: Constants.routes.locationEditPath, component: LocationEditComponent },
  //   ],
  //   canActivate: [AuthGuard]
  // },

  //user-master
  {
    path: '',
    children: [
      { path: Constants.routes.userMasterPath, component: UserHeaderComponent }
    ],
    canActivate: [AuthGuard],
    data: {
      role: [UserType.WECAdmin, UserType.Admin, UserType.SuperUser, UserType.Auditor]
    }
  },

  //  change password
  {
    path: '',
    children: [
      { path: Constants.routes.changePasswordPath, component: ChangePasswordComponent }
    ],
    canActivate: [AuthGuard],
    data: {
      role: [UserType.WECAdmin, UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },

  // profile edit
  {
    path: '',
    children: [
      { path: Constants.routes.userProfilePath, component: EditUserComponent }
    ],
    canActivate: [AuthGuard],
    data: {
      role: []
    }
  },


  /** service user/patient create path */

  {
    path: '',
    children: [
      { path: Constants.routes.serviceUserPath, component: ServiceUserHeaderComponent },
    ],
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User]
    }
  },
  {
    path: '',
    children: [
      { path: Constants.routes.patientRegistrationEditPath + ":id", component: ServiceUserHeaderComponent },

    ],
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User]
    }
  },
  {
    path: '',
    children: [
      { path: Constants.routes.patientRegistrationShowPath + ":id", component: RegistrationShowComponent },
    ],
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  /** service user / patient list path */
  {
    path: '',
    children: [
      { path: Constants.routes.serviceUserOverviewPath, component: ServiceUserOverviewComponent }
    ],
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  // {
  //   path: '',
  //   children: [
  //     { path: Constants.routes.riskAssessmentPath + ":id", component: RiskAssessmentComponent },
  //   ],
  //   canActivate: [AuthGuard],
  //   data: {
  //     role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
  //   }
  // },
  // {
  //   path: '',
  //   children: [
  //     { path: Constants.routes.showRiskAssessmentPath + ":id", component: ShowRiskAssessmentComponent },
  //   ],
  //   canActivate: [AuthGuard],
  //   data: {
  //     role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
  //   }
  // },
  {
    path: '',
    children: [
      { path: Constants.routes.signOffListPath + ":formId", component: SignOffListComponent },

    ],
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser]
    }
  },
  {
    path: '',
    children: [
      { path: Constants.routes.auditFormsListPath + ":formId", component: AssignedFormsComponent },
    ],
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User]
    }
  },
  // {
  //   path: '',
  //   children: [
  //     { path: "recovery-star-test", component: RecoveryStartTestComponent }
  //   ],
  //   canActivate: [AuthGuard],
  //   data: {
  //     role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
  //   }
  // },

  //Zone
  {
    path: '',
    children: [
      { path: Constants.routes.zoneMasterPath, component: ZoningBoardMasterComponent }
    ],
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User]
    }
  },

  // location-audits
  {
    path: 'location-audit',
    loadChildren: () => import('./components/portal/ui/audit-forms/location-audit/location-audit.module').then(m => m.LocationAuditModule),

  },

  // roster-module
  {
    path: 'roster-management',
    loadChildren: () => import('./components/portal/ui/roster-management/roster/roster.module').then(m => m.RosterModule),
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }

  },

  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', initialNavigation: 'enabledBlocking' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
