import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormNineService } from 'src/app/services/form-nine.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { AuditFormNine } from 'src/app/shared/models/audit-form-nine';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-form-nine-show',
  templateUrl: './form-nine-show.component.html',
  styleUrls: ['./form-nine-show.component.scss'],
})
export class FormNineShowComponent extends BaseComponent implements OnInit {
  public locationList: Array<Location> = [];
  public auditForm: AuditFormNine;
  public userList: Array<User> = [];
  public locationName: string = "";
  public signOffBy: string = "";

  constructor(
    private locationService: LocationServices,
    private formnineService: FormNineService,
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
    this.getFormNine(this.route.snapshot.params['id']);
  }

  public goBack() {
    window.history.back();
  }

  public getLocation(locationId: number) {
    if (locationId) {
      this.locationService.getLocation(locationId).subscribe((response) => {
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

  private getFormNine(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formnineService.getForm(id).subscribe((response) => {
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

  public getUser(id: number) {
    if (id) {
      this.SetLoading(true);

      this.userService.getUser(id).subscribe((response) => {
        if (response)
          return this.signOffBy = (response.firstName == null || response.lastName == null) ? response.email : (response.firstName + " " + response.lastName)
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
