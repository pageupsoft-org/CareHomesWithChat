import { Component, OnInit } from '@angular/core';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { UserType } from 'src/app/shared/enums/user-type.enum';
import { Location } from 'src/app/shared/models/location';
import { RiskEntry } from 'src/app/shared/enums/risk-entry.enum';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-form-six',
  templateUrl: './form-six.component.html',
  styleUrls: ['./form-six.component.scss']
})
export class FormSixComponent extends BaseComponent implements OnInit {

  public locationList: Array<Location> = [];
  public auditorList: Array<User> = [];
  public riskAction = RiskEntry;

  constructor(private locationService: LocationServices, private userService: UserService) { super(); }

  ngOnInit(): void {
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
        this.auditorList = response.filter(x => x.userType == UserType.Auditor);
      }
    }, (err) => {
      console.error("could not fetch users::" + err.error);
    })
  }
}
