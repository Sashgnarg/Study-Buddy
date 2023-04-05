import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { User } from '../user';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.css']
})
export class UserMainComponent implements OnInit {
  title = 'SFU Study Buddy';
  title_head2 = 'Who is available? Look at our list of suggestions. They are arranged to fit you best';
  members:any[]
  membersFiltered:any[]
  curUser : any
  username : string
  weather:any;
  weatherImagePath:any;
  searchValue = '';

  constructor(private DS : DataService , private cookieService : CookieService , private AS : AuthService, private weatherService: WeatherService , 
    private router : Router) {
    this.username =''
    this.members =[]
    this.membersFiltered =[]
   };
   ngOnInit(): void {
      this.username = this.cookieService.get('username')
      //this.DS.getStudentByUsernameObservable(this.cookieService.get('username')!)
      this.DS.mostCompatibleObservable(this.username).subscribe(data=>{
        data.forEach((student :any) => {
          let temp = new User(student.username , student.first_name , student.last_name ,this.getFacultyName(student.faculty_id) ,'no for security', 0 , [] , [] , [] )
          temp.setId(student.student_id);
          // some of the fields are left blank because their usage here isnt required, i dont think atleast
          temp.setCombatibility(student.compatibilityPosition)
          temp.setBio(student.bio)
          this.members.push(temp)
          if(this.members.length == data.length){
            console.log(this.members)
          }
        });
      })
      this.getWeather();
   }
   logout(){
    this.AS.logout()
  }
  editProfile() {
    this.router.navigate(['edit'])
  }
  messages() {
    this.router.navigate(['messaging/ '])
  }


  getFacultyName(n: number) {
    switch (n) {
      case 1:
        return 'Applied Science'
      case 2:
        return 'Arts and Social Science';
      case 3:
        return 'Communication Art and Technology';
      case 4:
        return 'Business';
      case 5:
        return 'Education';
      case 6:
        return 'Environment';
      case 7:
        return 'Health Science';
      case 8:
        return 'Science';
    }
    return ''
  }

  getWeather() {
    this.weatherService.getWeather().subscribe(data => {
      this.weather = data;
      this.weatherImagePath = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@4x.png"
      console.log(this.weather);
    });
  }

  filterMembers() {
    // Filter an array of members based on the username while keeping the order
    this.membersFiltered = []
    this.membersFiltered = this.members.filter(member => member.uName.toLowerCase().includes(this.searchValue.toLowerCase()));
    this.membersFiltered.sort((a, b) => {
      const indexA = this.members.indexOf(a);
      const indexB = this.members.indexOf(b);
      return indexA - indexB;
    });
    return this.membersFiltered;
  }
}