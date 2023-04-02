import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../data.service';
import { UserProfileComponent } from '../user-profile/user-profile.component';

@Component({
  selector: 'app-user-main-buddies',
  templateUrl: './user-main-buddies.component.html',
  styleUrls: ['./user-main-buddies.component.css']
})
export class UserMainBuddiesComponent implements OnInit{
  @Input() member: any;
  @Input() index: any;
  
  commonCourses:any[]
  constructor(private DS : DataService , private cookieService : CookieService, public dialog: MatDialog) {
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

  openUserProfile(member: any) {
    const dialogRef = this.dialog.open(UserProfileComponent, {
      data: member
    });
  }
  
}
