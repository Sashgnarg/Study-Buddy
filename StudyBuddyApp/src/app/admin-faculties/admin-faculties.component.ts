import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin-faculties',
  templateUrl: './admin-faculties.component.html',
  styleUrls: ['./admin-faculties.component.css']
})
export class AdminFacultiesComponent {
  displayedColumns: string[] = ["faculty-id", "faculty-name"]
  data = [
    { faculty_id: 1, faculty_name: "Applied Sciences" },
    { faculty_id: 2, faculty_name: "Arts and Social Sciences" },
    { faculty_id: 3, faculty_name: "Education" },
  ]

  dataSource = new MatTableDataSource(this.data)

  facultyForm = new FormGroup({
    facultyIdControl: new FormControl(''),
    facultyNameControl: new FormControl('')
  })
  // TODO: Input validation on formgroup


  addFaculty(): void {
    // Get form field values
    var newFacultyId = Number(this.facultyForm.value.facultyIdControl)
    var newFacultyName = String(this.facultyForm.value.facultyNameControl)

    console.log(newFacultyId)
    console.log(newFacultyName)

    // TODO: Send new faculty to database
    this.data.push({ faculty_id: newFacultyId, faculty_name: newFacultyName })
    this.dataSource.data = this.data
  }
}

