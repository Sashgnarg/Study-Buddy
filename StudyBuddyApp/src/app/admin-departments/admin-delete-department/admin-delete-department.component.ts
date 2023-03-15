import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-delete-department',
  templateUrl: './admin-delete-department.component.html',
  styleUrls: ['./admin-delete-department.component.css']
})
export class AdminDeleteDepartmentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { element: any }) {
  }
}
