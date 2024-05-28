import { Component, OnInit } from '@angular/core';
import { LocationServices } from 'src/app/services/location.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { Location } from 'src/app/shared/models/location';

@Component({
  selector: 'app-zoning-board-master',
  templateUrl: './zoning-board-master.component.html',
  styleUrls: ['./zoning-board-master.component.scss'],
})
export class ZoningBoardMasterComponent
  extends BaseComponent
  implements OnInit
{
  public locationId: number;
  public locationList: Array<Location> = [];
  public activeTab: number = 1;

  constructor(private locationService: LocationServices) {
    super();
  }

  ngOnInit(): void {
    if (this.userType.Auditor == this.currentUserRole) {
      alert("You don't have access to this resource");
    }
    this.onTabChange(3);
    this.getLocations();
  }

  public onTabChange(index) {
    this.activeTab = index;
  }

  public setLocation(event: any) {
    this.locationId = event;
  }

  public getLocation(event: any) {
    this.SetLoading(true);
    this.locationId = event.target.value;
    this.setLocation(this.locationId);
    this.SetLoading(false);
  }

  private getLocations() {
    this.SetLoading(true);
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    this.locationService.getLocations(careHomeId).subscribe(
      (response) => {
        if (response) {
          if (this.currentUserRole != this.userType.Admin) {
            let locationIds = JSON.parse(
              localStorage.getItem('_identity')
            ).locationIds;
            locationIds.forEach((element) => {
              this.locationList.push(response.filter((x) => x.id == element)[0]);
            });
            // this.locationList = response.Result;
          } else {
            this.locationList = response;
          }
        }
        this.SetLoading(false);
      },
      (error) => {
        this.SetLoading(false);

        console.error('could not fetch::' + error.error);
      }
    );
  }
}
