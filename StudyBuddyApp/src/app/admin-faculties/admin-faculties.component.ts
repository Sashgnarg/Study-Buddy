import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-admin-faculties',
  templateUrl: './admin-faculties.component.html',
  styleUrls: ['./admin-faculties.component.css']
})
export class AdminFacultiesComponent {
  facultiesObservable: Observable<any>;
  faculties: any[] = [];

  constructor(private ds: DataService) {
    this.facultiesObservable = this.ds.getFacultiesObservable()
  }

  displayedColumns: string[] = ["faculty-id", "faculty-name", "delete-col"]
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

    // Send new faculty to database, then refresh this page's table
    this.ds.addFacultyObservable(newFacultyId, newFacultyName).subscribe((res) => {
      this.refreshFacultyTable()
    })
  }

  async openDeleteDialog(element: any): Promise<void> {
    // TODO: Confirm deletion with alert window
    console.log(element.faculty_id)

    // Send deletion to database, then refresh this page's table
    this.ds.deleteFacultyObservable(element.faculty_id).subscribe((res) => {
      this.refreshFacultyTable()
    })
  }

  ngOnInit() {
    this.refreshFacultyTable()
  }

  refreshFacultyTable() {
    this.facultiesObservable.subscribe((res) => {
      this.faculties = res
      this.dataSource.data = this.faculties
      console.log(res)
    })
  }
}