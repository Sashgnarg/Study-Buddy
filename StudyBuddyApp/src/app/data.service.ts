import { Injectable } from '@angular/core';
import { User } from './user';
import { HttpClient } from '@angular/common/http'
import { Course } from './course';
import { last, Observable } from 'rxjs';
import { BlockScrollStrategy } from '@angular/cdk/overlay';
import { AvailabilityBlock } from './availability-block';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(private http: HttpClient) {

  }

  baseUrl = 'http://localhost:8081'

  getFacultyID(s: string) {
    switch (s) {
      case 'Applied Science':
        return 1
      case 'Arts and Social Science':
        return 2;
      case 'Communication Art and Technology':
        return 3;
      case 'Business':
        return 4;
      case 'Education':
        return 5;
      case 'Environment':
        return 6;
      case 'Health Science':
        return 7;
      case 'Science':
        return 8;
    }
    return -1
  }

  async createUser(U: User) {
    var addStudentUrl = this.baseUrl + '/add-student'
    let username = U.uName;
    let first_name = U.fName;
    let last_name = U.lName;
    let password = U.password;
    let faculty = U.faculty // need to turn this to an ID
    let faculty_id = this.getFacultyID(faculty)
    let bio = ""
    let is_admin = false;
    let body = {
      username: username, first_name: first_name, last_name: last_name, password: password,
      faculty_id: faculty_id, bio: bio, is_admin: is_admin
    }
    let student_id: number
    await this.http.post(addStudentUrl, body).subscribe(e => {
      this.getStudentByUsernameObservable(username).subscribe(data => {
        console.log(data)
        let temp = data[0]
        student_id = temp.student_id;
        for (let i = 0; i < U.courseCount; i++) {
          let code = U.courses.at(i)?.getCode();
          let section = U.sections.at(i)?.name
          if (code && section) {
            this.getCourseIDObservable(code, section).subscribe(data => {
              let temp = data[0]
              this.addEnrollmentObservable(student_id, temp.course_id).subscribe()
              this.addAvailabilityObservable(student_id, U.availabilityBlock).subscribe()
            })
          }
        }
      })
    })


    //this.addEnrollmentObservable(student_id , )

  }

  getTermCoursesObservable(): Observable<any> {
    const methodUrl = '/get-courses'
    let courses: Course[] = [];
    return this.http.get<any[]>(this.baseUrl + methodUrl)
  }

  /**
  * Makes an HTTP GET request for the array of the faculty table from the database
  * @returns an observable that can be subscribed to for the response
  */
  getFacultiesObservable(): Observable<any> {
    var methodUrl = '/get-faculties'

    return this.http.get(this.baseUrl + methodUrl);
  }

  /**
  * Makes an HTTP POST request to add a faculty to the database
  * @param faculty_id optional faculty id for reference
  * @param faculty_name faculty name (maximum 30 characters)
  */
  addFaculty(faculty_id: number, faculty_name: string): void {
    var methodUrl = '/add-faculty'

    this.http.post(this.baseUrl + methodUrl, { faculty_id: faculty_id, faculty_name: faculty_name }).subscribe()
  }

  /**
  * Makes an HTTP POST request to add a faculty to the database
  * @param faculty_id - optional faculty id for reference
  * @param faculty_name - faculty name (maximum 30 characters)
  *
  * @returns an observable that can be subscribed to for the response
  */
  addFacultyObservable(faculty_id: number, faculty_name: string): Observable<any> {
    var methodUrl = '/add-faculty'

    return this.http.post(this.baseUrl + methodUrl, { faculty_id: faculty_id, faculty_name: faculty_name })
  }

  /**
  * Makes an HTTP DELETE request to delete a faculty from the database
  * @param faculty_id faculty id of the faculty to be deleted
  */
  deleteFaculty(faculty_id: number): void {
    var methodUrl = '/delete-faculty'

    this.http.request('delete', this.baseUrl + methodUrl, { body: { faculty_id: faculty_id } }).subscribe()
  }


  /**
  * Makes an HTTP DELETE request to delete a faculty from the database and return an observable for response
  * @param faculty_id faculty id of the faculty to be deleted
  *
  * @returns an observable that can be subscribed to for the response
  */
  deleteFacultyObservable(faculty_id: number): Observable<any> {
    var methodUrl = '/delete-faculty'

    return this.http.request('delete', this.baseUrl + methodUrl, { body: { faculty_id: faculty_id } })
  }

  /**
  * Makes an HTTP PATCH request to edit a faculty name in the database and return an observable for response
  * @param faculty_id faculty id of the faculty to be edited
  * @param new_faculty_name the new faculty name
  *
  * @returns an observable that can be subscribed to for the response
  */
  editFacultyObservable(faculty_id: number, new_faculty_name: string): Observable<any> {
    var methodUrl = '/edit-faculty'

    return this.http.patch(this.baseUrl + methodUrl, { faculty_id: faculty_id, new_faculty_name: new_faculty_name })
  }

  getStudentsObservable(): Observable<any> {
    var methodUrl = '/get-students'

    return this.http.get(this.baseUrl + methodUrl)
  }

  addStudentObservable(
    student_id: number,
    username: string,
    first_name: string,
    last_name: string,
    password: string,
    faculty_id: number,
    bio: string,
    is_admin: boolean): Observable<any> {
    var methodUrl = '/add-student'

    if (student_id != 0) {
      return this.http.post(
        this.baseUrl + methodUrl,
        {
          student_id: student_id,
          username: username,
          first_name: first_name,
          last_name: last_name,
          password: password,
          faculty_id: faculty_id,
          bio: bio,
          is_admin: is_admin
        }
      )
    }
    else {
      return this.http.post(
        this.baseUrl + methodUrl,
        {
          username: username,
          first_name: first_name,
          last_name: last_name,
          password: password,
          faculty_id: faculty_id,
          bio: bio,
          is_admin: is_admin
        }
      )
    }
  }

  /**
  * Makes an HTTP DELETE request to delete a student from the database and return an observable for response
  * @param student_id student id of the faculty to be deleted
  *
  * @returns an observable that can be subscribed to for the response
  */
  deleteStudentObservable(student_id: number): Observable<any> {
    var methodUrl = '/delete-student'

    return this.http.request('delete', this.baseUrl + methodUrl, { body: { student_id: student_id } })
  }

  addEnrollmentObservable(student_id: number, course_id: number): Observable<any> {
    var methodUrl = '/add-enrollment'

    return this.http.post(this.baseUrl + methodUrl, { student_id: student_id, course_id: course_id })
  }

  getStudentByIDObservable(student_id: number): Observable<any> {
    let methodUrl = '/get-student-by-id'
    return this.http.get(this.baseUrl + methodUrl + `/${student_id}`)
  }

  getStudentByUsernameObservable(username: string): Observable<any> {
    let methodUrl = '/get-student-by-username'
    return this.http.get(this.baseUrl + methodUrl + `/${username}`)
  }

  getCourseIDObservable(code: string, section: string): Observable<any> {
    let methodUrl = '/get-course-by-code-section'
    return this.http.get(this.baseUrl + methodUrl + `/${code}/${section}`)
  }

  addAvailabilityObservable(student_id: number, availability: AvailabilityBlock[][]): Observable<any> {
    let methodUrl = '/add-availability'
    return this.http.post(this.baseUrl + methodUrl, { student_id: student_id, availability: availability })
  }

}

