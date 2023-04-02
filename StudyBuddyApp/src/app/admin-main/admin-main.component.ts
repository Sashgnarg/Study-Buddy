import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.css']
})
export class AdminMainComponent {

  constructor(private router: Router, private http: HttpClient, private ds: DataService) { }
  returnMain() {
    this.router.navigate(["/"])

  }

  addCourses() {
    this.ds.massAddCourses()
  }
}
