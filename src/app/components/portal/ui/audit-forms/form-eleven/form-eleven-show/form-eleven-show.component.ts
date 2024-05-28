import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormElevenService } from 'src/app/services/form-eleven.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { AuditFormEleven } from 'src/app/shared/models/audit-form-eleven';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-form-eleven-show',
  templateUrl: './form-eleven-show.component.html',
  styleUrls: ['./form-eleven-show.component.scss']
})
export class FormElevenShowComponent extends BaseComponent implements OnInit {
  public locationList: Array<Location> = [];
  public auditForm: AuditFormEleven;
  public locationName: string = "";
  public signoffBy: string = "";
  public userList: Array<User> = [];

  constructor(
    private locationService: LocationServices,
    private formElevenService: FormElevenService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {super();}

  ngOnInit(): void {
    if (!this.route.snapshot.params['id']) {
      alert('something went wrong!!');
      this.goBack();
    }
    this.getUsers();
    this.getFormEleven(this.route.snapshot.params['id']);
  }

  public goBack() {
    window.history.back();
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

  private getFormEleven(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formElevenService.getForm(id).subscribe(
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

}
