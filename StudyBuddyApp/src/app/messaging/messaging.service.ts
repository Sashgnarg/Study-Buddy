import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import {Message} from './messaging_model'

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private url: string = 'http://35.222.201.10:8081';

  constructor(private http: HttpClient) {
  }

  // public sendMessage(message: Message): void {
  //   this.socket.emit('new-message', message);
  // }

  // public getMessages(): Observable<Message> {
  //   return new Observable((observer: Observer<Message>) => {
  //     this.socket.on('new-message', (message: Message) => {
  //       observer.next(message);
  //     });
  //   });
  // }

  public getPreviousMessages(sender_username: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.url}/messages?sender_username=${sender_username}`);
  }

  public uploadMessageToDatabase(sender_username: string, receiver_username: string | null, content: string | null): Observable<void> {
    return this.http.post<void>(`${this.url}/messages`, { sender_username, receiver_username, content });
  }
  getMessageHistory(sender_username: string, receiver_username: string | null):Observable<any>{
    return this.http.get(this.url+`/message-history/${sender_username}/${receiver_username}`)
  }
}