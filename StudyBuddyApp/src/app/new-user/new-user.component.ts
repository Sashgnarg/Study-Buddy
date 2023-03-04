import { Component } from '@angular/core';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent {

  public courseCount : number[]

  constructor(){
    this.courseCount=[];
    for (let i = 1; i <= 4; i++) {
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
}
