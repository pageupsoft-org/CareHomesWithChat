import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { RecoveryStar } from '../shared/models/recovery-star';


@Injectable({
    providedIn: 'root'
})
export class RecoveryStarService {
    private recoveryStarUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    public getRecoveryStars(patientId: number): Observable<Array<RecoveryStar>> {
        let url = this.recoveryStarUrl + 'RecoveryStar/GetByPatient/' + patientId;
        return this.http.get<Array<RecoveryStar>>(url);
    }

    public addRecoveryStar(recoveryStar: RecoveryStar): Observable<RecoveryStar> {
        let url = this.recoveryStarUrl + "RecoveryStar";
        return this.http.post<RecoveryStar>(url, recoveryStar);
    }

    public getRecoveryStar(recoveryStarId: number): Observable<RecoveryStar> {
        let url = this.recoveryStarUrl + 'RecoveryStar/' + recoveryStarId;
        return this.http.get<RecoveryStar>(url);
    }

    public updateRecoveryStar(recoveryStar: RecoveryStar): Observable<RecoveryStar> {
        let url = this.recoveryStarUrl + 'RecoveryStar/' + recoveryStar.id;
        return this.http.put<RecoveryStar>(url, recoveryStar);
    }

    public deleteRecoveryStar(recoveryStarId: number): Observable<boolean> {
        let url = this.recoveryStarUrl + 'recoveryStar/' + recoveryStarId;
        return this.http.delete<boolean>(url);
    }

    public getLogs(entityType: String, entityValue): Observable<any> {
        let url = this.recoveryStarUrl + 'UpdateLog?entityName=' + entityType + '&entityValue=' + entityValue;
        return this.http.get<any>(url);
    }
}


