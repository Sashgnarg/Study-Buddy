import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-main-buddies',
  templateUrl: './user-main-buddies.component.html',
  styleUrls: ['./user-main-buddies.component.css']
})
export class UserMainBuddiesComponent {
  @Input() member: any;
  
  constructor() {
    //console.log(this.member);
  }
}
