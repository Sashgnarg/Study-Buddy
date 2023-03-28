import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  username: string
  constructor(private cookieService: CookieService, private fb: FormBuilder, private router: Router, private DS: DataService, private AS: AuthService) {
    this.username = this.cookieService.get('username')
  }
}
