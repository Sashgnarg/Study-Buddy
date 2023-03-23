import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-edit-course',
  templateUrl: './admin-edit-course.component.html',
  styleUrls: ['./admin-edit-course.component.css']
})
export class AdminEditCourseComponent {
  faculties: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { element: any, faculties: any[] }) {
  }
}
