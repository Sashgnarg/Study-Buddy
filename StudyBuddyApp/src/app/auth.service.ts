import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { DataService } from './data.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated = false;
  public isAdmin = false;

  constructor(private DS : DataService , private cookieService : CookieService){
    // if(sessionStorage.getItem('is_admin')){
    //   this.isAdmin = JSON.parse(sessionStorage.getItem('is_admin')!)
    // }
    // if(sessionStorage.getItem('is_authenticated')){
    //   this.isAuthenticated = true
    // }

    // cookie set up down here 

    if(cookieService.get('is_admin')){
      this.isAdmin = JSON.parse(cookieService.get('is_admin')!)
    }
    if(cookieService.get('is_authenticated')){
      this.isAuthenticated = true
    }

  }

  login(username: string, password: string) : Observable<any> {
    return this.DS.loginObservable(username , password)
  }

  logout(): void {
    // sessionStorage.removeItem('is_authenticated')
    // sessionStorage.removeItem('is_admin')
    //sessionStorage.removeItem('username')

    this.cookieService.delete('is_admin')
    this.cookieService.delete('is_authenticated')
    this.cookieService.delete('username')
    
    this.isAdmin = false;
    this.isAuthenticated = false;
    location.reload()
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getIsAdmin(): boolean {
    return this.isAdmin
  }
}
