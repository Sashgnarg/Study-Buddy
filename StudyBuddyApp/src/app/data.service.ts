import { Injectable } from '@angular/core';
import { User } from './user';
const { Pool } = require('pg')


@Injectable({
  providedIn: 'root'
})
export class DataService {

  pool = new Pool({
    connectionString: 'postgres://studybuddy:cmpt372@34.145.35.44'
})


  constructor() {

    

   }
  test(){
    this.pool.query("CREATE TABLE student (id SERIAL PRIMARY KEY,name VARCHAR(50),age INTEGER,courses TEXT[])")
  }
  createUser(U : User){

  }
}
