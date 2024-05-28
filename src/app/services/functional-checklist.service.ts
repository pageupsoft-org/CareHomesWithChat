import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FunctionalChecklist } from '../shared/models/functional-checklist';

@Injectable({
  providedIn: 'root'
})
export class FunctionalChecklistService {

  private functionalityUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

public addFunctionality  (functionality: FunctionalChecklist): Observable<FunctionalChecklist> {
    let url = this.functionalityUrl + "MoveOnFunctional";
    return this.http.post<FunctionalChecklist>(url, functionality);
  }

  public getFunctionality(functionalityId: number): Observable<FunctionalChecklist> {
    let url = this.functionalityUrl + "MoveOnFunctional/" + functionalityId;
    return this.http.get<FunctionalChecklist>(url);
  }

  public updateFunctionality(functionality: FunctionalChecklist):Observable<FunctionalChecklist> {
    let url = this.functionalityUrl + "MoveOnFunctional/" + functionality.id;
    return this.http.put<FunctionalChecklist>(url, functionality);
  }

  public getFunctionalities(patientId: number): Observable<Array<FunctionalChecklist>> {
    let url = this.functionalityUrl + "MoveOnFunctionals/GetByPatient/" + patientId;
    return this.http.get<Array<FunctionalChecklist>>(url);
  }
  public deleteFunctionality(functionalityId: number): Observable<boolean> {
    let url = this.functionalityUrl + "MoveOnFunctional/" + functionalityId;
    return this.http.delete<boolean>(url);
  }
}
