import { Component } from '@angular/core';

@Component({
  selector: 'app-course-select',
  templateUrl: './course-select.component.html',
  styleUrls: ['./course-select.component.css']
})
export class CourseSelectComponent {

  public courses:any[]
  constructor(){
    this.courses = [ {code : "cmpt295"} , {code: 'cmpt372'}];
  }
}
