import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LocationAuditRoutingModule } from './location-audit-routing.module';
import { FormEightComponent } from '../form-eight/form-eight/form-eight.component';
import { FormElevenComponent } from '../form-eleven/form-eleven/form-eleven.component';
import { FormFiveComponent } from '../form-five/form-five/form-five.component';
import { FormFourComponent } from '../form-four/form-four/form-four.component';
import { FormFourteenComponent } from '../form-fourteen/form-fourteen/form-fourteen.component';
import { FormNineComponent } from '../form-nine/form-nine/form-nine.component';
import { FormNineteenComponent } from '../form-nineteen/form-nineteen/form-nineteen.component';
import { FormOneComponent } from '../form-one/form-one/form-one.component';
import { FormSevenComponent } from '../form-seven/form-seven/form-seven.component';
import { FormSixComponent } from '../form-six/form-six/form-six.component';
import { FormSixteenComponent } from '../form-sixteen/form-sixteen/form-sixteen.component';
import { FormTenComponent } from '../form-ten/form-ten/form-ten.component';
import { FormThreeComponent } from '../form-three/form-three/form-three.component';
import { FormTwelveComponent } from '../form-twelve/form-twelve/form-twelve.component';
import { FormTwentyComponent } from '../form-twenty/form-twenty/form-twenty.component';
import { FormTwentyoneComponent } from '../form-twentyone/form-twentyone/form-twentyone.component';
import { FormTwoComponent } from '../form-two/form-two/form-two.component';
import { LocationAuditMasterComponent } from '../location-audit-master/location-audit-master.component';
import { FormSevenOverviewComponent } from '../form-seven/form-seven-overview/form-seven-overview.component';
import { FormNineOverviewComponent } from '../form-nine/form-nine-overview/form-nine-overview.component';
import { FormNineShowComponent } from '../form-nine/form-nine-show/form-nine-show.component';
import { FormEightOverviewComponent } from '../form-eight/form-eight-overview/form-eight-overview.component';
import { FormEightShowComponent } from '../form-eight/form-eight-show/form-eight-show.component';
import { FormTenShowComponent } from '../form-ten/form-ten-show/form-ten-show.component';
import { FormTenOverviewComponent } from '../form-ten/form-ten-overview/form-ten-overview.component';
import { FormTwelveShowComponent } from '../form-twelve/form-twelve-show/form-twelve-show.component';
import { FormTwelveOverviewComponent } from '../form-twelve/form-twelve-overview/form-twelve-overview.component';
import { FormFourteenOverviewComponent } from '../form-fourteen/form-fourteen-overview/form-fourteen-overview.component';
import { FormFourteenShowComponent } from '../form-fourteen/form-fourteen-show/form-fourteen-show.component';
import { FormSixteenOverviewComponent } from '../form-sixteen/form-sixteen-overview/form-sixteen-overview.component';
import { FormSixteenShowComponent } from '../form-sixteen/form-sixteen-show/form-sixteen-show.component';
import { FormTwentyOverviewComponent } from '../form-twenty/form-twenty-overview/form-twenty-overview.component';
import { FormTwentyShowComponent } from '../form-twenty/form-twenty-show/form-twenty-show.component';
import { FormTwoOverviewComponent } from '../form-two/form-two-overview/form-two-overview.component';
import { FormTwoShowComponent } from '../form-two/form-two-show/form-two-show.component';
import { FormElevenOverviewComponent } from '../form-eleven/form-eleven-overview/form-eleven-overview.component';
import { FormElevenShowComponent } from '../form-eleven/form-eleven-show/form-eleven-show.component';
import { FormNineteenShowComponent } from '../form-nineteen/form-nineteen-show/form-nineteen-show.component';
import { FormNineteenOverviewComponent } from '../form-nineteen/form-nineteen-overview/form-nineteen-overview.component';
import { FormTwentyoneOverviewComponent } from '../form-twentyone/form-twentyone-overview/form-twentyone-overview.component';
import { FormTwentyoneShowComponent } from '../form-twentyone/form-twentyone-show/form-twentyone-show.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@NgModule({
  declarations: [
    FormOneComponent,
    FormTwoComponent,
    FormThreeComponent,
    FormFourComponent,
    FormFiveComponent,
    FormSixComponent,
    FormSevenComponent,
    FormEightComponent,
    FormNineComponent,
    FormNineOverviewComponent,
    FormNineShowComponent,
    FormTenComponent,
    FormElevenComponent,
    FormTwelveComponent,
    FormFourteenComponent,
    FormSixteenComponent,
    FormNineteenComponent,
    FormTwentyComponent,
    FormTwentyoneComponent,
    LocationAuditMasterComponent,
    FormSevenOverviewComponent,
    FormEightOverviewComponent,
    FormEightShowComponent,
    FormTenShowComponent,
    FormTenOverviewComponent,
    FormTwelveShowComponent,
    FormTwelveOverviewComponent,
    FormFourteenOverviewComponent,
    FormFourteenShowComponent,
    FormSixteenOverviewComponent,
    FormSixteenShowComponent,
    FormTwentyOverviewComponent,
    FormTwentyShowComponent,
    FormTwoOverviewComponent,
    FormTwoShowComponent,
    FormElevenOverviewComponent,
    FormElevenShowComponent,
    FormNineteenShowComponent,
    FormNineteenOverviewComponent,
    FormTwentyoneOverviewComponent,
    FormTwentyoneShowComponent
  ],
  imports: [
    CommonModule,
    LocationAuditRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    TimepickerModule.forRoot()

  ]
})
export class LocationAuditModule { }
