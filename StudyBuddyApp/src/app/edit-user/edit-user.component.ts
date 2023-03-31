import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth.service';
import { AvailabilityBlock } from '../availability-block';
import { DataService } from '../data.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  username: string = ''
  student: any
  isLoaded: boolean = false
  faculties: any[] = []
  constructor(private cookieService: CookieService, private fb: FormBuilder, private router: Router, private DS: DataService, private AS: AuthService) {
    this.username = this.cookieService.get('username')
    console.log(this.username)
    this.DS.getFacultiesObservable().subscribe((res) => {
      this.faculties = res
    })
    this.DS.getStudentByUsernameObservable(this.username).subscribe((res) => {
      console.log(res)
      this.student = res[0]
      this.DS.getScheduleByIdObservable(this.student.student_id).subscribe((res) => {
        this.schedule_unformatted = res
        for (let day = 0; day < this.days.length; day++) {
          for (let hour = 0; hour < this.hours.length; hour++) {
            this.schedule[hour][day].is_available = this.schedule_unformatted[this.hours.length * day + hour].is_available
          }
        }
      })
    })
  }

  // Schedule
  hours = Array.from({ length: 15 }, (_, i) => i + 8); // [8, 9, ..., 22, 23]
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  schedule: AvailabilityBlock[][] = this.hours.map(start_time => this.days.map(day => ({ start_time, is_available: false })));
  schedule_unformatted: any[] = [];

  toggleAvailability(hour: number, day: string) {
    const rowIndex = this.hours.indexOf(hour);
    const colIndex = this.days.indexOf(day);
    this.schedule[rowIndex][colIndex].is_available = !this.schedule[rowIndex][colIndex].is_available;
  }

  isAvailable(hour: number, day: string) {
    const rowIndex = this.hours.indexOf(hour);
    const colIndex = this.days.indexOf(day);
    return this.schedule[rowIndex][colIndex].is_available;
  }

  formatHour(hour: number): string {
    if (hour === 12) {
      return '12PM';
    } else if (hour > 12) {
      return `${hour - 12}PM`;
    } else {
      return `${hour}AM`;
    }
  }
}
