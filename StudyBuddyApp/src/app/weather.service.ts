import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  // Don't forget to change baseURL in weather service!
  baseUrl = 'http://35.222.201.10:8081'

  constructor(private http: HttpClient) { }
  getWeather(): Observable<any> {
    const url = `${this.baseUrl}/weather/`;
    return this.http.get(url);
  }
}
