import { Injectable } from '@angular/core';
import { User } from './user';
import { HttpClient } from '@angular/common/http'
import { Course } from './course';
import { last, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(private http: HttpClient) {

  }

  baseUrl = 'http://localhost:8080'


  createUser(U: User) {
    var signUpUrl = 'http://localhost:8080/signUp'

    this.http.post(signUpUrl, U).subscribe();
    console.log(JSON.stringify(U))
  }

  getTermCourses(): Course[] {
    let temp1 = new Course()
    temp1.setCode('cmpt295')
    temp1.addSection("d100", '1:00', '2:00')
    temp1.addSection('d200', '4:00', '5:00')
    let temp2 = new Course()
    temp2.setCode('cmpt500');
    temp2.addSection('d300', '5:00', '6:00')
    temp2.addSection("d400", "9:00", "10:00");
    return [temp1, temp2]
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

  /**
  * Makes an HTTP GET request to retrieve all students from the database and return an observable for response
  *
  * @returns an observable that can be subscribed to for the response
  */
  getStudentsObservable(): Observable<any> {
    var methodUrl = '/get-students'

    return this.http.get(this.baseUrl + methodUrl)
  }


  /**
  * Makes an HTTP POST request to add a department to the database and return an observable for the response
  * @param student_id optional student_id of the new student
  * @param username username of the student to be added, must be unique
  * @param first_name first name of the student, must be < 35 characters
  * @param last_name last name of the student, must be < 35 characters
  * @param password password of the student
  * @param faculty_id faculty id of the student, must exist in the faculty table
  * @param bio personal biography of the student to be added, < 255 characters
  *
  * @returns an observable that can be subscribed to for the response
  */
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

  /**
* Makes an HTTP PATCH request to modify a student in the database and return an observable for response*
*
* @returns an observable that can be subscribed to for the response
*/
  editStudentObservable(
    student_id: number,
    new_username: string,
    new_first_name: string,
    new_last_name: string,
    new_password: string,
    new_faculty_id: number,
    new_bio: string,
    new_is_admin: boolean): Observable<any> {


    var methodUrl = '/edit-student'
    return this.http.patch(
      this.baseUrl + methodUrl,
      {
        student_id: student_id,
        new_username: new_username,
        new_first_name: new_first_name,
        new_last_name: new_last_name,
        new_password: new_password,
        new_faculty_id: new_faculty_id,
        new_bio: new_bio,
        new_is_admin: new_is_admin
      }
    )
  }

  /**
  * Makes an HTTP GET request to retrieve all departments from the database and return an observable for the response
  *
  * @returns an observable that can be subscribed to for the response
  */
  getDepartmentsObservable(): Observable<any> {
    var methodUrl = '/get-departments'

    return this.http.get(this.baseUrl + methodUrl)
  }

  /**
  * Makes an HTTP POST request to add a department to the database and return an observable for the response
  * @param faculty_id faculty id of the department to be deleted
  * @param department_id department id of the department to be deleted
  * @param department_name name of the department to be deleted
  *
  * @returns an observable that can be subscribed to for the response
  */
  addDepartmentObservable(faculty_id: number, department_id: number, department_name: string,): Observable<any> {
    var methodUrl = '/add-department'

    if (department_id != 0 && department_id != null) {
      return this.http.post(
        this.baseUrl + methodUrl,
        {
          faculty_id: faculty_id,
          department_id: department_id,
          department_name: department_name
        }
      )
    }
    else {
      return this.http.post(
        this.baseUrl + methodUrl,
        {
          faculty_id: faculty_id,
          department_name: department_name
        }
      )
    }
  }

  /**
  * Makes an HTTP PATCH request to edit a department name in the database and return an observable for response
  * @param faculty_id faculty id of the department to be edited
  * @param department_id faculty id of the department to be edited
  * @param new_department_name the new department name
  *
  * @returns an observable that can be subscribed to for the response
  */
  editDepartmentObservable(faculty_id: number, department_id: number, new_department_name: string): Observable<any> {
    var methodUrl = '/edit-department'

    return this.http.patch(this.baseUrl + methodUrl, { faculty_id: faculty_id, department_id: department_id, new_department_name: new_department_name })
  }

  /**
  * Makes an HTTP DELETE request to delete a department from the database and return an observable for response
  * @param faculty_id faculty id of the department to be deleted
  * @param department_id department id of the department to be deleted
  *
  * @returns an observable that can be subscribed to for the response
  */
  deleteDepartmentObservable(faculty_id: number, department_id: number): Observable<any> {
    var methodUrl = '/delete-department'

    return this.http.request('delete', this.baseUrl + methodUrl,
      {
        body: { faculty_id: faculty_id, department_id: department_id }
      }
    )
  }
}