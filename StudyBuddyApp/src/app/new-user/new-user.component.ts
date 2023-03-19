import { Component , OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl , ValidatorFn, ValidationErrors, FormControl, Form } from '@angular/forms';
import { User } from '../user';
import { Course } from '../course';
import { Section } from '../section';
import { AvailabilityBlock } from '../availability-block';
import { TimeStartEnd } from '../time-start-end';


@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit{
  public allCourses:Course[]
  public allSections: Section[][]
  public courseCount : number

  public hoursOfDay : String[]

  public weekDays = ['Sun' , 'Mon' , 'Tue' , 'Wed' , 'Thur' , 'Fri' , 'Sat']
  form : FormGroup
  constructor(private DS : DataService , private FB : FormBuilder){
    this.form = this.FB.group({
      uName: ['' , Validators.required],
      fName: ['' , Validators.required],
      lName:['',Validators.required],
      faculty:['' , Validators.required],
      password:['' , [Validators.required , Validators.minLength(6)]],
      repeatPassword:['' , [Validators.required , Validators.minLength(6)]],
      courses : this.FB.array([]),
      studyTime : this.FB.array([])
    } , {validators : this.checkPasswords})
    this.allCourses=[]
    this.allSections=[]
    this.courseCount=0
    this.hoursOfDay =[];

    for(let i = 0 ; i < 14 ;i++){
      let hour = 8+i
      this.hoursOfDay.push(`${hour}:00`)
      this.hoursOfDay.push(`${hour}:30`)
    }
  }


  ngOnInit(){
    this.allCourses = this.DS.getTermCourses();
    this.allCourses.forEach(e => {
      this.allSections.push(e.getSections());
    });
  }

  get courses() : FormArray{
    return this.form.get('courses') as FormArray
  }

  get studyTime() : FormArray{
    return this.form.get('studyTime') as FormArray
  }


  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('password')?.value;
    let confirmPass = group.get('repeatPassword')?.value
    return pass === confirmPass ? null : { match_error: true }
  }

  noOverlap: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
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
    console.log(this.form)

    if(timeInMinutes2 - timeInMinutes1 <= 0){
      return { overlap_error: true }
    }
    return null 
  }

  atLeastOneDay: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let values : any[] = [];
    this.weekDays.forEach(element => { values.push(group.get(`${element}`)?.value)
    });


    for(var i = 0 ; i<values.length ; i++){
      if(values[i] == true){
        return null;
      }
    }
    return { day_error: true }
  }

  incrCount(){
    this.courseCount++;
    const courseForm = this.FB.group({
      code: ['' , Validators.required],
      section:['' , Validators.required]
    })

    this.courses.push(courseForm);
  }


  removeCourse(data:any){
    this.courseCount--;
    this.courses.removeAt(data)
  }

  incrStudyTime(){
    const studyTimeForm = this.FB.group({
      Sun : [false],
      Mon : [false],
      Tue : [false],
      Wed : [false],
      Thur : [false],
      Fri : [false],
      Sat : [false],
      startTime : ['' , Validators.required],
      endTime : ['' , Validators.required],
    } , {validators : [this.noOverlap , this.atLeastOneDay]})
    this.studyTime.push(studyTimeForm)
  }

  removeStudyTime(data:any){
    this.studyTime.removeAt(data);
  }


  setSections(courseIndex : number){
    var curCourse = this.courses.at(courseIndex).get('code')!.value
    return this.allCourses.find((e)=> e.getCode() == curCourse)?.getSections()

  }
  submit(){
    console.log(this.form.value)

    let form = this.form.value
    var userSections : Section[]
    userSections =[]
    var userCourses : Course[];
    userCourses = [];
    for(let i = 0 ; i<this.courseCount ; i++ ){
      let code = this.courses.at(i)!.get('code')!.value
      let c = this.allCourses.find(e => e.getCode() == code)!
      let s = c.getSections().find(e=> e.name == this.courses.at(i).get('section')!.value)!
      userCourses.push( c )
      userSections.push(s)
    }

    let values : any[] = [];
    var availability : AvailabilityBlock[] = []
    for(let i =0; i < this.studyTime.length ; i++){
      this.weekDays.forEach(e =>{
        if(this.studyTime.at(i).get(e)?.value == true){
          availability.push(new AvailabilityBlock(new TimeStartEnd(this.studyTime.at(i).get('startTime')?.value , this.studyTime.at(i).get('endTime')?.value) , e ))
        } 
      }) 
    }
    var user = new User( form.uName ,form.fName , form.lName , form.faculty, form.password , this.courseCount , userCourses ,userSections , availability);
    this.DS.createUser(user);
  }

}
