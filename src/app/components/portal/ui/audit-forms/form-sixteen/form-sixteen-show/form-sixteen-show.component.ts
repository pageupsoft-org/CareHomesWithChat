import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormSixteenService } from 'src/app/services/form-sixteen.service';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { Satisfaction } from 'src/app/shared/enums/satisfaction.enum';
import { AuditFormSixteen } from 'src/app/shared/models/audit-form-sixteen';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-form-sixteen-show',
  templateUrl: './form-sixteen-show.component.html',
  styleUrls: ['./form-sixteen-show.component.scss']
})
export class FormSixteenShowComponent extends BaseComponent implements OnInit {

  public locationName: string;
  public userList: Array<User> = [];
  public signoffBy: string;
  public auditForm: AuditFormSixteen;
  public satisfactory = Satisfaction;

  constructor(private locationService: LocationServices, private userService: UserService, private formSixteenService: FormSixteenService, private route: ActivatedRoute) { super(); }

  ngOnInit(): void {
    if (!this.route.snapshot.params['id']) {
      alert('something went wrong!!');
      this.goBack();
    }
    this.getUsers();
    this.getForm16(this.route.snapshot.params['id']);
  }

  public goBack() {
    // this.getForms.emit();
    window.history.back();
  }

  private getLocation(locationId) {
    this.locationService.getLocation(locationId).subscribe((response) => {
      if (response) {
        this.locationName = response.name;
      }
    },
      (err) => {
        console.error('could not fetch locations ::' + err.error);
      }
    );
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


  private getForm16(formId) {
    if (formId) {
      this.SetLoading(true);
      this.formSixteenService.getForm(formId).subscribe((response) => {
        if (response) {
          this.auditForm = response;
          // this.getUser(response.signoffBy);
          this.getLocation(response.locationId);
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
