import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormNineteenService } from 'src/app/services/form-nineteen.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { AuditFormNineteen } from 'src/app/shared/models/audit-form-nineteen';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-form-nineteen-show',
  templateUrl: './form-nineteen-show.component.html',
  styleUrls: ['./form-nineteen-show.component.scss']
})
export class FormNineteenShowComponent extends BaseComponent implements OnInit {
  public locationList: Array<Location> = [];
  public auditForm: AuditFormNineteen;
  public locationName: string = "";
  public signoffBy: string = "";
  public userList: Array<User> = [];

  constructor(
    private locationService: LocationServices,
    private formNineteenService: FormNineteenService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {super();}

  ngOnInit(): void {
    if (!this.route.snapshot.params['id']) {
      alert('something went wrong!!');
      this.goBack();
    }
    this.getFormNineteen(this.route.snapshot.params['id']);
  }

  public goBack() {
    window.history.back();
  }

  private getFormNineteen(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formNineteenService.getForm(id).subscribe(
        (response) => {
          if (response) {
            this.auditForm = response;
            this.getUser(this.auditForm.signoffBy);
            this.getLocation(this.auditForm.locationId);
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
         this.signoffBy = (response.firstName == null || response.lastName == null) ? response.email : (response.firstName + " " + response.lastName)
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
