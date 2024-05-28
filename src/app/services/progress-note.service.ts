import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FormMessageLog, ProgressNote } from '../shared/models/progress-note';

@Injectable({
  providedIn: 'root'
})
export class ProgressNoteService {

  private progressNoteUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  public addProgressNote(progressNote: ProgressNote): Observable<ProgressNote> {
    let url = this.progressNoteUrl + "ProgressNote";
    return this.http.post<ProgressNote>(url, progressNote);
  }

  public getProgressNotes(patientId: number): Observable<Array<ProgressNote>> {
    let url = this.progressNoteUrl + "ProgressNote/GetByPatient/" + patientId;
    return this.http.get<Array<ProgressNote>>(url);
  }

  public getProgressNote(progressNoteId: number): Observable<ProgressNote> {
    let url = this.progressNoteUrl + "ProgressNote/" + progressNoteId;
    return this.http.get<ProgressNote>(url);
  }

  public updateProgressNote(progressNote: ProgressNote): Observable<ProgressNote> {
    let url = this.progressNoteUrl + "ProgressNote/" + progressNote.id;
    return this.http.put<ProgressNote>(url, progressNote);
  }
  public removeProgressNote(progressNoteId: number): Observable<boolean> {
    let url = this.progressNoteUrl + "ProgressNote/" + progressNoteId;
    return this.http.delete<boolean>(url);
  }
  
  public getMessageLog(progressNoteId: number, entityName:string): Observable<any> {

    let url = `${this.progressNoteUrl}FormMessageLog?TableKeyId=${progressNoteId}&EntityName=${entityName}`;

    return this.http.get<any>(url);
  }
}
