import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { element } from 'protractor';
import { CourseServices } from 'src/app/services/course';
import { LocationServices } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { UserType } from 'src/app/shared/enums/user-type.enum';
import { Course } from 'src/app/shared/models/course';
import { User } from 'src/app/shared/models/user';
import { EnumConverter } from 'src/app/util/EnumConverter';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  isBusy: boolean = true;
  userForm: FormGroup;
  userTypeEnum = UserType;
  userType = [];
  cousresList: Course[] = [];
  locationList = [];
  userArray
  userDetail: any;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(private fb: FormBuilder, private courseService: CourseServices, private locationService: LocationServices, private userService: UserService) { }

  ngOnInit(): void {
    this.isBusy = true;
    this.getAllCources();
    this.getLocations();
    this.userArray = this.getUserTypes()
    this.getUser();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };

  }

  getUser() {
    let userId = Number(JSON.parse(localStorage.getItem('_identity')).id);
    this.userService.getUser(userId).subscribe(response => {
      if (response) {
        this.userDetail = response;
        if (this.userDetail) {
          this.setDetails(this.userDetail);
        }
      }
    }, err => {
      alert(err.error);
    })
  }

  onItemSelect(item: any) {
    this.selectedItems.push(item.id);
  }

  OnItemDeSelect(item: any) {
    this.selectedItems = this.selectedItems.filter(x => x != item.id);

  }

  onSelectAll(items: any) {
    this.selectedItems = [];
    items.forEach(element => {
      this.selectedItems.push(element.id);
    });

  }

  onDeSelectAll(items: any) {
    this.selectedItems = [];

  }

  setDetails(userDetail) {

    this.userForm = this.fb.group({
      id: [userDetail.id],
      firstName: [userDetail.firstName, Validators.compose([Validators.required, Validators.minLength(2)])],
      lastName: [userDetail.lastName],
      userName: [userDetail.userName, Validators.compose([Validators.required, Validators.minLength(5)])],
      email: [userDetail.email, Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")])],
      userType: [userDetail.userType, Validators.compose([Validators.required])],
      staffNumber: [userDetail.staffNumber],
      joiningDate: [formatDate(userDetail.joiningDate, 'yyyy-MM-dd', 'en')],
      locationIds: [userDetail.locationIds, Validators.compose([Validators.required])],
      position: [userDetail.position],
      isActive: [true],
      training: [userDetail.training],
      courses: this.fb.array([
      ]),
    });
    userDetail.courses.forEach(element => {
      this.addCourseButtonClick(element);
    });
    this.locationList.forEach(element => {
      this.selectedItems.push()
    });
    this.isBusy = false;

  }

  addCourseFormGroup(course?: any): FormGroup {
    if (course) {
      return this.fb.group({
        id: [course.id],
        courseId: [course.courseId, Validators.compose([Validators.required])],
        // mandatory: [''],
        start: [(course.start) ? formatDate(course.start, 'yyyy-MM-dd', 'en') : null, Validators.compose([Validators.required])],
        due: [(course.due) ? formatDate(course.due, 'yyyy-MM-dd', 'en') : null],
        complete: [(course.complete) ? formatDate(course.complete, 'yyyy-MM-dd', 'en') : null]
      })
    }
    else {
      return this.fb.group({
        id: [0],
        courseId: ['', Validators.compose([Validators.required])],
        // mandatory: [''],
        start: [null, Validators.compose([Validators.required])],
        due: [null],
        complete: [null]
      })
    }
  }

  getUserTypes() {
    var userTypes = EnumConverter.ConvertEnumToArray(UserType);
    return userTypes.filter(x => x.value != UserType.Admin && x.value != UserType.WECAdmin);
  }

  addCourseButtonClick(course?: any): void {
    if (course) {
      (<FormArray>this.userForm.get('courses')).push(this.addCourseFormGroup(course));
    }
    else {
      (<FormArray>this.userForm.get('courses')).push(this.addCourseFormGroup());
    }
  }

  removeCourse(i: number) {
    (<FormArray>this.userForm.get('courses')).removeAt(i);
  }

  getAllCources() {
    this.courseService.getCourses().subscribe(res => {
      if (res)
        this.cousresList = res;
    }, err => {
      console.error("could not fetch course::" + err.error);
    })
    this.isBusy = false;
  }

  getLocations() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.locationService.getLocations(careHomeId).subscribe(res => {
      if (res) {
        this.locationList = res;
      }
    }, err => {
      console.error("could not fetch locations::" + err.error);
    });

  }

  onCourseChange(formObj, courseId) {
    let course = this.cousresList.find(x => x.id == courseId);
    if (course) {
      formObj.mandatory = course.isMandatory;
    }
  }

  onSubmit(form) {
    this.isBusy = true;
    form.locationIds = this.selectedItems;
    form.userType = Number(form.userType);
    this.userService.updateUser(form).subscribe(response => {
      if (response) {
        alert("User updated successfully");
        this.isBusy = false;
      }
    }, err => {
      this.isBusy = false
      alert(err.error);
    })
  }
}
