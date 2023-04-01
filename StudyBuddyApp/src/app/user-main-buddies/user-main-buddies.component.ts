import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-user-main-buddies',
  templateUrl: './user-main-buddies.component.html',
  styleUrls: ['./user-main-buddies.component.css']
})
export class UserMainBuddiesComponent implements OnInit{
  @Input() member: any;
  
  commonCourses:any[]
  constructor(private DS : DataService , private cookieService : CookieService) {
    //this.commonCourses=[{code:"cmpt372" } , {code:'cmpt276'}]
    this.commonCourses=[]
    //console.log(this.member);
  }
  ngOnInit(): void {
      const loggedInUsername = this.cookieService.get('username')
      this.DS.getCommonCourses(this.member.uName , loggedInUsername ).subscribe(data=>{
        data.forEach((course: any) => {
        this.commonCourses.push(course)  
        //console.log(this.commonCourses)
        });
      })
  }
  
}
