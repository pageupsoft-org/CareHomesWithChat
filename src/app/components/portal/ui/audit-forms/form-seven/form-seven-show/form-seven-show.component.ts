import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormSevenService } from 'src/app/services/form-seven.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { RiskEntry } from 'src/app/shared/enums/risk-entry.enum';
import { AuditFormSeven } from 'src/app/shared/models/audit-form-seven';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-form-seven-show',
  templateUrl: './form-seven-show.component.html',
  styleUrls: ['./form-seven-show.component.scss'],
})
export class FormSevenShowComponent extends BaseComponent implements OnInit {
  public locationList: Array<Location> = [];
  public auditForm: AuditFormSeven;
  public riskEntry = RiskEntry;
  public userList: Array<User> = [];
  public locationName: string = "-";
  public signoffBy: string = "-";

  constructor(
    private locationService: LocationServices,
    private formsevenService: FormSevenService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    if (!this.route.snapshot.params['id']) {
      alert('something went wrong!!');
      this.goBack();
    }
    this.getFormSeven(this.route.snapshot.params['id']);
  }

  public goBack() {
    // this.getForms.emit();
    window.history.back();
  }

  public getLocation(id: number) {
    if (id) {
      this.locationService.getLocation(id).subscribe(
        (response) => {
          if (response) {
            return this.locationName = response.name;
          }
        },
        (err) => {
          console.error('could not fetch locations ::' + err.error);
        }
      );
    }
  }

  private getFormSeven(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formsevenService.getForm(id).subscribe(
        (response) => {
          if (response) {
            this.auditForm = response;
            this.getLocation(this.auditForm.locationId);
            if (this.auditForm.signoffBy)
              this.getUser(this.auditForm.signoffBy);
          }
          this.SetLoading(false);
        },
        (err) => {
          this.SetLoading(false);
          alert(err.error);
        }
      );
    }
  }

  public getUser(id: number) {
    if (id) {
      this.SetLoading(true);

      this.userService.getUser(id).subscribe((response) => {
        if (response)
          return this.signoffBy = (response.firstName == null || response.lastName == null) ? response.email : (response.firstName + " " + response.lastName)

        this.SetLoading(false);
      },
        (err) => {
          this.SetLoading(false);
          console.error('could not fetch users::' + err.error);
        }
      );
    }
  }
}
