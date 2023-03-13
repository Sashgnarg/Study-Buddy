import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { AdminEditFacultyComponent } from './admin-edit-faculty/admin-edit-faculty.component';

@Component({
  selector: 'app-admin-faculties',
  templateUrl: './admin-faculties.component.html',
  styleUrls: ['./admin-faculties.component.css']
})
export class AdminFacultiesComponent {
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  facultiesObservable: Observable<any>;
  faculties: any[] = [];

  displayedColumns: string[] = ["faculty_id", "faculty_name", "edit-col", "delete-col"]
  data = [
    { faculty_id: 1, faculty_name: "Applied Sciences" },
    { faculty_id: 2, faculty_name: "Arts and Social Sciences" },
    { faculty_id: 3, faculty_name: "Education" },
  ]
  dataSource = new MatTableDataSource(this.data)

  constructor(private ds: DataService, public dialog: MatDialog) {
    this.facultiesObservable = this.ds.getFacultiesObservable()
  }

  facultyForm = new FormGroup({
    facultyIdControl: new FormControl(''),
    facultyNameControl: new FormControl('')
  })
  // TODO: Input validation on formgroup

  ngOnInit() {
    this.refreshFacultyTable()
  }

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

  async openEditDialog(element: any): Promise<void> {
    console.log(element.faculty_id)
    const dialogRef = this.dialog.open(AdminEditFacultyComponent, {
      height: '200px',
      width: '300px',
      data: { element: element }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        console.log(result)
        this.ds.editFacultyObservable(element.faculty_id, result).subscribe(() => {
          this.refreshFacultyTable()
        })
      }
    })
  }

  refreshFacultyTable() {
    this.facultiesObservable.subscribe((res) => {
      this.faculties = res
      this.dataSource.data = this.faculties
      console.log(this.sort)
      this.dataSource.sort = this.sort
      console.log(res)
    })
  }
}