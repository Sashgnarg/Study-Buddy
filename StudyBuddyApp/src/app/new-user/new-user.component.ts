import { Component } from '@angular/core';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent {

  public courseCount : number[]

  constructor(){
    this.courseCount = Array(4).fill(0).map((i)=>i);
  }

  incrCount(){
    this.courseCount.push(this.courseCount.length+1)
    console.log(this.courseCount.length)
  }
}
