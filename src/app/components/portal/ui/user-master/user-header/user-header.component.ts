import { Component, OnInit } from '@angular/core';
import { IdentityService } from 'src/app/services/identity.service';
import { UserType } from 'src/app/shared/enums/user-type.enum';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent implements OnInit {
  tabIndex = 1;
  activeTabMessage: string;
  activeTab: number = 1;
  userType: UserType;
  userTypeEnum = UserType;
  public careHomeId :number;
  public isCareHomeEdit : boolean = false;
  constructor(private identityService: IdentityService) { }

  ngOnInit(): void {
    this.userType = this.identityService.getUserType();
    if (this.userType == 0) {
      this.onTabChange(5);
    } else {
      this.onTabChange(2)
    }

  }
  public onTabChange(index) {
    this.tabIndex = index;
    this.activeTab = index;
    switch (index) {
      case 2:
        this.activeTabMessage = "Creating a User Profile";
        break;
      case 3:
        this.activeTabMessage = "Creating a Location";
        break;
      case 4:
        this.activeTabMessage = "Creating a Course";
        break;
      case 5:
        this.activeTabMessage = "Carehomes";
        this.isCareHomeEdit = false;
        break;
      default:
        this.activeTabMessage = "Creating a Profile for Carehome";
        break;
    }
  }

  public editCareHomeId(careHomeId:number){
    this.careHomeId = careHomeId;
    this.isCareHomeEdit= true
    this.onTabChange(1)
  }

}
