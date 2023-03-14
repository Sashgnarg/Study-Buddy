import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewUserComponent } from './new-user/new-user.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { AdminFacultiesComponent } from './admin-faculties/admin-faculties.component';
import { AdminDepartmentsComponent } from './admin-departments/admin-departments.component';
import { AdminCoursesComponent } from './admin-courses/admin-courses.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminEditFacultyComponent } from './admin-faculties/admin-edit-faculty/admin-edit-faculty.component';
import { AdminDeleteFacultyComponent } from './admin-faculties/admin-delete-faculty/admin-delete-faculty.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { FacultyNamePipe } from './faculty-name.pipe';


@NgModule({
  declarations: [
    AppComponent,
    NewUserComponent,
    AdminMainComponent,
    AdminFacultiesComponent,
    AdminDepartmentsComponent,
    AdminCoursesComponent,
    AdminUsersComponent,
    AdminEditFacultyComponent,
    AdminDeleteFacultyComponent,
    FacultyNamePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatSortModule,
    MatCheckboxModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
