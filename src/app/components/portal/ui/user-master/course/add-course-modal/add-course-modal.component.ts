import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap/modal";
import { CourseServices } from 'src/app/services/course';
import { CourseForm } from 'src/app/shared/forms/course-form';
import { Course } from 'src/app/shared/models/course';
import { DialogResult } from 'src/app/util/DialogResult ';

@Component({
  selector: 'app-add-course-modal',
  templateUrl: './add-course-modal.component.html',
  styleUrls: ['./add-course-modal.component.scss']
})
export class AddCourseModalComponent implements OnInit {
  @ViewChild("courseModal") courseModal: ModalDirective;
  // @Output("getAllCources") getAllCources: EventEmitter<any> = new EventEmitter<any>();
  courseForm: CourseForm;
  cousresList: Course[] = [];
  isBusy: boolean = true;
  public isEdit: boolean = false;
  private callback: any;
  constructor(private courseService: CourseServices) { }

  ngOnInit(): void {

  }

  public showModal(course: Course = null): Promise<DialogResult> {
    let promise = new Promise<DialogResult>((resolve) => {
      this.callback = resolve;
    });
    if (course) {
      this.isEdit = true;
      this.courseForm = new CourseForm(course);
    } else {
      this.courseForm = new CourseForm();
    }
    this.isBusy = false
    this.courseModal.show();
    return promise;
  }

  onSubmit() {
    this.courseForm.name.setValue(String(this.courseForm.name.value).trim());
    if (this.isEdit) {
      this.editCourse();
    }
    else {
      this.addCourse();
    }
  }

  addCourse() {
    this.courseService.addCourse(this.courseForm.save()).subscribe(response => {
      alert("Course created successfully");
      this.courseForm.reset();
      this.courseModal.hide();
      this.callback(DialogResult.Confirmed);

    },
      err => {
        alert(err.error);
      })
  }

  editCourse() {
    let course: Course = this.courseForm.save();
    this.courseService.updateCourse(course).subscribe(res => {

      alert("Course updated successfully");
      this.courseForm.reset();
      this.courseModal.hide();
      this.callback(DialogResult.Confirmed);
    }, error => {
      alert(error.error);
    });
  }

  public cancel() {
    this.courseModal.hide();
    if (this.callback != null) {
      this.callback(DialogResult.Canceled);
    }
  }
}
