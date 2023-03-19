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

  getFacultyID(s : string){
    switch(s){
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

  createUser(U: User) {
    var signUpUrl =this.baseUrl + '/add-student'

    let username = U.uName;
    let first_name = U.fName;
    let last_name = U.lName;
    let password = U.password;
    let faculty = U.faculty // need to turn this to an ID
    let faculty_id = this.getFacultyID(faculty)
    let bio = ""
    let is_admin = false;
    let body = {username:username , first_name:first_name , last_name:last_name , password:password , 
                faculty_id:faculty_id, bio:bio , is_admin:is_admin  }
    this.http.post(signUpUrl,body).subscribe();
    // this.http.post()
    console.log(body)
  }

  getTermCourses(): Course[] {
    const methodUrl = '/get-courses'

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
}