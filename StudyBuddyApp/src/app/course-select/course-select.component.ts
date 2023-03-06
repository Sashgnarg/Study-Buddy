import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from '../course';
import { Section } from '../section';



@Component({
  selector: 'app-course-select',
  templateUrl: './course-select.component.html',
  styleUrls: ['./course-select.component.css']
})
export class CourseSelectComponent {
  @Output() decrement = new EventEmitter();
  public courses:Course[]
  @Input() num : number
  public curCourse : string
  public sections : Section[] | undefined

  constructor(){
    this.num=-1;
    let temp1 = new Course()
    temp1.setCode('cmpt295')
    temp1.addSection("d100" , '1:00' , '2:00')
    temp1.addSection('d200' , '4:00' , '5:00')
    let temp2 = new Course()
    temp2.setCode('cmpt500');
    temp2.addSection('d300' , '5:00' , '6:00')
    temp2.addSection("d400" , "9:00" , "10:00");
    this.courses = [temp1 , temp2]

    this.curCourse = this.courses[0].getCode()
    this.sections = this.courses.find( (e)=> e.getCode() == this.curCourse)?.getSections()

  }

  removeCourse(){
    this.decrement.emit(this.num);
  }

  setSection(){
    this.sections = this.courses.find( (e)=> e.getCode() == this.curCourse)?.getSections()
  }
}
