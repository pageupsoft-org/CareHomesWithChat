import { Component, OnInit } from '@angular/core';
import { IdentityService } from 'src/app/services/identity.service';
import { UserType } from '../../enums/user-type.enum';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {
  public isAuthenticated: boolean = false;
  public isBusy: boolean = false;
  public userType = UserType;

  public currentUserRole: number = Number((localStorage.getItem('_identity')) ? JSON.parse(localStorage.getItem('_identity')).role : '');
  public currentUserId: number = Number((localStorage.getItem('_identity')) ? JSON.parse(localStorage.getItem('_identity')).id : '');
  public currentDate: Date = new Date();

  constructor() { }

  ngOnInit(): void {
    // this.menuShow =false;
  }

  public SetLoading(isBusy: boolean) {
    this.isBusy = isBusy;
  }

  public comingSoon() {
    alert("coming soon");
  }


}
