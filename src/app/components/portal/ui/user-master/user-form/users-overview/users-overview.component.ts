import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { UserStatus } from 'src/app/shared/enums/user-status.enum';
import { UserType } from 'src/app/shared/enums/user-type.enum';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-users-overview',
  templateUrl: './users-overview.component.html',
  styleUrls: ['./users-overview.component.scss']
})
export class UsersOverviewComponent extends BaseComponent implements OnInit {

  public usersList: Array<User> = [];
  public userStatus = UserStatus;
  public userTypeEnum = UserType;
  public panelTitle: string = 'Users List';
  public createUser: boolean = false;
  public userId: number = 0;

  constructor(private userService: UserService) { super(); }

  ngOnInit(): void {
    if (this.currentUserRole == UserType.User) {
      alert("You don't have permission for this");
      // window.location.pathname = "/";
      return;
    }

    this.getUsers();
  }

  public getUsers() {
    this.SetLoading(true);

    this.createUser = false;
    this.userId = null;

    this.panelTitle = "Users List";
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getUsers(careHomeId).subscribe(res => {
      if (res.length>0) {
        this.usersList = res.filter(x => x.isActive != UserStatus.Deactive);
      }
      this.SetLoading(false);

    }, err => {
      this.SetLoading(false);
      console.error("could not fetch users::" + err.error);
    })
  }

  public remove(userId: number) {
    if (confirm('Are you sure you want to remove this user?')) {
      this.SetLoading(true);
      this.userService.deleteUser(userId).subscribe(response => {
          this.getUsers();
          this.SetLoading(false);
      }, err => {
        this.SetLoading(false);
        alert(err.error);
      })
    }
  }

  public activateUser(userId: number, status: number) {
    if (status == UserStatus.Active) {
      if (confirm('Are you sure you want to activate this user?')) {
        this.SetLoading(true);
        this.userService.changeUserStatus(userId, status).subscribe(response => {
          this.getUsers();
          this.SetLoading(false);
        }, err => {
          this.SetLoading(false);
          alert(err.error);
        })
      }
    }

  }

  public suspendUser(userId: number, status: number) {
    if (status == UserStatus.Suspended) {
      if (confirm('Are you sure you want to suspend this user?')) {
        this.SetLoading(true);
        this.userService.changeUserStatus(userId, status).subscribe(response => {
          this.getUsers();
          this.SetLoading(false);
        }, err => {
          this.SetLoading(false);
          alert(err.error);
        })
      }
    }

  }

  public createUsers() {
    this.userId = null;
    this.createUser = !this.createUser;
    if (this.createUser)
      this.panelTitle = "Create User";
    else
      this.getUsers();
  }

  public editUser(userId: number) {
    this.createUser = true;
    this.userId = userId;
    this.panelTitle = "Edit User";
  }

}
