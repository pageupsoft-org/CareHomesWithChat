import { UserStatus } from "../enums/user-status.enum";
import { UserType } from "../enums/user-type.enum";
// import { Course } from "./Course";
import { Location } from "./location";
import { UserCourse } from "./user-course";

export class User {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  userType: UserType;
  staffNumber: string;
  joiningDate: Date;
  position: string;
  training: string;
  isActive: UserStatus;
  locationIds: Array<Location>;
  courses: Array<UserCourse>;

  careHomeName: string;
  careHomeId: number;
  leaveBalance: number;

  isLeaveAllocated: boolean;
isShiftAllocated: boolean;

  constructor() {
    this.userType = 0;
    this.isActive = UserStatus.Active;
    this.locationIds = [];
    this.courses = [];
  }

  // public get emptorName() {
  //   if (this.firstName == null && this.lastName == null)
  //     return this.email + " (Admin)";
  //   else
  //     return this.firstName + ' ' + this.lastName;
  // }

}
