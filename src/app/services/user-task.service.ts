import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserTask } from '../shared/models/user-task';

@Injectable({
  providedIn: 'root'
})
export class UserTaskService {
  private userTaskUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  public addUserTask(task: UserTask): Observable<UserTask> {
    let url = this.userTaskUrl + "UserTask";
    return this.http.post<UserTask>(url, task);
  }

  public getTasks(taskId: number): Observable<Array<UserTask>> {
    let url = this.userTaskUrl + "UserTasks/" + taskId;
    return this.http.get<Array<UserTask>>(url);
  }
  public getTask(taskId: number): Observable<UserTask> {
    let url = this.userTaskUrl + "UserTask/" + taskId;
    return this.http.get<UserTask>(url);
  }

  public updateUserTask(task: any): Observable<UserTask> {
    let url = this.userTaskUrl + "UserTask/" + task.id;
    return this.http.put<UserTask>(url, task);
  }

  public deleteUserTask(taskId: number): Observable<boolean> {
    let url = this.userTaskUrl + "UserTask/" + taskId;
    return this.http.delete<boolean>(url);
  }

  public getTasksByUser(userId: number): Observable<Array<UserTask>> {
    let url = this.userTaskUrl + "UserTasks/GetTasksByUser/" + userId;
    return this.http.get<Array<UserTask>>(url);
  }
}
