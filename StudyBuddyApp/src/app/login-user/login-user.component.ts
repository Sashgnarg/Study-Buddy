import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent {
  loginForm: FormGroup;
  // dataservice

  constructor(private fb: FormBuilder, private router: Router , private DS : DataService ) {
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
    this.DS.loginObservable(this.username , this.password).subscribe(data=>{
      if(data.is_admin == true){
        this.router.navigate(["/admin"])
      }
      else if (data.is_admin == false){
        this.router.navigate(["/main"])
      }else{
        console.log("invalid user, add modal?")
      }
    })
    // if (this.loginForm.valid) {
    //   //console.log(this.loginForm.value);
    //   this.router.navigate(["/main"])
    // }
  }

}
