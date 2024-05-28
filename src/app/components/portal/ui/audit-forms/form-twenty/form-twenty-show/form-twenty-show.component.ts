import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormTwentyService } from 'src/app/services/form-twenty.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { RiskEntry } from 'src/app/shared/enums/risk-entry.enum';
import { AuditFormTwenty } from 'src/app/shared/models/audit-form-twenty';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-form-twenty-show',
  templateUrl: './form-twenty-show.component.html',
  styleUrls: ['./form-twenty-show.component.scss'],
})
export class FormTwentyShowComponent extends BaseComponent implements OnInit {
  public locationList: Array<Location> = [];
  public auditForm: AuditFormTwenty;
  public riskEntry = RiskEntry;
  public locationName: string = "";
  public userList: Array<User> = [];

  constructor(
    private locationService: LocationServices,
    private formtwentyService: FormTwentyService,
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
    this.getUsers();
    this.getFormTwenty(this.route.snapshot.params['id']);
  }

  public goBack() {
    // this.getForms.emit();
    window.history.back();
  }

  public getUserName(userId: number) {
    if (userId && this.userList.length > 0) {
      let name;
      // return this.usersList.filter(x => x.id == userId);
      name = this.userList.find(x => x.id == userId);
      if (name.firstName == null && name.lastName == null)
        return name.email;
      else
        return ((name.firstName)?name.firstName:'') + " " + ((name.lastName)?name.lastName:'');
    }
    else{
      return "-";
    }
  }

  private getUsers() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe((response) => {
      if (response) {
        this.userList = response;
      }
    },
      (err) => {
        console.error('could not fetch users::' + err.error);
      }
    );
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

  private getFormTwenty(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formtwentyService.getForm(id).subscribe(
        (response) => {
          if (response) {
            this.auditForm = response;

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

}
