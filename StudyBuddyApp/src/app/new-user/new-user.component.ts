import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidatorFn, ValidationErrors, FormControl, Form } from '@angular/forms';
import { User } from '../user';
import { Course } from '../course';
import { Section } from '../section';
import { AvailabilityBlock } from '../availability-block';
import { TimeStartEnd } from '../time-start-end';
import { Router } from '@angular/router';



@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  public allCourses: Course[]
  public availableCourses: Course[]
  public allSections: Section[][]
  public courseCount: number
  public existingUsers : String[]

  public hoursOfDay: String[]

  public weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
  form: FormGroup
  constructor(private DS: DataService, private FB: FormBuilder , private router : Router) {
    this.existingUsers =[];

    this.availableCourses = []
    this.form = this.FB.group({
      uName: ['', [Validators.required , this.uniqueUsername]],
      fName: ['', Validators.required],
      lName: ['', Validators.required],
      faculty: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(6)]],
      courses: this.FB.array([]),
      studyTime: this.FB.array([])
    }, { validators: [this.checkPasswords] })
    this.allCourses = []
    this.allSections = []
    this.courseCount = 0
    this.hoursOfDay = [];

    for (let i = 0; i < 14; i++) {
      let hour = 8 + i
      this.hoursOfDay.push(`${hour}:00`)
      this.hoursOfDay.push(`${hour}:30`)
    }
    this.schedule = this.hours.map(start_time => this.days.map(day => ({ start_time, is_available: false })));

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
      //console.log(courses)
    });
    this.allCourses = courses
    //console.log(this.allCourses)
    this.allCourses.forEach(e => {
      this.allSections.push(e.getSections());
    });
    this.availableCourses = this.allCourses


    this.DS.getAllUsernamesObservable().subscribe((data)=>{
      data.forEach((element: { username: String; }) => {
        this.existingUsers.push(element.username.toLowerCase())
      });
    })
  }

  get courses(): FormArray {
    return this.form.get('courses') as FormArray
  }

  get studyTime(): FormArray {
    return this.form.get('studyTime') as FormArray
  }

  uniqueUsername: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let curName : String = control.value
    //console.log(this.existingUsers)
    // let names : String[]= ['lbb' , 'otheradmin' ]
    let bool = this.existingUsers.includes(curName.toLowerCase())
    console.log(bool)
    if(bool){
      return {username_error:true}
    }
    return null
  }


  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('repeatPassword')?.value
    return pass === confirmPass ? null : { match_error: true }
  }

  noOverlap: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let timeStr1 = group.get('startTime')?.value;
    let timeStr2 = group.get('endTime')?.value

    const timeParts1 = timeStr1.split(':'); // split the string into hours and minutes
    const hours1 = parseInt(timeParts1[0], 10); // parse hours as an integer
    const minutes1 = parseInt(timeParts1[1], 10); // parse minutes as an integer
    const timeInMinutes1 = (hours1 * 60) + minutes1; // calculate the total minutes since midnight

    const timeParts2 = timeStr2.split(':');
    const hours2 = parseInt(timeParts2[0], 10);
    const minutes2 = parseInt(timeParts2[1], 10);
    const timeInMinutes2 = (hours2 * 60) + minutes2;

    if (timeInMinutes2 - timeInMinutes1 <= 0) {
      return { overlap_error: true }
    }
    return null
  }

  atLeastOneDay: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let values: any[] = [];
    this.weekDays.forEach(element => {
      values.push(group.get(`${element}`)?.value)
    });


    for (var i = 0; i < values.length; i++) {
      if (values[i] == true) {
        return null;
      }
    }
    return { day_error: true }
  }

  incrCount() {
    this.courseCount++;
    const courseForm = this.FB.group({
      code: ['', Validators.required],
      section: ['', Validators.required]
    })

    this.courses.push(courseForm);
  }


  removeCourse(data: any) {
    this.courseCount--;
    this.courses.removeAt(data)
  }

  incrStudyTime() {
    const studyTimeForm = this.FB.group({
      Sun: [false],
      Mon: [false],
      Tue: [false],
      Wed: [false],
      Thur: [false],
      Fri: [false],
      Sat: [false],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    }, { validators: [this.noOverlap, this.atLeastOneDay] })
    this.studyTime.push(studyTimeForm)
  }

  removeStudyTime(data: any) {
    this.studyTime.removeAt(data);
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
  schedule: AvailabilityBlock[][] = [];

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

  returnMain(){
    this.router.navigate(["/"]);
  }


  submit() {
    //console.log(this.form.value)

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

    let values: any[] = [];

    // Transpose schedule array
    var availability: AvailabilityBlock[][] = this.schedule[0].map((_, colIndex) => this.schedule.map(row => row[colIndex]));
    console.log(availability)
    var user = new User(form.uName, form.fName, form.lName, form.faculty, form.password, this.courseCount, userCourses, userSections, availability);
    this.DS.createUser(user);
    this.returnMain()
  }
}
