import { Injectable } from '@angular/core';
import { User } from './user';
import { HttpClient } from '@angular/common/http'
import { Course } from './course';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(private http : HttpClient) {

   }

  
  createUser(U : User){

  }

  getTermCourses() : Course[]{
    let temp1 = new Course()
    temp1.setCode('cmpt295')
    temp1.addSection("d100" , '1:00' , '2:00')
    temp1.addSection('d200' , '4:00' , '5:00')
    let temp2 = new Course()
    temp2.setCode('cmpt500');
    temp2.addSection('d300' , '5:00' , '6:00')
    temp2.addSection("d400" , "9:00" , "10:00");
    return [temp1 , temp2]

  }
}
