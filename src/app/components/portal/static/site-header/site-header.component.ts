import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserTaskService } from 'src/app/services/user-task.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { UserTask } from 'src/app/shared/models/user-task';
import { Constants } from 'src/app/util/Constants';
import { DialogResult } from 'src/app/util/DialogResult ';
import { ShowTaskModalComponent } from '../../ui/zoning-board/dairy-management/show-task-modal/show-task-modal.component';
// import { AngularFireMessaging } from '@angular/fire/messaging'; //TODO:generating error
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/shared/enums/notification-type.enum';
import { Notification } from 'src/app/shared/models/notification';
// declare const firebase: any;
@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss'],
})
export class SiteHeaderComponent extends BaseComponent implements OnInit {
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('showTaskModal') showTaskModal: ShowTaskModalComponent;

  username: string;
  userId: number;
  public showSidebar: boolean = false;
  public showNotifications: boolean = false;
  public isSuperAdmin: boolean = true;
  public taskList: Array<UserTask> = [];
  public notificationCount: number = 0;
  public notificationList: Array<Notification> = [];
  public notificationType = NotificationType;
  public constants = Constants;

  constructor(
    private router: Router,
    private userTaskService: UserTaskService,
    private angularFireMessaging: AngularFireMessaging,
    private notificationService: NotificationService
  ) {
    super();

    this.angularFireMessaging.messages.subscribe(
      (payload) => {

        // this.appComponentObj.getNotification.emit(payload);
        // this.notificationCount += 1;
        this.getNotifications();
      })

  }

  override ngOnInit(): void {
    this.username = String(JSON.parse(localStorage.getItem('_identity')).userName);
    this.userId = Number(JSON.parse(localStorage.getItem('_identity')).id);
    this.setUserType();
    // this.getTasks();
    this.getNotifications();
  }

  public logout() {
    localStorage.clear();
    window.location.pathname = '/login';
  }

  public changePassword() {
    this.router.navigate([Constants.routes.changePassword()]);
  }

  userProfile() {
    this.router.navigate([Constants.routes.userProfile()]);
  }

  public toggle() {
    this.showSidebar = !this.showSidebar;
    this.toggleSidebar.emit(this.showSidebar);
  }

  public showTask(taskId: number) {
    this.showTaskModal.showModal(taskId).then((result: DialogResult) => { });
  }

  public getNotification() {
    this.showNotifications = !this.showNotifications;
    // if (!this.showNotifications) {
    //   this.notificationCount = 0;
    //   this.setIsSeen();
    // }
  }

  public showDetails(notification: Notification) {
    if (!notification.isSeen) {
      this.SetLoading(true);

      this.notificationService.setSeenById(notification.id).subscribe(
        (response) => {
          if (this.notificationType.TaskAssigned == notification.notificationType) {
            window.location.href = "/dashboard?notificationType=" + this.notificationType.TaskAssigned;
          }
          else if (this.notificationType.FormSignOff == notification.notificationType) {
            window.location.href = "/dashboard?notificationType=" + this.notificationType.FormSignOff;
          }
          if (this.notificationType.AuditForm == notification.notificationType) {
            window.location.href = "/dashboard?notificationType=" + this.notificationType.AuditForm;
          }
          else if (this.notificationType.ProgressNote == notification.notificationType) {
            // redirect to daily occurence list page
          }
          this.SetLoading(false);
        },
        (err) => {
          console.error(err.error);
          this.SetLoading(false);
        });
    }

  }

  private setUserType() {
    if (Number(localStorage.getItem('_userType')) != 0) {
      this.isSuperAdmin = false;
    }
  }

  private getNotifications() {
    this.SetLoading(true);
    this.notificationService.getUserNotification(this.currentUserId).subscribe(
      (response) => {
        if (response.length > 0) {
          this.notificationList = response;
          this.notificationCount = this.notificationList.filter(x => x.isSeen === false).length
          // this.notificationCount += this.notificationList.length;
        }
        this.SetLoading(false);
      },
      (err) => {
        console.error(err.error);
        this.SetLoading(false);
      }
    );
  }

  private setIsSeen() {
    this.notificationService.setIsSeen(this.currentUserId).subscribe(
      (response) => {
        if (response) {
        }
        this.SetLoading(false);
      },
      (err) => {
        console.error(err.error);
        this.SetLoading(false);
      }
    );
  }

  private getTasks() {
    this.SetLoading(true);
    this.userTaskService.getTasksByUser(this.userId).subscribe(
      (response) => {
        if (response.length > 0) {
          this.taskList = response.filter((x) => x.status == true);
          this.notificationCount += this.taskList.length;
        }
        this.SetLoading(false);
      },
      (err) => {
        console.error(err.error);
        this.SetLoading(false);
      }
    );
  }
}

