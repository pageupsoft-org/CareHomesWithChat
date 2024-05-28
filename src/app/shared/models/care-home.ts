import { User } from "./user";

export class CareHome {
  id: number;
  name: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactNumber: string;
  mainAddress1: string;
  mainAddress2: string;
  mainAddress3: string;
  mainAddress4: string;
  postalCode: string;
  serviceUserLimit: number;
  isActive: boolean;
  user: User;
  constructor() {
    this.isActive = true;
    this.user = new User();
    this.serviceUserLimit = 0;
  }
}
