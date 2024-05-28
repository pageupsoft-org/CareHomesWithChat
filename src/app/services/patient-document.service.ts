import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PatientDocumentService {
    private patientUrl = environment.baseUrl;

    constructor(private http: HttpClient) { }

    public deletePatientDocument(documentId: number):Observable<boolean> {
        let url = this.patientUrl + 'PatientDocument/' + documentId;
        return this.http.delete<boolean>(url);
    }

}
