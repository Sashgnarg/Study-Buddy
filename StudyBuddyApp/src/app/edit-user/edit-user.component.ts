import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth.service';
import { AvailabilityBlock } from '../availability-block';
import { Course } from '../course';
import { DataService } from '../data.service';
import { Section } from '../section';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  username: string = ''
  student: any
  isLoaded: boolean = false
  faculties: any[] = []
  form: FormGroup
  enrolledCourses: any[] = [];
  allCourses: Course[] = [];
  allSections: Section[][] = []
  availableCourses: Course[] = [];
  courseCount: number = 0

  constructor(private cookieService: CookieService, private fb: FormBuilder, private router: Router, private DS: DataService, private AS: AuthService, private _snackBar: MatSnackBar) {
    this.form = this.fb.group({
      courses: this.fb.array([]),
    })
    this.username = this.cookieService.get('username')
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
          this.enrolledCourses.push({ code: val.code, section: val.section, name: val.name })
        })
      })

      // Load schedule
      this.DS.getScheduleByIdObservable(this.student.student_id).subscribe((res) => {
        this.schedule_unformatted = res
        for (let day = 0; day < this.days.length; day++) {
          for (let hour = 0; hour < this.hours.length; hour++) {
            this.schedule[hour][day].is_available = this.schedule_unformatted[this.hours.length * day + hour].is_available
          }
        }
      })
    })
  }

  ngOnInit() {
    let courses: Course[] = []
    this.DS.getTermCoursesObservable().subscribe(data => {
      let temp = new Course();
      let prevCode = ''
      data.forEach((e: { code: string; section: string; }) => {
        if (prevCode != e.code) {
          temp.setCode(prevCode)
          courses.push(temp);
          temp = new Course();
        }
        temp.addSection(e.section, 'not needed', 'not needed');
        prevCode = e.code
      })
      temp.setCode(prevCode)
      courses.push(temp);
      courses.splice(0, 1)
      console.log(courses)
    });
    this.allCourses = courses
    console.log(this.allCourses)
    this.allCourses.forEach(e => {
      this.allSections.push(e.getSections());
    });
    this.availableCourses = this.allCourses
  }

  get courses(): FormArray {
    return this.form.get('courses') as FormArray
  }

  incrCount() {
    this.courseCount++;
    const courseForm = this.fb.group({
      code: ['', Validators.required],
      section: ['', Validators.required]
    })
    this.courses.push(courseForm);
  }

  incrCountWithCodeSection(code: string, section: string) {
    this.courseCount++;
    const courseForm = this.fb.group({
      code: [code, Validators.required],
      section: [section, Validators.required]
    })
    this.courses.push(courseForm);
  }

  removeCourse(data: any) {
    this.courseCount--;
    this.courses.removeAt(data)
  }

  setSections(courseIndex: number) {
    var curCourse = this.courses.at(courseIndex).get('code')!.value
    return this.allCourses.find((e) => e.getCode() == curCourse)?.getSections()
  }

  isSelected(course: Course) {
    //console.log(course)
    for (let i = 0; i < this.courseCount; i++) {
      let code = this.courses.at(i)!.get('code')!.value
      if (code == course.getCode()) {
        return true;
      }
    }
    return false;
  }

  // Schedule
  hours = Array.from({ length: 15 }, (_, i) => i + 8); // [8, 9, ..., 22, 23]
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  schedule: AvailabilityBlock[][] = this.hours.map(start_time => this.days.map(day => ({ start_time, is_available: false })));
  schedule_unformatted: any[] = [];

  toggleAvailability(hour: number, day: string) {
    const rowIndex = this.hours.indexOf(hour);
    const colIndex = this.days.indexOf(day);
    this.schedule[rowIndex][colIndex].is_available = !this.schedule[rowIndex][colIndex].is_available;
  }

  isAvailable(hour: number, day: string) {
    const rowIndex = this.hours.indexOf(hour);
    const colIndex = this.days.indexOf(day);
    return this.schedule[rowIndex][colIndex].is_available;
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

  saveGeneral(): void {
    console.log(this.student)
    this.DS.editStudentObservable(
      this.student.student_id,
      this.student.username,
      this.student.first_name,
      this.student.last_name,
      this.student.password,
      this.student.faculty_id,
      this.student.bio,
      this.student.is_admin
    ).subscribe((res) => {
      if (res == 'OK') {
        this._snackBar.open("successfully saved!", "OK", { duration: 3 * 1000 })
      }
      else {
        this._snackBar.open("Error: Could not save schedule", "OK", { duration: 3 * 1000 })
      }
    })
  }

  saveCourses(): void {
    let form = this.form.value
    var userSections: Section[]
    userSections = []
    var userCourses: Course[];
    userCourses = [];
    for (let i = 0; i < this.courseCount; i++) {
      let code = this.courses.at(i)!.get('code')!.value
      let c = this.allCourses.find(e => e.getCode() == code)!
      let s = c.getSections().find(e => e.name == this.courses.at(i).get('section')!.value)!
      userCourses.push(c)
      userSections.push(s)
    }
    console.log(userCourses)
    console.log(userSections)
  }

  saveSchedule(): void {
    // Transpose schedule array
    var availability: AvailabilityBlock[][] = this.schedule[0].map((_, colIndex) => this.schedule.map(row => row[colIndex]));
    this.DS.modifyScheduleObservable(this.student.student_id, availability).subscribe((res) => {
      console.log(res)
      if (res == 'OK') {
        this._snackBar.open("successfully saved schedule!", "OK", { duration: 3 * 1000 })
      }
      else {
        this._snackBar.open("Error: Could not save schedule", "OK", { duration: 3 * 1000 })
      }
    })
  }
}
