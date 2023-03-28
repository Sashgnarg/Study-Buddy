import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { User } from '../user';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.css']
})
export class UserMainComponent implements OnInit {
  title = 'Study Buddy';
  title_head2 = 'Who is available?';
  members:any[]
  curUser : any
  username : string

  constructor(private DS : DataService , private cookieService : CookieService , private AS : AuthService) {
    this.username =''
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
   ngOnInit(): void {
      this.username = this.cookieService.get('username')
       this.DS.getStudentByUsernameObservable(this.cookieService.get('username')!)
   }
   logout(){
    this.AS.logout()
   }
}
