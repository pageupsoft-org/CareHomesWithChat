import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormThirteenService } from 'src/app/services/form-thirteen.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { RiskEntry } from 'src/app/shared/enums/risk-entry.enum';
import { UserType } from 'src/app/shared/enums/user-type.enum';
import { MedicationAuditForm } from 'src/app/shared/forms/medication-audit-form';
import { Location } from 'src/app/shared/models/location';
import { MedicationAudit } from 'src/app/shared/models/medication-audit';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-form-thirteen-show',
  templateUrl: './form-thirteen-show.component.html',
  styleUrls: ['./form-thirteen-show.component.scss']
})
export class FormThirteenShowComponent extends BaseComponent implements OnInit {
  @Input() medicationAudit: MedicationAudit;
  @Input() serviceUserData: PatientAdmission;
  @Output() showFormsThirteen: EventEmitter<any> = new EventEmitter<any>();

  public locationList: Array<Location> = [];
  public userList: Array<User> = [];
  public riskAction = RiskEntry;
  public medicationAuditForm: MedicationAudit;
  public isEdit: boolean = false;

  constructor(private locationService: LocationServices, private userService: UserService, private formThirteenService: FormThirteenService) { super(); }

  ngOnInit(): void {
    if (!this.serviceUserData || !this.medicationAudit) {
      return;
    }
    this.getFormThirteen(this.medicationAudit.id);
    this.getLocations();
    this.getUsers();
  }

  private getLocations() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.locationService.getLocations(careHomeId).subscribe(response => {
      if (response) {
        this.locationList = response;
      }
    }, (err) => {
      console.error("could not fetch locations ::" + err.error);
    });
  }

  private getUsers() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe(response => {
      if (response) {
        this.userList = response.filter(x => x.userType != UserType.Auditor);
      }
    }, (err) => {
      console.error("could not fetch users::" + err.error);
    })
  }

  private getFormThirteen(id) {
    this.SetLoading(true);
    this.formThirteenService.getForm(id).subscribe(response => {
      if (response) {
        this.medicationAuditForm = response;
      }
      this.SetLoading(false);
    }, (err) => {
      this.SetLoading(false);
      alert(err.error);
      this.showFormsThirteen.emit();
    })
  }
}
