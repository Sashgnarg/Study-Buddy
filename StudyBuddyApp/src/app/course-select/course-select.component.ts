import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course } from '../course';
import { DataService } from '../data.service';
import { Section } from '../section';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-course-select',
  templateUrl: './course-select.component.html',
  styleUrls: ['./course-select.component.css']
})
export class CourseSelectComponent implements OnInit {
  @Output() decrement = new EventEmitter();
  public courses:Course[]
  @Input() num : number
  public curCourse : string
  public sections : Section[] | undefined

  public form:FormGroup
  @Output() formDataSend = new EventEmitter<any>();


  constructor(private DS : DataService , private FB: FormBuilder){
    this.form = this.FB.group({
      course : ['' , Validators.required],
      section : ['' , Validators.required]
    })
    this.num=-1;
    this.curCourse =''
    this.courses=[]
    this.sections=[]
    
  }
  ngOnInit(){
    this.courses = this.DS.getTermCourses();
    this.curCourse = this.courses[0].getCode()
    this.sections = this.courses.find( (e)=> e.getCode() == this.curCourse)?.getSections()

  }
  removeCourse(){
    this.decrement.emit(this.num);
  }

  setSection(){
    this.sections = this.courses.find( (e)=> e.getCode() == this.curCourse)?.getSections()
  }

  formToParent(){
    this.formDataSend.emit(this.form.controls)
  }
}
