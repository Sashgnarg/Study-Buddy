import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-edit-student',
  templateUrl: './admin-edit-student.component.html',
  styleUrls: ['./admin-edit-student.component.css']
})
export class AdminEditStudentComponent {
  faculties: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { element: any, faculties: any[] }) {
    data.element.new_username = data.element.username
    data.element.new_first_name = data.element.first_name
    data.element.new_last_name = data.element.last_name
    data.element.new_password = ''
    data.element.new_faculty_id = data.element.faculty_id
    data.element.new_bio = data.element.bio
    data.element.new_is_admin = data.element.is_admin
    this.faculties = data.faculties
  }
}
