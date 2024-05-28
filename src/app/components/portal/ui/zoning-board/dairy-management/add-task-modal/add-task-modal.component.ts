import { formatDate } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserTaskService } from 'src/app/services/user-task.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { UserTaskForm } from 'src/app/shared/forms/user-task-form';
import { User } from 'src/app/shared/models/user';
import { DialogResult } from 'src/app/util/DialogResult ';

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.scss']
})
export class AddTaskModalComponent extends BaseComponent implements OnInit {
  @ViewChild("taskModal") taskModal: ModalDirective;
  @Input() locationId: number;

  public callback: any;
  public isEdit: boolean = false;
  public isClose: boolean = false;
  public today: Date = new Date();
  public userTaskForm: UserTaskForm;
  // public users: Array<User> = [];
  public usersList: Array<User> = [];

  constructor(private userTaskService: UserTaskService, private userService: UserService) { super(); }

  ngOnInit(): void {
    if (!this.locationId)
      return;

    this.getUsers();
  }

  public showModal(operationType: string = "create", task: any = null): Promise<DialogResult> {
    let promise = new Promise<DialogResult>((resolve) => {
      this.callback = resolve;
    });
    if (task) {
      if (operationType == "close") {
        this.isClose = true;
      } else {
        this.isClose = false
      }
      this.isEdit = true;
      this.userTaskForm = new UserTaskForm(task);
      let taskDate = formatDate(task.taskDate, 'yyyy-MM-dd', 'en');
      this.userTaskForm.taskDate.setValue(taskDate);
    } else {
      let userId = Number(JSON.parse(localStorage.getItem('_identity')).id);
      let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
      this.userTaskForm = new UserTaskForm();
      this.userTaskForm.careHomeId.setValue(careHomeId);
      this.userTaskForm.locationId.setValue(this.locationId);
      this.userTaskForm.createdAt = new Date();
      this.userTaskForm.createdBy.setValue(userId);
      this.isClose = false
      this.isEdit = false;
    }
    this.isBusy = false
    this.taskModal.show();
    return promise;
  }

  public onSubmit() {
    if (this.isEdit) {
      if (this.isClose && this.userTaskForm.remark.value == null) {
        alert("Please add remark");
        return;
      }
      this.updateTask();
    } else {
      this.addTask();
    }
  }

  public cancel() {
    this.taskModal.hide();
    if (this.callback != null) {
      this.callback(DialogResult.Canceled);
    }
  }

  private addTask() {

    this.SetLoading(true);
    this.userTaskService.addUserTask(this.userTaskForm.save()).subscribe(response => {
      if (response) {
        this.userTaskForm.reset();
        this.taskModal.hide();
        if (this.callback != null) {
          this.callback(DialogResult.Confirmed);
        }
      }
      this.SetLoading(false);
    }, err => {
      alert(err.error);
      this.SetLoading(false);
    })
  }

  private updateTask() {
    this.SetLoading(true);
    if (this.isClose) {
      this.userTaskForm.taskStatus = false;
    }
    this.userTaskForm.user = null;
    this.userTaskForm.save();
    this.userTaskService.updateUserTask(this.userTaskForm.save()).subscribe(response => {
      if (response) {
        this.userTaskForm.reset();
        this.taskModal.hide();
        if (this.callback != null) {
          this.callback(DialogResult.Confirmed);
        }
      }
      this.SetLoading(false);
    }, err => {
      alert(err.error);
      this.SetLoading(false);
    })
  }

  private getUsers() {
    // let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.userService.getByLocation(this.locationId).subscribe(response => {
      if (response) {
        this.usersList = response;
      }
    }, err => {
      console.error("could not fetch users::" + err.error);
    });
  }

}
