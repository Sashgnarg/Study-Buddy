import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private API_KEY = 'b5f4498cdc5a7ac1855ca82a6b5e6f32';
  private city = "vancouver";
  constructor() { }

  getCurrentWeather(): Observable<any> {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.API_KEY}`;
    return new Observable(observer => {
      axios.get(url)
        .then(response => {
          observer.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
}
