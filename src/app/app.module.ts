import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { SiteHeaderComponent } from './components/portal/static/site-header/site-header.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { ZonePipePipe } from './shared/pipes/zone-pipe.pipe';
import { ColorSetterPipe } from './shared/pipes/color-setter.pipe';
import { SiteFooterComponent } from './components/portal/static/site-footer/site-footer.component';
import { ContentAreaComponent } from './components/portal/static/content-area/content-area.component';
import { DashboardComponent } from './components/portal/ui/dashboard/dashboard.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LocationCreateComponent } from './components/portal/ui/user-master/location/location-create/location-create.component';
import { ServiceUserOverviewComponent } from './components/portal/ui/service-user/service-user-overview/service-user-overview.component';
import { CreateComponent } from './components/portal/ui/user-form/create/create.component';
import { UserHeaderComponent } from './components/portal/ui/user-master/user-header/user-header.component';
import { CareHomeCreateComponent } from './components/portal/ui/user-master/care-home/care-home-create/care-home-create.component';
import { UserCreateComponent } from './components/portal/ui/user-master/user-form/user-create/user-create.component';
import { LoginComponent } from './components/portal/ui/login-page/login/login.component';
import { BaseComponent } from './shared/components/base/base.component';
import { TokenInterceptorService } from './services/token-intercepto.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CareHomesManagmentComponent } from './components/portal/ui/user-master/care-home/care-homes-managment/care-homes-managment.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationIndexComponent } from './components/portal/ui/user-master/location/location-index/location-index.component';
import { CourseIndexComponent } from './components/portal/ui/user-master/course/course-index/course-index.component';
import { AddCourseModalComponent } from './components/portal/ui/user-master/course/add-course-modal/add-course-modal.component';
import { ChangePasswordComponent } from './components/portal/ui/change-password/change-password.component';
import { EditUserComponent } from './components/portal/ui/user-form/edit-user/edit-user.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ServiceUserHeaderComponent } from './components/portal/ui/service-user/service-user-header/service-user-header.component';
import { RegistrationComponent } from './components/portal/ui/service-user/registration/registration.component';
import { MySharedPathwayComponent } from './components/portal/ui/service-user/my-shared-pathway-management/my-shared-pathway/my-shared-pathway.component';
import { RegistrationShowComponent } from './components/portal/ui/service-user/registration-show/registration-show.component';
import { RecoveryStarComponent } from './components/portal/ui/service-user/recovery-star-management/recovery-star/recovery-star.component';
import { MedicationComponent } from './components/portal/ui/service-user/medication-management/medication/medication.component';
import { ProgressnotesComponent } from './components/portal/ui/service-user/progress-notes-management/progressnotes/progressnotes.component';
import { FunctionalChecklistComponent } from './components/portal/ui/service-user/functional-checklist-management/functional-checklist/functional-checklist.component';
import { RiskAssessmentComponent } from './components/portal/ui/service-user/risk-assessment/risk-assessment/risk-assessment.component';
import { EditRiskAssessmentComponent } from './components/portal/ui/service-user/risk-assessment/edit-risk-assessment/edit-risk-assessment.component';
import { ShowRiskAssessmentComponent } from './components/portal/ui/service-user/risk-assessment/show-risk-assessment/show-risk-assessment.component';
import { RiskAssessmentOverviewComponent } from './components/portal/ui/service-user/risk-assessment/risk-assessment-overview/risk-assessment-overview.component';

import { MySharedPathwayOverviewComponent } from './components/portal/ui/service-user/my-shared-pathway-management/my-shared-pathway-overview/my-shared-pathway-overview.component';
import { ShowMySharedPathwayComponent } from './components/portal/ui/service-user/my-shared-pathway-management/show-my-shared-pathway/show-my-shared-pathway.component';
import { FormFifteenComponent } from './components/portal/ui/service-user/audit-forms/audit-form-fifteen/form-fifteen/form-fifteen.component';
import { PlansAndProgressPipePipe } from './shared/pipes/plans-and-progress-pipe.pipe';
import { RecoveryStartTestComponent } from './components/portal/ui/service-user/recovery-start-test/recovery-start-test.component';
import { RecoveryStarOverviewComponent } from './components/portal/ui/service-user/recovery-star-management/recovery-star-overview/recovery-star-overview.component';
import { ShowRecoveryStarComponent } from './components/portal/ui/service-user/recovery-star-management/show-recovery-star/show-recovery-star.component';
import { FormSeventeenComponent } from './components/portal/ui/service-user/audit-forms/audit-form-seventeen/form-seventeen/form-seventeen.component';
import { EditCareHomeComponent } from './components/portal/ui/user-master/care-home/edit-care-home/edit-care-home.component';
import { PermissionsMatrixComponent } from './components/portal/ui/permissions-matrix/permissions-matrix.component';
import { MedicationOverviewComponent } from './components/portal/ui/service-user/medication-management/medication-overview/medication-overview.component';
import { ShowMedicationComponent } from './components/portal/ui/service-user/medication-management/show-medication/show-medication.component';
import { ProgressNoteOverviewComponent } from './components/portal/ui/service-user/progress-notes-management/progress-note-overview/progress-note-overview.component';
import { ShowProgressNoteComponent } from './components/portal/ui/service-user/progress-notes-management/show-progress-note/show-progress-note.component';

import { FunctionalChecklistOverviewComponent } from './components/portal/ui/service-user/functional-checklist-management/functional-checklist-overview/functional-checklist-overview.component';
import { FunctionalChecklistShowComponent } from './components/portal/ui/service-user/functional-checklist-management/functional-checklist-show/functional-checklist-show.component';
import { FinanceOverviewComponent } from './components/portal/ui/service-user/finance-management/finance-overview/finance-overview.component';
import { FinanceShowComponent } from './components/portal/ui/service-user/finance-management/finance-show/finance-show.component';
import { FinanceComponent } from './components/portal/ui/service-user/finance-management/finance/finance.component';
import { SignOffListComponent } from './components/portal/ui/service-user/sign-off-list/sign-off-list.component';
import { UpdateAssessmentlogComponent } from './components/portal/ui/service-user/risk-assessment/update-assessmentlog/update-assessmentlog.component';
import { UpdateRecoverylogComponent } from './components/portal/ui/service-user/recovery-star-management/update-recoverylog/update-recoverylog.component';
import { UpdatedPathwaylogComponent } from './components/portal/ui/service-user/my-shared-pathway-management/updated-pathwaylog/updated-pathwaylog.component';
import { UpdatedRegistrationlogComponent } from './components/portal/ui/service-user/updated-registrationlog/updated-registrationlog.component';
import { CriteriaListComponent } from './components/portal/ui/zoning-board/criteria-management/criteria-list/criteria-list.component';
import { AddCriteriaModalComponent } from './components/portal/ui/zoning-board/criteria-management/add-criteria-modal/add-criteria-modal.component';
import { ZoningBoardMasterComponent } from './components/portal/ui/zoning-board/zoning-board-master/zoning-board-master.component';
import { AddActionModalComponent } from './components/portal/ui/zoning-board/criteria-management/add-action-modal/add-action-modal.component';
import { ActionMasterComponent } from './components/portal/ui/zoning-board/criteria-management/action-master/action-master.component';
import { DairyMasterComponent } from './components/portal/ui/zoning-board/dairy-management/dairy-master/dairy-master.component';
import { PatientAlertsMasterComponent } from './components/portal/ui/zoning-board/zoning-alert/patient-alerts-master/patient-alerts-master.component';
import { AddAlertModalComponent } from './components/portal/ui/zoning-board/zoning-alert/add-alert-modal/add-alert-modal.component';
import { AlertMasterComponent } from './components/portal/ui/zoning-board/zoning-alert/alert-master/alert-master.component';
import { AddPatientAlertModalComponent } from './components/portal/ui/zoning-board/zoning-alert/add-patient-alert-modal/add-patient-alert-modal.component';
import { ZoningBoardComponent } from './components/portal/ui/zoning-board/zoning-board/zoning-board.component';
import { EditPatientAlertModalComponent } from './components/portal/ui/zoning-board/zoning-alert/edit-patient-alert-modal/edit-patient-alert-modal.component';
import { PatientZoneLogModalComponent } from './components/portal/ui/zoning-board/patient-zone-log-modal/patient-zone-log-modal.component';
import { AddTaskModalComponent } from './components/portal/ui/zoning-board/dairy-management/add-task-modal/add-task-modal.component';
import { ZoningAlertColorPipe } from './shared/pipes/zoning-alert-color.pipe';
import { PatientZoneLogComponent } from './components/portal/ui/zoning-board/patient-zone-log/patient-zone-log.component';
import { ZoningBoardChartComponent } from './components/portal/ui/zoning-board/charts/zoning-board-chart/zoning-board-chart.component';

import { LatestLogModalComponent } from './components/portal/ui/zoning-board/latest-log-modal/latest-log-modal.component';
import { ShowTaskModalComponent } from './components/portal/ui/zoning-board/dairy-management/show-task-modal/show-task-modal.component';

// import { AngularFireMessagingModule } from '@angular/fire/messaging'; //TODO:generating error
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';

// import { AngularFireDatabaseModule } from '@angular/fire/database'; //TODO:generating error
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

// import { AngularFireAuthModule } from '@angular/fire/auth'; //TODO:generating error
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

// import { AngularFireModule } from '@angular/fire';

import { MessagingService } from './services/messaging.service';
import { AsyncPipe } from '@angular/common';
import { FormThirteenOverviewComponent } from './components/portal/ui/service-user/audit-forms/audit-form-thirteen/form-thirteen-overview/form-thirteen-overview.component';
import { FormThirteenComponent } from './components/portal/ui/service-user/audit-forms/audit-form-thirteen/form-thirteen/form-thirteen.component';
import { FormThirteenShowComponent } from './components/portal/ui/service-user/audit-forms/audit-form-thirteen/form-thirteen-show/form-thirteen-show.component';
import { FormFifteenOverviewComponent } from './components/portal/ui/service-user/audit-forms/audit-form-fifteen/form-fifteen-overview/form-fifteen-overview.component';
import { FormSeventeenOverviewComponent } from './components/portal/ui/service-user/audit-forms/audit-form-seventeen/form-seventeen-overview/form-seventeen-overview.component';
import { FormSeventeenShowComponent } from './components/portal/ui/service-user/audit-forms/audit-form-seventeen/form-seventeen-show/form-seventeen-show.component';
import { FormFifteenShowComponent } from './components/portal/ui/service-user/audit-forms/audit-form-fifteen/form-fifteen-show/form-fifteen-show.component';
import { AuditFormsComponent } from './components/portal/ui/service-user/audit-forms/service-user-audit-master/audit-forms.component';
import { FormSevenShowComponent } from './components/portal/ui/audit-forms/form-seven/form-seven-show/form-seven-show.component';
import { AssignedFormsComponent } from './components/portal/ui/user-assignment-master/assigned-forms/assigned-forms.component';
import { ServiceUserStatsComponent } from './components/portal/ui/dashboard-master/service-user-stats/service-user-stats.component';
import { UsersOverviewComponent } from './components/portal/ui/user-master/user-form/users-overview/users-overview.component';
import { UsersStatsComponent } from './components/portal/ui/dashboard-master/users-stats/users-stats.component';
import { AdminStatsComponent } from './components/portal/ui/dashboard-master/admin-stats/admin-stats.component';
import { SharedModule } from './shared/shared.module';
import { AuthGuard } from './AuthGuards/auth.guard';
import { AngularFireModule } from '@angular/fire/compat';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import {NgMessageKitModule} from 'ng-message-kit';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    PageNotFoundComponent,
    ZonePipePipe,
    SiteHeaderComponent,
    SiteFooterComponent,
    ContentAreaComponent,
    LocationCreateComponent,
    ServiceUserOverviewComponent,
    CreateComponent,
    UserHeaderComponent,
    CareHomeCreateComponent,
    UserCreateComponent,
    BaseComponent,
    CareHomesManagmentComponent,
    LocationIndexComponent,
    CourseIndexComponent,
    AddCourseModalComponent,
    ChangePasswordComponent,
    EditUserComponent,
    ServiceUserHeaderComponent,
    RegistrationComponent,
    MySharedPathwayComponent,
    RegistrationShowComponent,
    RecoveryStarComponent,
    MedicationComponent,
    ProgressnotesComponent,
    FunctionalChecklistComponent,
    RiskAssessmentComponent,
    EditRiskAssessmentComponent,
    ShowRiskAssessmentComponent,
    AuditFormsComponent,
    RiskAssessmentOverviewComponent,
    FormThirteenComponent,
    FormFifteenComponent,
    FormSeventeenComponent,
    MySharedPathwayOverviewComponent,
    ShowMySharedPathwayComponent,
    RecoveryStartTestComponent,
    PlansAndProgressPipePipe,
    RecoveryStartTestComponent,
    RecoveryStarOverviewComponent,
    ShowRecoveryStarComponent,
    EditCareHomeComponent,
    PermissionsMatrixComponent,
    MedicationOverviewComponent,
    ShowMedicationComponent,
    ProgressNoteOverviewComponent,
    ShowProgressNoteComponent,
    FunctionalChecklistOverviewComponent,
    FunctionalChecklistShowComponent,
    FinanceOverviewComponent,
    FinanceShowComponent,
    FinanceComponent,
    SignOffListComponent,
    UpdateAssessmentlogComponent,
    UpdateRecoverylogComponent,
    UpdatedPathwaylogComponent,
    UpdatedRegistrationlogComponent,
    CriteriaListComponent,
    AddCriteriaModalComponent,
    ZoningBoardMasterComponent,
    AddActionModalComponent,
    ActionMasterComponent,
    DairyMasterComponent,
    PatientAlertsMasterComponent,
    AddAlertModalComponent,
    AlertMasterComponent,
    AddPatientAlertModalComponent,
    ZoningBoardComponent,
    EditPatientAlertModalComponent,
    PatientZoneLogModalComponent,
    AddTaskModalComponent,
    ZoningAlertColorPipe,
    PatientZoneLogComponent,
    ZoningBoardChartComponent,
    // DASAComponent,
    LatestLogModalComponent,
    ShowTaskModalComponent,
    FormThirteenOverviewComponent,
    FormThirteenShowComponent,
    FormFifteenOverviewComponent,
    FormSeventeenOverviewComponent,
    FormSeventeenShowComponent,
    FormFifteenShowComponent,
    FormSevenShowComponent,
    AssignedFormsComponent,
    ServiceUserStatsComponent,
    UsersOverviewComponent,
    UsersStatsComponent,
    AdminStatsComponent,
    
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    AppRoutingModule,
    DragDropModule,
    BrowserAnimationsModule,
    HammerModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireModule,
    AngularFireMessagingModule,
    FormsModule,
    ReactiveFormsModule ,
    NgMultiSelectDropDownModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    SharedModule,
    NgMessageKitModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }, AuthGuard, MessagingService, AsyncPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
