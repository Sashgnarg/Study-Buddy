import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { AdminDeleteCourseComponent } from './admin-delete-course/admin-delete-course.component';
import { AdminEditCourseComponent } from './admin-edit-course/admin-edit-course.component';

@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.css']
})
export class AdminCoursesComponent {
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  coursesObservable: Observable<any>;
  courses: any[] = [];
  faculties: any[] = [];
  departments: any[] = [];

  displayedColumns: string[] = ["course_id", "code", "term", "section", "name", "faculty_id", "department_id", "edit-col", "delete-col"]
  data = [
    { course_id: 1111, code: "CMPT372", term: "Spring 2023", section: "D100", name: "Web II - Server-side Development", faculty_id: 1, department_id: 1 },
  ]
  dataSource = new MatTableDataSource(this.data)

  constructor(private ds: DataService, public dialog: MatDialog) {
    this.ds.getFacultiesObservable().subscribe((res) => {
      this.faculties = res
    })
    this.ds.getDepartmentsObservable().subscribe((res) => {
      this.departments = res
    })
    this.coursesObservable = this.ds.getCoursesObservable()
  }

  courseForm = new FormGroup({
    courseIdControl: new FormControl(''),
    codeControl: new FormControl(''),
    termControl: new FormControl(''),
    sectionControl: new FormControl(''),
    nameControl: new FormControl(''),
    facultyIdControl: new FormControl(''),
    departmentIdControl: new FormControl(''),
  })
  // TODO: Input validation on formgroup

  ngOnInit() {
    this.refreshCoursesTable()
  }

  addCourse(): void {
    // Get form field values
    var newCourseId = Number(this.courseForm.value.courseIdControl)
    var newCode = String(this.courseForm.value.codeControl)
    var newTerm = String(this.courseForm.value.termControl)
    var newSection = String(this.courseForm.value.sectionControl)
    var newName = String(this.courseForm.value.nameControl)
    var newFacultyId = Number(this.courseForm.value.facultyIdControl)
    var newDepartmentId = Number(this.courseForm.value.departmentIdControl)

    // Send new student to database, then refresh this page's table
    this.ds.addCourseObservable(newCourseId, newCode, newTerm, newSection, newName, newFacultyId, newDepartmentId).subscribe(() => {
      this.refreshCoursesTable()
    })
  }

  async openDeleteDialog(element: any): Promise<void> {
    const dialogRef = this.dialog.open(AdminDeleteCourseComponent, {
      height: '200px',
      width: '300px',
      data: { element: element }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.ds.deleteCourseObservable(element.course_id).subscribe(() => {
          this.refreshCoursesTable()
        })
      }
    })
  }

  async openEditDialog(element: any): Promise<void> {

    const dialogRef = this.dialog.open(AdminEditCourseComponent, {
      height: '200px',
      width: '300px',
      data: { element: element, faculties: this.faculties, departments: this.departments }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.ds.editCourseObservable(element.course_id, result.new_code, result.new_term, result.new_section, result.new_name, result.new_faculty_id, result.new_department_id).subscribe(() => {
          this.refreshCoursesTable()
        })
      }
    })
  }

  refreshCoursesTable() {
    this.coursesObservable.subscribe((res) => {
      this.courses = res
      this.dataSource.data = this.courses
      this.dataSource.sort = this.sort
      console.log(res)
    })
  }
}
