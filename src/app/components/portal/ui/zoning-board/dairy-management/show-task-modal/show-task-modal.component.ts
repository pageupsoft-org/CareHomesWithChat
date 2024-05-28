import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserTaskService } from 'src/app/services/user-task.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { UserTaskForm } from 'src/app/shared/forms/user-task-form';
import { DialogResult } from 'src/app/util/DialogResult ';

@Component({
  selector: 'app-show-task-modal',
  templateUrl: './show-task-modal.component.html',
  styleUrls: ['./show-task-modal.component.scss'],
})
export class ShowTaskModalComponent extends BaseComponent implements OnInit {
  @ViewChild('showTaskModal') showTaskModal: ModalDirective;

  public callback: any;
  public userTaskForm: UserTaskForm;
  public userName:string;

  constructor(private userTaskService: UserTaskService) {super();}

  ngOnInit(): void {}

  public showModal(taskId: number): Promise<DialogResult> {
    let promise = new Promise<DialogResult>((resolve) => {
      this.callback = resolve;
    });
    if (taskId) {
      this.getTask(taskId);
    } else {
      this.showTaskModal.hide();
    }
    this.isBusy = false;
    this.showTaskModal.show();
    return promise;
  }

  public cancel() {
    this.showTaskModal.hide();
    if (this.callback != null) {
      this.callback(DialogResult.Canceled);
    }
  }

  private getTask(taskId: number) {
    this.SetLoading(true);
    this.userTaskService.getTask(taskId).subscribe(
      (response) => {
        if (response) {
          this.userTaskForm = new UserTaskForm(response);
          let taskDate = formatDate(response.taskDate, 'yyyy-MM-dd', 'en');
          this.userTaskForm.taskDate.setValue(taskDate);
          this.userName =  (this.userTaskForm.user.firstName ==null || this.userTaskForm.user.lastName == null)? this.userTaskForm.user.email: this.userTaskForm.user.firstName+" "+this.userTaskForm.user.lastName
          

          if (this.callback != null) {
            this.callback(DialogResult.Confirmed);
          }
        }
        this.SetLoading(false);
      },
      (err) => {
        alert(err.error);
        this.SetLoading(false);
      }
    );
  }

  
}
