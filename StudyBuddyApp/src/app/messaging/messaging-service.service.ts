import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from './messaging_model';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private apiUrl = 'http://localhost:3000/messages'; // Replace with your API endpoint URL

  constructor(private http: HttpClient) { }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.apiUrl);
  }

  getMessage(id: number): Observable<Message> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Message>(url);
  }

  addMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, message);
  }

  updateMessage(message: Message): Observable<any> {
    const url = `${this.apiUrl}/${message.id}`;
    return this.http.put(url, message);
  }

  deleteMessage(id: number): Observable<Message> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<Message>(url);
  }
}
