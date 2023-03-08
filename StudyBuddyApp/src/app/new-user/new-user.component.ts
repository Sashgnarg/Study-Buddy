import { Component , OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { CourseSelectComponent } from '../course-select/course-select.component';
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
  @ViewChild('child', { static: false }) childComponent!: CourseSelectComponent;

  form : FormGroup
  constructor(private DS : DataService , private FB : FormBuilder){
    this.form = this.FB.group({
      fName: ['' , Validators.required],
      lName:['',Validators.required],
      faculty:['' , Validators.required],
      password:['' , Validators.required],
      repeatPassword:['' , Validators.required],
      courses : this.FB.array([]),
    })
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
    var user = new User(form.fName , form.lName , form.password , this.courseCount , userCourses ,userSections );
    this.DS.createUser(user);
  }
  test(){
    console.log(this.courses.value);
  }

}
