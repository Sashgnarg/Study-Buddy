import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-edit-department',
  templateUrl: './admin-edit-department.component.html',
  styleUrls: ['./admin-edit-department.component.css']
})
export class AdminEditDepartmentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { element: any }) {
    data.element.new_department_name = data.element.department_name
  }
}
