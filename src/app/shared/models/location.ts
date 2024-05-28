export class Location {
    id: number;
    name: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    postalCode: string;
    careHomeId:number;
    isActive:Boolean;
    constructor(){
      this.isActive= true;
    }
  }
  