import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserTaskService } from 'src/app/services/user-task.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { User } from 'src/app/shared/models/user';
import { UserTask } from 'src/app/shared/models/user-task';
import { DialogResult } from 'src/app/util/DialogResult ';
import { AddTaskModalComponent } from '../add-task-modal/add-task-modal.component';
import { ShowTaskModalComponent } from '../show-task-modal/show-task-modal.component';

@Component({
  selector: 'app-dairy-master',
  templateUrl: './dairy-master.component.html',
  styleUrls: ['./dairy-master.component.scss'],
})
export class DairyMasterComponent extends BaseComponent implements OnInit {
  @ViewChild('taskModal') taskModal: AddTaskModalComponent;
  @ViewChild('showTaskModal') showTaskModal: ShowTaskModalComponent;
  @Input() locationId: number;
  @Input() loginId: number;

  public taskList: Array<any> = [];
  public tasks: Array<any> = [];
  public usersList: Array<User> = [];
  public status: boolean = null;
  public userId: number = 0;

  constructor(
    private userTaskService: UserTaskService,
    private userService: UserService
  ) {
    super();
  }

  ngOnInit(): void { }

  ngOnChanges() {
    if (!this.locationId && !this.loginId) {
      return alert('Please select location');
    }
    if (this.locationId) {
      this.getUsers();
      this.getTasks();
    } else {
      this.getUserTask();
    }
  }

  public addTask() {
    this.taskModal.showModal('create').then((result: DialogResult) => {
      if (result == DialogResult.Confirmed) {
        this.getTasks();
      }
    });
  }

  public editTask(task: UserTask) {
    this.taskModal.showModal('edit', task).then((result: DialogResult) => {
      if (result == DialogResult.Confirmed) {
        this.getTasks();
      }
    });
  }

  public showTask(taskId: number) {
    this.showTaskModal.showModal(taskId).then((result: DialogResult) => {
    });
  }

  public closeTask(task: UserTask) {
    let userId = Number(JSON.parse(localStorage.getItem('_identity')).id);

    if (this.userType.Admin == this.currentUserRole || task.userId == userId) {
      if (window.confirm('Are sure you want to close this task')) {
        this.taskModal.showModal('close', task).then((result: DialogResult) => {
          if (result == DialogResult.Confirmed) {
            if (this.locationId)
              this.getTasks();
            else
              this.getUserTask();
          }
        });
      }
    }
  }

  public remove(id: number) {
    if (window.confirm('Are sure you want to delete this?')) {
      this.SetLoading(true);
      this.userTaskService.deleteUserTask(id).subscribe(
        (response) => {
          if (response)
            if (this.locationId)
              this.getTasks();
            else
              this.getUserTask();

          this.SetLoading(false);
        },
        (error) => {
          alert(error.error);
          console.error(error);
        }
      );
      this.SetLoading(false);
    }
  }

  public filterTask() {
    this.tasks = [];
    if (this.userId == 0 && this.status == null) {
      this.tasks = [...this.taskList];
    } else if (this.userId != 0 && this.status == null) {
      this.tasks = this.taskList.filter((x) => x.userId == this.userId);
    } else if (this.userId != 0 && this.status != null) {
      this.tasks = this.taskList.filter(
        (x) => x.userId == this.userId && x.status == this.status
      );
    } else {
      this.tasks = this.taskList.filter((x) => x.status == this.status);
    }
  }

  private getUserTask() {
    this.SetLoading(true);
    this.userId = this.loginId;
    this.status = true;
    this.userTaskService.getTasksByUser(this.currentUserId).subscribe(
      (response) => {
        if (response.length > 0) {
          this.taskList = [];
          this.taskList = [...response];
          this.filterTask();
        }
        this.SetLoading(false);
      },
      (err) => {
        alert(err.error);
        this.SetLoading(false);
      }
    );
  }

  private getTasks() {
    this.SetLoading(true);
    this.userTaskService.getTasks(this.locationId).subscribe((response) => {
      if (response.length > 0) {
        this.taskList = [];
        this.taskList = [...response];
        this.filterTask();
      } else {
        this.taskList = [];
        this.filterTask();
      }
      this.SetLoading(false);
    },
      (err) => {
        alert(err.error);
        this.SetLoading(false);
      }
    );
  }

  private getUsers() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getByLocation(this.locationId).subscribe(response => {
      if (response.length > 0) {
        this.usersList = response;
      }
    }, err => {
      console.error("could not fetch users::" + err.error);
    });
  }
}
