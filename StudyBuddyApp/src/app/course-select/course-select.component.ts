import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-course-select',
  templateUrl: './course-select.component.html',
  styleUrls: ['./course-select.component.css']
})
export class CourseSelectComponent {
  @Output() decrement = new EventEmitter();
  public courses:any[]
  @Input() num : number
  constructor(){
    this.num=-1;
    this.courses = [ {code : "cmpt295"} , {code: 'cmpt372'}];
  }

  removeCourse(){
    this.decrement.emit(this.num);
  }
}
