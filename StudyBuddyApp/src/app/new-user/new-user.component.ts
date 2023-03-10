import { Component , OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl , ValidatorFn, ValidationErrors, FormControl } from '@angular/forms';
import { User } from '../user';
import { Course } from '../course';
import { Section } from '../section';


@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit{
  public allCourses:Course[]
  public allSections: Section[][]
  public courseCount : number

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
    } , {validators : this.checkPasswords})
    this.allCourses=[]
    this.allSections=[]
    this.courseCount=0
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


  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('password')?.value;
    let confirmPass = group.get('repeatPassword')?.value
    if(pass != confirmPass){
      console.log("dont match")
    }
    return pass === confirmPass ? null : { match_error: true }
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
    var user = new User( form.uName ,form.fName , form.lName , form.faculty, form.password , this.courseCount , userCourses ,userSections );
    this.DS.createUser(user);
  }

}
