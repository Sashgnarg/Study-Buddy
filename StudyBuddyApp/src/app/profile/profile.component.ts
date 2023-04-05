import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth.service';
import { AvailabilityBlock } from '../availability-block';
import { Course } from '../course';
import { DataService } from '../data.service';
import { MessagingService } from '../messaging/messaging.service';
import { Section } from '../section';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


  username: string = ''
  loggedUsername: string
  student: any
  isLoaded: boolean = false
  faculties: any[] = []
  loggedUserFacultyID=-1;
  enrolledCourses: any[] = [];
  commonCourses:any[]
  allCourses: Course[] = [];
  allSections: Section[][] = []
  availableCourses: Course[] = [];
  courseCount: number = 0
  hours = Array.from({ length: 15 }, (_, i) => i + 8); // [8, 9, ..., 22, 23]
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  schedule: AvailabilityBlock[][] = this.hours.map(start_time => this.days.map(day => ({ start_time, is_available: false })));
  schedule_unformatted: any[] = [];

  LoggedInschedule: AvailabilityBlock[][] = this.hours.map(start_time => this.days.map(day => ({ start_time, is_available: false })));
  LoggedInschedule_unformatted: any[] = [];

  commonSchedule: AvailabilityBlock[][] = this.hours.map(start_time => this.days.map(day => ({ start_time, is_available: false })));
  constructor(private cookieService: CookieService, private fb: FormBuilder, private router: Router, private messageService: MessagingService,
    private DS: DataService, private AS: AuthService, private _snackBar: MatSnackBar , private route :ActivatedRoute) {
    this.commonCourses=[]
    this.loggedUsername = cookieService.get('username')
    this.username = this.route.snapshot.paramMap.get('uName')!;
    console.log(this.username)
    this.DS.getFacultiesObservable().subscribe((res) => {
      this.faculties = res
    })
    this.DS.getStudentByUsernameObservable(this.username).subscribe((res) => {
      this.student = res[0]
      this.student.password = ''

      // Load courses
      this.DS.getStudentsCoursesByIdObservable(this.student.student_id).subscribe((res) => {
        res.forEach((val: any) => {
          this.enrolledCourses.push({ course_id: val.course_id, code: val.code, section: val.section, name: val.name })
        })
      })

      // Load schedule
      this.DS.getScheduleByIdObservable(this.student.student_id).subscribe((res) => {
        this.schedule_unformatted = res
        for (let day = 0; day < this.days.length; day++) {
          for (let hour = 0; hour < this.hours.length; hour++) {
            this.schedule[hour][day].is_available = this.schedule_unformatted[this.hours.length * day + hour].is_available
            this.commonSchedule[hour][day].is_available =this.schedule_unformatted[this.hours.length * day + hour].is_available
          }
        }
        this.DS.getStudentByUsernameObservable(this.loggedUsername).subscribe( data=>{
          let loggedUser = data[0]
          
          this.DS.getScheduleByIdObservable(loggedUser.student_id).subscribe((res) => {
            this.LoggedInschedule_unformatted = res
            for (let day = 0; day < this.days.length; day++) {
              for (let hour = 0; hour < this.hours.length; hour++) {
                this.LoggedInschedule[hour][day].is_available = this.LoggedInschedule_unformatted[this.hours.length * day + hour].is_available
                if( this.LoggedInschedule[hour][day].is_available && this.schedule[hour][day].is_available ){
                    this.commonSchedule[hour][day].is_common = true
                }
              }
            }
          })
        })

      })
    })

  }
  sendMessage(){
    this.messageService.getMessageHistory(this.loggedUsername , this.username).subscribe(data=>{
      if(data.length > 0){
        this.router.navigate(['/messaging' , this.username])
      }
      else{
        this.messageService.uploadMessageToDatabase(this.loggedUsername , this.username , "Hey I want to connect").subscribe(()=>{
          this.router.navigate(['/messaging' , this.username])
        })
      }
    })
  }

  ngOnInit(): void {
    this.DS.getCommonCourses(this.username , this.loggedUsername ).subscribe(data=>{
      data.forEach((course: any) => {
      this.commonCourses.push(course)  
      //console.log(this.commonCourses)
      });
    })
    this.DS.getStudentByUsernameObservable(this.loggedUsername).subscribe(data=>{
      this.loggedUserFacultyID = data[0].faculty_id;
    })
      
  
  }

  isCommonCourse(course : any){

    let array = this.commonCourses.filter(c => {
      return c.code === course.code})
    // console.log(array)
    if(array.length >0){
      return true;
    }
    return false;
  }
  goBack(){
    this.router.navigate(['/'])
  }

  sameFaculty(){
    return this.loggedUserFacultyID == this.student.faculty_id
  }
  isAvailable(hour: number, day: string) {
    const rowIndex = this.hours.indexOf(hour);
    const colIndex = this.days.indexOf(day);
    return this.commonSchedule[rowIndex][colIndex].is_available;
  }
  isCommon(hour: number, day: string) {
    const rowIndex = this.hours.indexOf(hour);
    const colIndex = this.days.indexOf(day);
    return this.commonSchedule[rowIndex][colIndex].is_common;
  }

  formatHour(hour: number): string {
    if (hour === 12) {
      return '12PM';
    } else if (hour > 12) {
      return `${hour - 12}PM`;
    } else {
      return `${hour}AM`;
    }
  }
}
