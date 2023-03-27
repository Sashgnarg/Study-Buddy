import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent {
  loginForm: FormGroup;
  // dataservice

  constructor(private fb: FormBuilder, private router: Router , private DS : DataService , private AS : AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get username() : string  {
    return this.loginForm.get('username')?.value
  } 

  get password() : string  {
    return this.loginForm.get('password')?.value
  } 

  onSubmit() {
    this.AS.login(this.username , this.password).subscribe(data=>{
        if(data.is_admin == true){
          this.AS.isAdmin = true;
          this.AS.isAuthenticated = true
          sessionStorage.setItem('is_admin' , JSON.stringify(true))
          sessionStorage.setItem('is_authenticated' , JSON.stringify(true))
          sessionStorage.setItem('username', this.username)
          console.log({ is_admin : this.AS.isAdmin , is_authenticated:this.AS.isAuthenticated})
          this.router.navigate(['/admin'])
          }
        else if (data.is_admin == false){
          this.AS.isAuthenticated = true
          this.AS.isAdmin = false
          sessionStorage.setItem('is_admin' , JSON.stringify(false))
          sessionStorage.setItem('is_authenticated' , JSON.stringify(true))
          sessionStorage.setItem('username', this.username)
          console.log({ is_admin : this.AS.isAdmin , is_authenticated:this.AS.isAuthenticated})
                  this.router.navigate(['/main'])
        }else{
          console.log({ is_admin : this.AS.isAdmin , is_authenticated:this.AS.isAuthenticated})
          console.log('invalid login')
          this.router.navigate(['/'])
        }
      })
  }
}
