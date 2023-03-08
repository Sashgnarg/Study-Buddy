import { Component , ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CourseSelectComponent } from '../course-select/course-select.component';


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

  }

}
