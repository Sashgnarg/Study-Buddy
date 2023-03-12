import { Injectable } from '@angular/core';
import { User } from './user';
import { HttpClient } from '@angular/common/http'
import { Course } from './course';
import { Observable } from 'rxjs';

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
}