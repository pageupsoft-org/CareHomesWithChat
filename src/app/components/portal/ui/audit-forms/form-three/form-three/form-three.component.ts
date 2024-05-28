
import { Component, OnInit } from '@angular/core';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { UserType } from 'src/app/shared/enums/user-type.enum';
import { Location } from 'src/app/shared/models/location';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-form-three',
  templateUrl: './form-three.component.html',
  styleUrls: ['./form-three.component.scss']
})
export class FormThreeComponent implements OnInit {

  public locationList: Array<Location> = [];
  public auditorList: Array<User> = [];
  constructor(private locationService: LocationServices, private userService: UserService) { }

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
