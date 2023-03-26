import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated = false;
  public isAdmin = false;

  constructor(private DS : DataService){
    if(sessionStorage.getItem('is_admin')){
      this.isAdmin = JSON.parse(sessionStorage.getItem('is_admin')!)
    }
    if(sessionStorage.getItem('is_authenticated')){
      this.isAuthenticated = true
    }
  }

  login(username: string, password: string) : Observable<any> {
    return this.DS.loginObservable(username , password)
  }

  logout(): void {
    sessionStorage.removeItem('is_authenticated')
    sessionStorage.removeItem('is_admin')
    this.isAdmin = false;
    this.isAuthenticated = false;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getIsAdmin(): boolean {
    return this.isAdmin
  }
}
