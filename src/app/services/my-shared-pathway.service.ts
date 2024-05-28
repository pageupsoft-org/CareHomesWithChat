import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { MySharedPathway } from '../shared/models/my-shared-pathway';


@Injectable({
    providedIn: 'root'
})
export class MySharedPathwayService {
    private sharedPathwayUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    public getMySharedPathways(patientId: number): Observable<Array<MySharedPathway>> {
        let url = this.sharedPathwayUrl + 'SharedPathway/GetByPatient/' + patientId;
        return this.http.get<Array<MySharedPathway>>(url);
    }

    public addSharedPathway(sharedPathway: MySharedPathway):Observable<MySharedPathway> {
        let url = this.sharedPathwayUrl + "SharedPathway";
        return this.http.post<MySharedPathway>(url, sharedPathway);
    }

    public getSharedPathway(sharedPathwayId: number): Observable<MySharedPathway> {
        let url = this.sharedPathwayUrl + 'SharedPathway/' + sharedPathwayId;
        return this.http.get<MySharedPathway>(url);
    }

    public updateSharedPathway(sharedPathway: MySharedPathway ): Observable<MySharedPathway>{
        let url = this.sharedPathwayUrl + 'SharedPathway/' + sharedPathway.id;
        return this.http.put<MySharedPathway>(url,sharedPathway);
    }

    public deleteSharedPathway(sharedPathwayId: number):Observable<boolean> {
        let url = this.sharedPathwayUrl + 'SharedPathway/' + sharedPathwayId;
        return this.http.delete<boolean>(url);
    }

    public getLatestSharedPathway(patientId: number): Observable<MySharedPathway> {
        let url = this.sharedPathwayUrl + 'SharedPathway/GetLatestPathway/' + patientId;
        return this.http.get<MySharedPathway>(url);
    }
    public getPreviousPathway(pathwayId: number): Observable<MySharedPathway> {
        let url = this.sharedPathwayUrl + 'SharedPathway/GetPreviousPathway/' + pathwayId;
        return this.http.get<MySharedPathway>(url);
    }

}


