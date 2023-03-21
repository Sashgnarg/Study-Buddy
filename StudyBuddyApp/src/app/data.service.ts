import { Injectable } from '@angular/core';
import { User } from './user';
import { HttpClient } from '@angular/common/http'
import { Course } from './course';
import { flatMap, last, mergeMap, Observable, timestamp } from 'rxjs';
import { BlockScrollStrategy } from '@angular/cdk/overlay';
import { AvailabilityBlock } from './availability-block';
import { TimeStartEnd } from './time-start-end';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public weekDays = ['Sun' , 'Mon' , 'Tue' , 'Wed' , 'Thur' , 'Fri' , 'Sat']


  constructor(private http: HttpClient) {

  }

  baseUrl = 'http://localhost:8081'

  fillAvailability(U : User){
    let availability : AvailabilityBlock[]= []
      U.availabilityBlock.forEach(e=>{
        let start = parseInt( e.time.start.slice(0 , 2))
        let end = parseInt(e.time.end.slice(0,2)); 
        //console.log(start , end)
        while(start < end  ){
          let strStart = `${start}:00`

          if(start < 10){
            strStart = `0${start}:00`
          }
          let timeEnd = start+1
          let strEnd = `${timeEnd}:00`
          if(timeEnd<10){
            let strEnd = `0${timeEnd}:00`
          }
          availability.push(new AvailabilityBlock( new TimeStartEnd(strStart,strEnd),e.day))
          start++
        }
      })
      console.log(availability)
      if(availability.some(element => { return element.day == 'Sun' && 
                                        element.time.start == '09:00'&&
                                        element.time.end == '10:00'})) {
        console.log("the includes statement should work");
      }
      return availability;
  }
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
    var addStudentUrl =this.baseUrl + '/add-student'
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
    let student_id : any

    //this.submitStudent(body)
    this.http.post(addStudentUrl,body).subscribe((id)=>{
      console.log(id);
      student_id = id;
      console.log("student id is: " , student_id)


        for(let i = 0 ; i<U.courseCount ; i++){
          let code = U.courses.at(i)?.getCode();
          let section = U.sections.at(i)?.name
          console.log(code , section)
          if(code && section){
            this.getCourseIDObservable(code , section).subscribe(course_id=>{
              let temp = course_id
              console.log(temp)
              this.addEnrollmentObservable(student_id , temp).subscribe()
            })//end course id subcribe
          }//end if 
        } //end for 

        // let availability = this.fillAvailability(U)
        // for(let j = 0; j<7 ; j++){ 
        //   let body = []
        //   for(let i = 0 ; i<14 ; i++){
        //     let start = 8+i;
        //     let strStart = `${start}:00`
        //     if(start < 10){
        //       strStart = `0${start}:00`
        //     }
        //     let timeEnd = start+1
        //     let strEnd = `${timeEnd}:00`
        //     if(timeEnd<10){
        //       let strEnd = `0${timeEnd}:00`
        //     }
        //     if(availability.some(element =>{ return element.day ==this.weekDays[j] &&
        //                                             element.time.start == strStart &&
        //                                             element.time.end == strEnd
        //     })){
        //       console.log("we found an hour of availability for user:" , student_id)
        //         //this.addAvailabilityBlocksObservable(student_id , j ,strStart , strEnd , true).subscribe()
        //         body.push({student_id:student_id, day_of_week:j , start_time:strStart , end_time:strEnd , is_available:true })
        //     }else{
        //         //this.addAvailabilityBlocksObservable(student_id , j ,strStart , strEnd , false).subscribe()
        //         body.push({student_id:student_id, day_of_week:j ,start_time:strStart , end_time:strEnd , is_available:false })
        //     }
        //     //console.log(strStart ,strEnd )
        //   }
        // this.addAvailabilityBlocksObservable(body).subscribe()
        // }
    });



  

  
    //this.addEnrollmentObservable(student_id , )

  }

  getTermCoursesObservable(): Observable<any> {
    const methodUrl = '/get-courses'
    let courses : Course[]= [];
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

  addEnrollmentObservable(student_id : number, course_id : number): Observable<any> {
    var methodUrl = '/add-enrollment'
  
    return this.http.post(this.baseUrl + methodUrl, { student_id:student_id, course_id: course_id })
  }

  getStudentByIDObservable(student_id : number): Observable<any>{
    let methodUrl ='/get-student-by-id'
    return this.http.get(this.baseUrl+methodUrl+`/${student_id}`)
  }

  getStudentByUsernameObservable(username : string): Observable<any>{
    let methodUrl ='/get-student-by-username'
    return this.http.get(this.baseUrl+methodUrl+`/${username}`)
  }

  getCourseIDObservable(code:string , section : string): Observable<any>{
    let methodUrl ='/get-course-by-code-section'
    return this.http.get(this.baseUrl+methodUrl+`/${code}/${section}`)
  }

  addAvailabilityBlocksObservable(body:  any): Observable<any>{
    let methodUrl = '/add-availability-block'
    console.log(body)
    return this.http.post(this.baseUrl+methodUrl , body)
  }
}

