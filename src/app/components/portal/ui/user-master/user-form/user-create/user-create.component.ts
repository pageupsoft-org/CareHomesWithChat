import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { CourseServices } from 'src/app/services/course';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { UserStatus } from 'src/app/shared/enums/user-status.enum';
import { UserType } from 'src/app/shared/enums/user-type.enum';
import { Course } from 'src/app/shared/models/course';
import { Location } from 'src/app/shared/models/location';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent extends BaseComponent implements OnInit {
  @Output() getUsers: EventEmitter<any> = new EventEmitter<any>();
  @Input() userId: number;

  public userForm: FormGroup;

  public selectedItems: Array<any> = [];
  public dropdownSettings: IDropdownSettings = {};
  public isEdit: boolean = false;
  public userStatus = UserStatus;
  public cousresList: Course[] = [];
  public locationList: Location[] = [];
  public userArray;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseServices,
    private locationService: LocationServices,
    private userService: UserService
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.currentUserRole == UserType.User) {
      alert("You don't have permission for this");
      // window.location.pathname = "/";
      return;
    }

    this.getLocations();
    this.getAllCources();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
    };

    if (this.userId) {
      this.isEdit = true;
      this.getUser(this.userId);
    } else {
      this.userForm = this.fb.group({
        id: [0],
        firstName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(250),
            Validators.pattern('^[a-zA-Z][a-zA-Z ]{1,30}$'),
          ]),
        ],
        lastName: [
          '',
          Validators.compose([
            Validators.pattern('^[a-zA-Z][a-zA-Z ]{1,30}$'),
            Validators.maxLength(250),
          ]),
        ],
        userName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(250),
            Validators.pattern('^[a-zA-Z_@.0-9-]{5,30}$'),
          ]),
        ],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$'),
          ]),
        ],
        userType: [UserType.User, Validators.compose([Validators.required])],
        staffNumber: [''],
        joiningDate: [null],
        locationIds: [''],
        position: [''],
        isActive: [UserStatus.Active],
        training: [''],
        courses: this.fb.array([
          // this.addCourseFormGroup()
        ]),
      });
    }
    this.userArray = this.getUserTypes();
  }

  ngOnChanges(): void {
    this.dropdownSettings = {};
  }

  getUserTypes() {
    var userTypes = EnumConverter.ConvertEnumToArray(UserType);
    return userTypes.filter(
      (x) => x.value != UserType.Admin && x.value != UserType.WECAdmin
    );
  }

  onItemSelect(item: any) {
    this.selectedItems.push(item);
  }

  OnItemDeSelect(item: any) {
    this.selectedItems = this.selectedItems.filter((x) => x != item.id);
  }

  onSelectAll(items: any) {
    this.selectedItems = [];
    items.forEach((element) => {
      this.selectedItems.push(element);
    });
  }

  onDeSelectAll(items: any) {
    this.selectedItems = [];
  }

  addCourseFormGroup(course?: any): FormGroup {
    if (course) {
      let mandatory = this.cousresList.find((x) => x.id == course.id)
        ? this.cousresList.find((x) => x.id == course.id).isMandatory
        : 'N';
      return this.fb.group({
        id: [course.id],
        courseId: [course.courseId, Validators.compose([Validators.required])],
        mandatory: [mandatory],
        start: [
          course.start ? formatDate(course.start, 'yyyy-MM-dd', 'en') : null,
          Validators.compose([Validators.required])
        ],
        expiryDate: [course.expiryDate ? formatDate(course.expiryDate, 'yyyy-MM-dd', 'en') : null,
        Validators.compose([Validators.required])],
        complete: [course.complete? formatDate(course.complete, 'yyyy-MM-dd', 'en'): null,],
      });
    } else {
      return this.fb.group({
        id: [0],
        courseId: [null, Validators.compose([Validators.required])],
        mandatory: [''],
        start: [null, Validators.compose([Validators.required])],
        expiryDate: [null,
          Validators.compose([Validators.required])],
        complete: [null],
      });
    }
  }

  addCourseButtonClick(course?: any): void {
    if (course) {
      (<FormArray>this.userForm.get('courses')).push(
        this.addCourseFormGroup(course)
      );
    } else {
      (<FormArray>this.userForm.get('courses')).push(this.addCourseFormGroup());
    }
  }

  removeCourse(i: number) {
    (<FormArray>this.userForm.get('courses')).removeAt(i);
    // if (((<FormArray>this.userForm.get('courses')).length) == 0) {
    //   this.addCourseButtonClick();
    // }else{
    //   console.log("he");
    // }
  }

  onSubmitUser(form) {
    form.locationIds = null;
    let locationIds;
    if (this.selectedItems.length > 0) {
      locationIds = this.selectedItems.map(function (obj) {
        return obj.id;
      });

      form.locationIds = [...new Set(locationIds)];
    } else {
      alert('Please select at least one location');
      return;
    }
    form.userType = Number(form.userType);

    if (this.isEdit) {
      this.userForm.controls['userName'].enable();
      this.updateUser(form);
    } else {
      this.addUser(form);
    }
  }

  getAllCources() {
    this.courseService.getCourses().subscribe(
      (response) => {
        this.cousresList = response;
      },
      (err) => {
        console.error('could not fetch course ::' + err.error);
      }
    );
  }

  public checkDateValidation(index: number) {
    let start = (<FormArray>this.userForm.get('courses')).at(index)['controls']['start'].value;
    let expiryDate = (<FormArray>this.userForm.get('courses')).at(index)['controls']['expiryDate'].value;
    let complete = (<FormArray>this.userForm.get('courses')).at(index)['controls']['complete'].value;
    if (start && expiryDate) {
      let start_date = new Date(start);
      let expiryDate_date = new Date(expiryDate);

      if (start_date > expiryDate_date) {
        alert('Please select proper expiryDate date');
        (<FormArray>this.userForm.get('courses')).at(index)['controls']['expiryDate'].setValue(null);
      }
    }
    if (start && complete) {
      let start_date = new Date(start);
      let complete_date = new Date(complete);

      if (start_date > complete_date) {
        alert('Please select proper complete date');
        (<FormArray>this.userForm.get('courses'))
          .at(index)
        ['controls']['complete'].setValue(null);
      }
      // }
      // this.userForm.controls['start'];
      // this.userForm.controls['expiryDate'];
      // this.userForm.controls['complete'];
    }
  }

  public onCourseChange(index, courseId) {
    let course = this.cousresList.find((x) => x.id == courseId);
    if (course) {
      let mandatory = course.isMandatory ? 'Y' : 'N';
      (<FormArray>this.userForm.get('courses'))
        .at(index)
      ['controls']['mandatory'].setValue(mandatory);
    }
  }

  private getLocations() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.locationService.getLocations(careHomeId).subscribe(
      (response) => {
        if (response) {
          this.locationList = response;
        }
      },
      (err) => {
        console.error('could not fetch location ::' + err.error);
      }
    );
  }

  private setLocations(locationIds) {
    let selectedLocationArray: Array<Location> = [];
    if (locationIds) {
      this.locationList.forEach((element) => {
        if (locationIds.find((x) => x == element.id) != undefined) {
          selectedLocationArray.push(element);
          this.onItemSelect(element);
        }
      });
    }
 
    return selectedLocationArray;
  }

  // to edit user
  private getUser(userId) {
    this.SetLoading(true);
    this.userService.getUser(userId).subscribe(
      (response) => {
        let locationIds: Array<Location> = this.setLocations(
          response.locationIds
        );
        this.userForm = this.fb.group({
          id: [response.id],
          firstName: [
            response.firstName,
            Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(250), Validators.pattern('^[a-zA-Z][a-zA-Z ]{1,30}$')]),
          ],
          lastName: [response.lastName],
          userName: [
            response.userName,
            Validators.compose([
              Validators.required,
              Validators.minLength(5),
              Validators.maxLength(250),
              Validators.pattern('^[a-zA-Z_@.0-9-]{5,30}$'),
            ]),
          ],
          email: [
            response.email,
            Validators.compose([
              Validators.required,
              Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$'),
            ]),
          ],
          userType: [
            response.userType,
            Validators.compose([Validators.required]),
          ],
          staffNumber: [response.staffNumber],
          joiningDate: [formatDate(response.joiningDate, 'yyyy-MM-dd', 'en')],
          locationIds: [locationIds ? locationIds : null],
          position: [response.position],
          isActive: [response.isActive],
          training: [response.training],
          courses: this.fb.array([]),
        });
        if (response.courses) {
          response.courses.forEach((element) => {
            this.addCourseButtonClick(element);
          });
        }

        this.userForm.controls['userName'].disable();
        this.SetLoading(false);
      },
      (error) => {
        this.SetLoading(false);

        alert(error.error);
      }
    );
  }

  private updateUser(form) {
    this.SetLoading(true);
    this.userService.updateUser(form).subscribe(
      (response) => {
        if (response) {
          alert('User updated successfully');
          this.getUsers.emit();
        }
        this.SetLoading(false);
      },
      (err) => {
        this.SetLoading(false);
        this.userForm.controls['userName'].disable();
        alert(err.error);
      }
    );
  }

  private addUser(form) {
    this.SetLoading(true);
    this.userService.addUser(form).subscribe(
      (response) => {
        if (response) {
          alert('User added successfully');
          this.userForm.reset();
          this.getUsers.emit();
        }
        this.SetLoading(false);
      },
      (err) => {
        this.SetLoading(false);
        alert(err.error);
      }
    );
  }
}
