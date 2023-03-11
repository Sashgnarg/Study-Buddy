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

  getFaculties(): Observable<any> {
    var getFacultyUrl = 'http://localhost:8080/get-faculties'

    return this.http.get(getFacultyUrl);
  }

  addFaculty(faculty_id: number, faculty_name: string) {
    var addFacultyUrl = 'http://localhost:8080/add-faculty'

    this.http.post(addFacultyUrl, { faculty_id: faculty_id, faculty_name: faculty_name }).subscribe()
  }
}
