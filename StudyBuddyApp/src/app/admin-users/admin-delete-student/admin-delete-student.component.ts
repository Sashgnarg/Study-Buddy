import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-delete-student',
  templateUrl: './admin-delete-student.component.html',
  styleUrls: ['./admin-delete-student.component.css']
})
export class AdminDeleteStudentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { element: any }) {
  }
}
