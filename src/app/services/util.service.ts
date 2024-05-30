import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  public loggedInUserId: number = -1;
  public loggedInUserName: string = "";
}
