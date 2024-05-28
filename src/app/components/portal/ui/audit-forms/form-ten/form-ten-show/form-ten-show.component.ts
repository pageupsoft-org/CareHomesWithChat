import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormTenService } from 'src/app/services/form-ten.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { ApplianceName } from 'src/app/shared/enums/appliance-name.enum';
import { AreaName } from 'src/app/shared/enums/area-name.enum';
import { FloorName } from 'src/app/shared/enums/floor-name.enum';
import { AuditFormTen } from 'src/app/shared/models/audit-form-ten';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-form-ten-show',
  templateUrl: './form-ten-show.component.html',
  styleUrls: ['./form-ten-show.component.scss'],
})
export class FormTenShowComponent extends BaseComponent implements OnInit {
  public locationList: Array<Location> = [];
  public auditForm: AuditFormTen;
  public floorEnum = FloorName;
  public areaEnum = AreaName;
  public applianceEnum = ApplianceName;
  public locationName: string = "";
  public signoffBy: string = "";
  public userList: Array<User> = [];

  constructor(
    private locationService: LocationServices,
    private formtenService: FormTenService,
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
    this.getFormTen(this.route.snapshot.params['id']);
  }

  public goBack() {
    window.history.back();
  }

  private getFormTen(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formtenService.getForm(id).subscribe(
        (response) => {
          if (response) {
            this.auditForm = response;
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

  private getLocation(id: number) {
    if (id) {
      this.locationService.getLocation(id).subscribe(
        (response) => {
          if (response) {
            this.locationName = response.name;
          }
        },
        (err) => {
          console.error('could not fetch locations ::' + err.error);
        }
      );
    }
  }

  private getUser(id: number) {
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
