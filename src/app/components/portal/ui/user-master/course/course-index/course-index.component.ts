import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseServices } from 'src/app/services/course';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { Course } from 'src/app/shared/models/course';
import { DialogResult } from 'src/app/util/DialogResult ';
import { AddCourseModalComponent } from '../add-course-modal/add-course-modal.component';


@Component({
  selector: 'app-course-index',
  templateUrl: './course-index.component.html',
  styleUrls: ['./course-index.component.scss']
})
export class CourseIndexComponent extends BaseComponent implements OnInit {
  @ViewChild('courseModal') courseModal: AddCourseModalComponent;
  courses: Course[] = [];
  constructor(private courseService: CourseServices) { super(); }

  ngOnInit(): void {
    this.getAllCourses();
  }

  getAllCourses() {
    this.SetLoading(true);
    this.courseService.getCourses().subscribe(response => {
      this.courses = response;
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  remove(id: number) {
    if (window.confirm('Are sure you want to delete this?')) {
      this.courseService.deleteCourse(id).subscribe(response => {
        this.getAllCourses();
      },
        error => {
          alert(error.error);
          console.error(error);
        })
    }
  }

  addCourse() {
    this.courseModal.showModal().then((result: DialogResult) => {
      if (result == DialogResult.Confirmed) {
        this.getAllCourses();
      }
    });
  }

  editCourse(course: Course) {
    this.courseModal.showModal(course).then((result: DialogResult) => {
      if (result == DialogResult.Confirmed) {
        this.getAllCourses();
      }
    });
  }

}
