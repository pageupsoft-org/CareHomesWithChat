import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlobUploadFile {
  private blobURL = environment.baseUrl;


  constructor(private http: HttpClient) { }

//   public getAllatients(): Observable<[]> {
//     let url = this.blobURL + "Patients";
//     return this.http.get(url).pipe(map((res) => <Patient[]>res));
//   }

  public uploadFile(blob:BlobUploadFile) {
    let url = this.blobURL + "Blob/UploadFile";
    return this.http.post(url, blob);
  }
}
