import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormEightService } from 'src/app/services/form-eight.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { AuditFormEight } from 'src/app/shared/models/audit-form-eight';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-form-eight-show',
  templateUrl: './form-eight-show.component.html',
  styleUrls: ['./form-eight-show.component.scss']
})
export class FormEightShowComponent extends BaseComponent implements OnInit {

  public userList: Array<User> = [];
  public auditForm: AuditFormEight;
  public locationName: string = "--";

  constructor(private locationService: LocationServices, private route: ActivatedRoute, private userService: UserService, private formEightService: FormEightService) { super() }

  ngOnInit(): void {
    this.getUsers();
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    if (this.route.snapshot.params['id'])
      this.getFormEight(this.route.snapshot.params['id']);
  }

  public goBack() {
    window.history.back();
  }

  public getLocation(locationId: number) {
    if (locationId) {
      let locationName = '--';
      this.locationService.getLocation(locationId).subscribe((response) => {
        if (response) {
          return this.locationName = response.name;
        }
      },
        (err) => {
          console.error('could not fetch locations ::' + err.error);
        }
      );
      return locationName;
    }
  }

  public getUserName(userId: number) {
    if (userId && this.userList.length > 0) {
      let name;
      // return this.usersList.filter(x => x.id == userId);
      name = this.userList.find(x => x.id == userId);
      if (name.firstName == null && name.lastName == null)
        return name.email + "(Admin)";
      else
        return ((name.firstName)?name.firstName:'') + " " + ((name.lastName)?name.lastName:'');
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

  private getFormEight(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formEightService.getForm(id).subscribe((response) => {
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
