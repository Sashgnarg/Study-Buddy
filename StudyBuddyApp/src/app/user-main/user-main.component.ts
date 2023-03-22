import { Component } from '@angular/core';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.css']
})
export class UserMainComponent {
  title = 'Study Buddy';
  title_head2 = 'Who is available?';
  members:any[]

  constructor() {
    this.members = [
      {
        fname: "bobby",
        lname: "chen",
        major: "CS"
      },
      {
        fname: "steve",
        lname: "job",
        major: "BIZ"
      }
    ]
   };
}
