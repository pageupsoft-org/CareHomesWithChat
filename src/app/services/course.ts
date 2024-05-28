import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../shared/models/course';

@Injectable({
  providedIn: 'root'
})
export class CourseServices {
  private courseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public getCourses():Observable<Array<Course>> {
    let url = this.courseUrl + "Courses";
    return this.http.get<Array<Course>>(url);
  }

  addCourse(course: Course): Observable<Course> {
    let url = this.courseUrl + "Course";
    return this.http.post<Course>(url, course);
  }
  
  public getCourse(courseId: number): Observable<Course> {
    let url = this.courseUrl + "/Course/" + courseId;
    return this.http.get<Course>(url);
  }

  public updateCourse(course: Course):Observable<Course> {
    let url = this.courseUrl + "Course/" + course.id;
    return this.http.put<Course>(url, course);
  }

  public deleteCourse(courseId: number):Observable<boolean> {
    let url = this.courseUrl + 'Course/' + courseId;
    return this.http.delete<boolean>(url);
  }
}
