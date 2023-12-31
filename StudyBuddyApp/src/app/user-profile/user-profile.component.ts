import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../data.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  selectedUser: any;
  currentUser: any;
  currentUserFacultyId:number = -1
  commonCourses: any = [];

  constructor(public dialogRef: MatDialogRef<UserProfileComponent>, @Inject(MAT_DIALOG_DATA) public userData: any, private DS: DataService, private cookieService : CookieService 
  , private router: Router) {
    this.currentUser =''
    this.selectedUser = userData;
    console.log(this.selectedUser);
  }

  ngOnInit(): void {
    this.currentUser = this.cookieService.get('username')
    this.DS.getCommonCourses(this.currentUser, this.selectedUser.uName).subscribe(courses=>{
      this.commonCourses = courses;
    })
    this.DS.getStudentByUsernameObservable(this.currentUser).subscribe(data=>{
      this.currentUserFacultyId=data[0].faculty_id 
    })
  }
  sameFaculty(){
    console.log(this.currentUserFacultyId == this.DS.getFacultyID(this.selectedUser.faculty))
    return (this.currentUserFacultyId == this.DS.getFacultyID(this.selectedUser.faculty))? true : false
  }
  viewProfile(){
    this.router.navigate(['/profile' ,this.selectedUser.uName])
  }
  close(): void {
    this.dialogRef.close();
  }
}
