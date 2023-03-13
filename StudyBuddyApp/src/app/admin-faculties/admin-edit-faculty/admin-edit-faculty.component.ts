import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-edit-faculty',
  templateUrl: './admin-edit-faculty.component.html',
  styleUrls: ['./admin-edit-faculty.component.css']
})
export class AdminEditFacultyComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { element: any }) {
    data.element.new_faculty_name = data.element.faculty_name
  }
}
