import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UpdateLog } from '../shared/models/update-log';

@Injectable({
  providedIn: 'root'
})
export class UpdateLogService {

  private updateLogUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  public getLogs(entityType: String, entityValue): Observable<Array<UpdateLog>> {
    let url = this.updateLogUrl + 'UpdateLog?entityName=' + entityType + '&entityValue=' + entityValue;
    return this.http.get<Array<UpdateLog>>(url);
  }
}
