import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent {
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  studentsObservable: Observable<any>;
  students: any[] = [];
  faculties: any[] = [];

  displayedColumns: string[] = ["student_id", "username", "first_name", "last_name", "password", "faculty_id", "bio", "is_admin", "edit-col", "delete-col"]
  data = [
    { student_id: 1111, username: "jackshephard4", first_name: "Jack", last_name: "Shephard", password: 84930281490389021840, faculty_id: 1, bio: "Test bio 1", is_admin: false },
    { student_id: 2222, username: "georgemichael61", first_name: "George Michael", last_name: "Bluth", password: 4958498590380094, faculty_id: 2, bio: "Test bio 2", is_admin: false },
    { student_id: 3333, username: "JOHN_LOCKE5", first_name: "John", last_name: "Locke", password: 8943048398491432, faculty_id: 3, bio: "Test bio 3", is_admin: false },
  ]
  dataSource = new MatTableDataSource(this.data)

  constructor(private ds: DataService, public dialog: MatDialog) {
    this.ds.getFacultiesObservable().subscribe((res) => {
      this.faculties = res
    })
    this.studentsObservable = this.ds.getStudentsObservable()
  }

  studentForm = new FormGroup({
    studentIdControl: new FormControl(''),
    usernameControl: new FormControl(''),
    firstNameControl: new FormControl(''),
    lastNameControl: new FormControl(''),
    passwordControl: new FormControl(''),
    facultyIdControl: new FormControl(''),
    bioControl: new FormControl(''),
    isAdminControl: new FormControl(''),
  })
  // TODO: Input validation on formgroup

  ngOnInit() {
    this.refreshStudentTable()
  }

  addStudent(): void {
    // Get form field values
    var newStudentId = Number(this.studentForm.value.studentIdControl)
    var newUsername = String(this.studentForm.value.usernameControl)
    var newFirstName = String(this.studentForm.value.firstNameControl)
    var newLastName = String(this.studentForm.value.lastNameControl)
    var newPassword = String(this.studentForm.value.passwordControl)
    var newFaculty = Number(this.studentForm.value.facultyIdControl)
    var newBio = String(this.studentForm.value.bioControl)
    var newIsAdmin = Boolean(this.studentForm.value.isAdminControl)

    console.log(newStudentId)
    console.log(newUsername)
    console.log("newFaculty", newFaculty)

    // Send new student to database, then refresh this page's table
    this.ds.addStudentObservable(newStudentId, newUsername, newFirstName, newLastName, newPassword, newFaculty, newBio, newIsAdmin).subscribe((res) => {
      this.refreshStudentTable()
    })
  }

  async openDeleteDialog(element: any): Promise<void> {
    console.log(element.student_id)
    this.ds.deleteStudentObservable(element.student_id).subscribe((res) => {
      this.refreshStudentTable()
    })
  }

  async openEditDialog(element: any): Promise<void> {
    console.log(element.student_id)
  }

  refreshStudentTable() {
    this.studentsObservable.subscribe((res) => {
      this.students = res
      this.dataSource.data = this.students
      this.dataSource.sort = this.sort
      console.log(res)
    })
  }
}
