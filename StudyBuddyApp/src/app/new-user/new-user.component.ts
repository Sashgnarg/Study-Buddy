import { Component , ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CourseSelectComponent } from '../course-select/course-select.component';
import { User } from '../user';
import { Course } from '../course';


@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent {

  public courseCount : number[]
  @ViewChild('child', { static: false }) childComponent!: CourseSelectComponent;

  form : FormGroup
  constructor(private DS : DataService , private FB : FormBuilder){
    this.form = this.FB.group({
      fName: ['' , Validators.required],
      lName:['',Validators.required],
      faculty:['' , Validators.required],
      password:['' , Validators.required],
      repeatPassword:['' , Validators.required , ],
      courses : this.FB.array([])
    })
    this.courseCount=[];
    for (let i = 1; i <= 1; i++) {
      this.courseCount.push(i);
    }    
  }

  incrCount(){
    this.courseCount.push(this.courseCount.length+1)
    console.log(this.courseCount.length)
  }

  removeCourse(data:any){
    this.courseCount.splice(data-1,1)
  }

  pushToCourses(data : FormGroup){
    this.form.value.courses.push(data)
  }

  submit(){
    this.childComponent.formToParent();
    console.log(this.form.value)
    let form = this.form.value
    var courses : Course[];
    courses = [];
    for(let i = 0 ; i<this.courseCount.length ; i++ ){
      let c = new Course()
      // change the follow 2 lines to parse the database to find the matching course
      c.setCode(form.courses[i].course.value)
      console.log(form.courses[i].section.value)
      let section = form.courses[i].section.value
      c.addSection( section , "null" , "null")
      courses.push( c )
    }
    var user = new User(form.fName , form.lName , form.password , this.courseCount.length , courses );
    this.DS.createUser(user);
  }

}
