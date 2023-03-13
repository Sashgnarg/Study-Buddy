import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-delete-faculty',
  templateUrl: './admin-delete-faculty.component.html',
  styleUrls: ['./admin-delete-faculty.component.css']
})
export class AdminDeleteFacultyComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { element: any }) {
  }
}
