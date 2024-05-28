import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Constants } from 'src/app/util/Constants';
import { LocationAuditMasterComponent } from '../location-audit-master/location-audit-master.component';
import { FormSevenComponent } from '../form-seven/form-seven/form-seven.component';
import { FormSevenOverviewComponent } from '../form-seven/form-seven-overview/form-seven-overview.component';
import { FormSevenShowComponent } from '../form-seven/form-seven-show/form-seven-show.component';
import { FormNineOverviewComponent } from '../form-nine/form-nine-overview/form-nine-overview.component';
import { FormNineComponent } from '../form-nine/form-nine/form-nine.component';
import { FormNineShowComponent } from '../form-nine/form-nine-show/form-nine-show.component';
import { FormEightOverviewComponent } from '../form-eight/form-eight-overview/form-eight-overview.component';
import { FormEightComponent } from '../form-eight/form-eight/form-eight.component';
import { FormEightShowComponent } from '../form-eight/form-eight-show/form-eight-show.component';
import { FormTenOverviewComponent } from '../form-ten/form-ten-overview/form-ten-overview.component';
import { FormTenComponent } from '../form-ten/form-ten/form-ten.component';
import { FormTenShowComponent } from '../form-ten/form-ten-show/form-ten-show.component';
import { FormTwelveOverviewComponent } from '../form-twelve/form-twelve-overview/form-twelve-overview.component';
import { FormTwelveComponent } from '../form-twelve/form-twelve/form-twelve.component';
import { FormTwelveShowComponent } from '../form-twelve/form-twelve-show/form-twelve-show.component';
import { FormFourteenOverviewComponent } from '../form-fourteen/form-fourteen-overview/form-fourteen-overview.component';
import { FormFourteenComponent } from '../form-fourteen/form-fourteen/form-fourteen.component';
import { FormFourteenShowComponent } from '../form-fourteen/form-fourteen-show/form-fourteen-show.component';
import { FormSixteenOverviewComponent } from '../form-sixteen/form-sixteen-overview/form-sixteen-overview.component';
import { FormSixteenComponent } from '../form-sixteen/form-sixteen/form-sixteen.component';
import { FormSixteenShowComponent } from '../form-sixteen/form-sixteen-show/form-sixteen-show.component';
import { FormTwentyOverviewComponent } from '../form-twenty/form-twenty-overview/form-twenty-overview.component';
import { FormTwentyComponent } from '../form-twenty/form-twenty/form-twenty.component';
import { FormTwentyShowComponent } from '../form-twenty/form-twenty-show/form-twenty-show.component';
import { FormTwoComponent } from '../form-two/form-two/form-two.component';
import { FormTwoOverviewComponent } from '../form-two/form-two-overview/form-two-overview.component';
import { FormTwoShowComponent } from '../form-two/form-two-show/form-two-show.component';
import { FormElevenOverviewComponent } from '../form-eleven/form-eleven-overview/form-eleven-overview.component';
import { FormElevenComponent } from '../form-eleven/form-eleven/form-eleven.component';
import { FormElevenShowComponent } from '../form-eleven/form-eleven-show/form-eleven-show.component';
import { FormNineteenOverviewComponent } from '../form-nineteen/form-nineteen-overview/form-nineteen-overview.component';
import { FormNineteenComponent } from '../form-nineteen/form-nineteen/form-nineteen.component';
import { FormNineteenShowComponent } from '../form-nineteen/form-nineteen-show/form-nineteen-show.component';
import { FormTwentyoneOverviewComponent } from '../form-twentyone/form-twentyone-overview/form-twentyone-overview.component';
import { FormTwentyoneComponent } from '../form-twentyone/form-twentyone/form-twentyone.component';
import { FormTwentyoneShowComponent } from '../form-twentyone/form-twentyone-show/form-twentyone-show.component';
import { AuthGuard } from 'src/app/AuthGuards/auth.guard';
import { UserType } from 'src/app/shared/enums/user-type.enum';


const routes: Routes = [
  {
    path: '',
    component: LocationAuditMasterComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },

  //#region Form Two Paths

  {
    path: Constants.routes.locationAudits.formTwoOverviewPath, component: FormTwoOverviewComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  {
    path: Constants.routes.locationAudits.formTwoEditPath + ":id", component: FormTwoComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User]
    }
  },
  {
    path: Constants.routes.locationAudits.formTwoShowPath + ":id", component: FormTwoShowComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  {
    path: Constants.routes.locationAudits.formTwoPath, component: FormTwoComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User]
    }
  },
  //#endregion Form Two Paths

  //#region  Form Seven Paths
  {
    path: Constants.routes.locationAudits.formSevenOverviewPath, component: FormSevenOverviewComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  {
    path: Constants.routes.locationAudits.formSevenPath, component: FormSevenComponent, canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser]
    }
  },
  {
    path: Constants.routes.locationAudits.formSevenEditPath + ":id", component: FormSevenComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User]
    }
  },
  {
    path: Constants.routes.locationAudits.formSevenShowPath + ":id", component: FormSevenShowComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  //#endregion 

  //#region  Form Eight Path

  {
    path: Constants.routes.locationAudits.formEightOverviewPath, component: FormEightOverviewComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  {
    path: Constants.routes.locationAudits.formEightPath, component: FormEightComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser]
    }
  },
  {
    path: Constants.routes.locationAudits.formEightEditPath + ":id", component: FormEightComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User]
    }
  },

  {
    path: Constants.routes.locationAudits.formEightShowPath + ":id", component: FormEightShowComponent, canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  //#endregion

  //#region  Form Nine Path

  {
    path: Constants.routes.locationAudits.formNineOverviewPath, component: FormNineOverviewComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  {
    path: Constants.routes.locationAudits.formNinePath, component: FormNineComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser]
    }
  },
  {
    path: Constants.routes.locationAudits.formNineEditPath + ":id", component: FormNineComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User]
    }
  },
  {
    path: Constants.routes.locationAudits.formNineShowPath + ":id", component: FormNineShowComponent, canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  //#endregion

  //#region  Form Ten Path

  {
    path: Constants.routes.locationAudits.formTenOverviewPath, component: FormTenOverviewComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  {
    path: Constants.routes.locationAudits.formTenPath, component: FormTenComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser]
    }
  },
  {
    path: Constants.routes.locationAudits.formTenEditPath + ":id", component: FormTenComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User]
    }
  },

  {
    path: Constants.routes.locationAudits.formTenShowPath + ":id", component: FormTenShowComponent, canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  //#endregion

  //#region  Form Twelve  Path

  {
    path: Constants.routes.locationAudits.formTwelveOverviewPath, component: FormTwelveOverviewComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  {
    path: Constants.routes.locationAudits.formTwelvePath, component: FormTwelveComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser]
    }
  },
  {
    path: Constants.routes.locationAudits.formTwelveEditPath + ":id", component: FormTwelveComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User]
    }
  },

  {
    path: Constants.routes.locationAudits.formTwelveShowPath + ":id", component: FormTwelveShowComponent, canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  //#endregion

  //#region  Form Fourteen  Path

  {
    path: Constants.routes.locationAudits.formFourteenOverviewPath, component: FormFourteenOverviewComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  {
    path: Constants.routes.locationAudits.formFourteenPath, component: FormFourteenComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser]
    }
  },
  {
    path: Constants.routes.locationAudits.formFourteenEditPath + ":id", component: FormFourteenComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User]
    }
  },

  {
    path: Constants.routes.locationAudits.formFourteenShowPath + ":id", component: FormFourteenShowComponent, canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  //#endregion

  //#region  Form Sixteen  Path

  {
    path: Constants.routes.locationAudits.formSixteenOverviewPath, component: FormSixteenOverviewComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  {
    path: Constants.routes.locationAudits.formSixteenPath, component: FormSixteenComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser]
    }
  },
  {
    path: Constants.routes.locationAudits.formSixteenEditPath + ":id", component: FormSixteenComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User]
    }
  },

  {
    path: Constants.routes.locationAudits.formSixteenShowPath + ":id", component: FormSixteenShowComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  //#endregion

  //#region  Form Twenty  Path

  {
    path: Constants.routes.locationAudits.formTwentyOverviewPath, component: FormTwentyOverviewComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  {
    path: Constants.routes.locationAudits.formTwentyPath, component: FormTwentyComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser]
    }
  },
  {
    path: Constants.routes.locationAudits.formTwentyEditPath + ":id", component: FormTwentyComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User]
    }
  },
  {
    path: Constants.routes.locationAudits.formTwentyShowPath + ":id", component: FormTwentyShowComponent, canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  //#endregion

  //#region  Form Eleven Path

  {
    path: Constants.routes.locationAudits.formElevenOverviewPath, component: FormElevenOverviewComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  {
    path: Constants.routes.locationAudits.formElevenPath, component: FormElevenComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser]
    }
  },
  {
    path: Constants.routes.locationAudits.formElevenEditPath + ":id", component: FormElevenComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User]
    }
  },

  {
    path: Constants.routes.locationAudits.formElevenShowPath + ":id", component: FormElevenShowComponent, canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  //#endregion

  //#region  Form Nineteen Path

  {
    path: Constants.routes.locationAudits.formNineteenOverviewPath, component: FormNineteenOverviewComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  {
    path: Constants.routes.locationAudits.formNineteenPath, component: FormNineteenComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser]
    }
  },
  {
    path: Constants.routes.locationAudits.formNineteenEditPath + ":id", component: FormNineteenComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User]
    }
  },

  {
    path: Constants.routes.locationAudits.formNineteenShowPath + ":id", component: FormNineteenShowComponent, canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  //#endregion

  //#region  Form 21 Path

  {
    path: Constants.routes.locationAudits.formTwentyOneOverviewPath, component: FormTwentyoneOverviewComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },
  {
    path: Constants.routes.locationAudits.formTwentyOnePath, component: FormTwentyoneComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser]
    }
  },
  {
    path: Constants.routes.locationAudits.formTwentyOneEditPath + ":id", component: FormTwentyoneComponent,
    canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User]
    }
  },
  {
    path: Constants.routes.locationAudits.formTwentyOneShowPath + ":id", component: FormTwentyoneShowComponent, canActivate: [AuthGuard],
    data: {
      role: [UserType.Admin, UserType.SuperUser, UserType.User, UserType.Auditor]
    }
  },

  //#endregion

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ], exports: [RouterModule]
})
export class LocationAuditRoutingModule { }
