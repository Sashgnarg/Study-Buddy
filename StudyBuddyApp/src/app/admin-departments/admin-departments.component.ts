import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { AdminDeleteDepartmentComponent } from './admin-delete-department/admin-delete-department.component';
import { AdminEditDepartmentComponent } from './admin-edit-department/admin-edit-department.component';

@Component({
  selector: 'app-admin-departments',
  templateUrl: './admin-departments.component.html',
  styleUrls: ['./admin-departments.component.css']
})
export class AdminDepartmentsComponent {
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  departmentsObservable: Observable<any>;
  departments: any[] = [];
  faculties: any[] = [];

  displayedColumns: string[] = ["faculty_id", "department_id", "department_name", "edit-col", "delete-col"]
  data = [
    { faculty_id: 1, department_id: 1, department_name: "TestDepartment" },
    { faculty_id: 1, department_id: 2, department_name: "TestDepartment2" },
    { faculty_id: 2, department_id: 1, department_name: "TestDepartment3" },
  ]
  dataSource = new MatTableDataSource(this.data)

  constructor(private ds: DataService, public dialog: MatDialog) {
    this.ds.getFacultiesObservable().subscribe((res) => {
      this.faculties = res
    })
    this.departmentsObservable = this.ds.getDepartmentsObservable()
  }

  departmentForm = new FormGroup({
    facultyIdControl: new FormControl(''),
    departmentIdControl: new FormControl(''),
    departmentNameControl: new FormControl(''),
  })
  // TODO: Input validation on formgroup

  ngOnInit() {
    this.refreshDepartmentTable()
  }

  addDepartment(): void {
    // Get form field values
    var newFacultyId = Number(this.departmentForm.value.facultyIdControl)
    var newDepartmentId = Number(this.departmentForm.value.departmentIdControl)
    var newDepartmentName = String(this.departmentForm.value.departmentNameControl)

    // Send new department to database, then refresh this page's table
    this.ds.addDepartmentObservable(newFacultyId, newDepartmentId, newDepartmentName).subscribe((res) => {
      this.refreshDepartmentTable()
    })
  }

  async openDeleteDialog(element: any): Promise<void> {
    console.log(element.faculty_id, element.department_id)
    const dialogRef = this.dialog.open(AdminDeleteDepartmentComponent, {
      height: '200px',
      width: '300px',
      data: { element: element }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result == true) {
        this.ds.deleteDepartmentObservable(element.faculty_id, element.department_id).subscribe(() => {
          this.refreshDepartmentTable()
        })
      }
    })
  }

  async openEditDialog(element: any): Promise<void> {
    console.log(element.faculty_id, element.department_id)
    const dialogRef = this.dialog.open(AdminEditDepartmentComponent, {
      height: '200px',
      width: '300px',
      data: { element: element }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result != null) {
        this.ds.editDepartmentObservable(element.faculty_id, element.department_id, result).subscribe(() => {
          this.refreshDepartmentTable()
        })
      }
    })
  }

  refreshDepartmentTable() {
    this.departmentsObservable.subscribe((res) => {
      this.departments = res
      this.dataSource.data = this.departments
      this.dataSource.sort = this.sort
      console.log(res)
    })
  }
}
