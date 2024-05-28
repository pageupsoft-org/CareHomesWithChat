import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RosterRoutingModule } from './roster-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LeaveManagementMasterComponent } from '../leave-management/leave-management-master/leave-management-master.component';
import { RosterOverviewComponent } from '../roster-overview/roster-overview.component';
import { UserLeavesOverviewComponent } from '../leave-management/user-leaves-overview/user-leaves-overview.component';
import { ApplyUserLeaveComponent } from '../leave-management/apply-user-leave/apply-user-leave.component';
import { CreditLeaveOverviewComponent } from '../leave-management/credit-leave-overview/credit-leave-overview.component';
import { CreditLeaveComponent } from '../leave-management/credit-leave/credit-leave.component';
import { FinancialYearModalComponent } from '../fianial-year-management/financial-year-modal/financial-year-modal.component';
import { FinancialYearOverviewComponent } from '../fianial-year-management/financial-year-overview/financial-year-overview.component';
import { RotaManagementComponent } from '../rota-management/rota-management.component';

import { FullCalendarModule } from '@fullcalendar/angular';
import { SetFinancialYearModalComponent } from '../leave-management-master/fianial-year-management/set-financial-year-modal/set-financial-year-modal.component';
import { ShowShiftModalComponent } from '../show-shift-modal/show-shift-modal.component';
import { AddShiftModalComponent } from '../add-shift-modal/add-shift-modal.component';
import { UserWorkingHoursComponent } from '../user-working-hours/user-working-hours.component';

// FullCalendarModule.registerPlugins([ //TODO:generating error
//   interactionPlugin,
//   dayGridPlugin,
//   timeGridPlugin
// ]);

@NgModule({
  declarations: [LeaveManagementMasterComponent,
    RosterOverviewComponent,
    UserLeavesOverviewComponent,
    ApplyUserLeaveComponent,
    CreditLeaveOverviewComponent,
    CreditLeaveComponent,
    FinancialYearOverviewComponent,
    FinancialYearModalComponent,
    RotaManagementComponent,
    SetFinancialYearModalComponent,
    ShowShiftModalComponent,
    AddShiftModalComponent,
    UserWorkingHoursComponent
  ],
  imports: [
    CommonModule,
    RosterRoutingModule,
    FullCalendarModule,
    SharedModule
  ]
})
export class RosterModule { }
