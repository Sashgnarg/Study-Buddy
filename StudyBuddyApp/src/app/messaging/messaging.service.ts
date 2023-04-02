import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import {Message} from './messaging_model'
import {io, Socket} from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private url: string = 'http://localhost:8081';
  private socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io(this.url, { transports: ['websocket'], upgrade: false, withCredentials: true, extraHeaders: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE", "Access-Control-Allow-Headers": "X-Requested-With, Access-Control-Allow-Headers, Content-Type, Authorization, Origin, Accept"} });
  }

  public sendMessage(message: Message): void {
    this.socket.emit('new-message', message);
  }

  public getMessages(): Observable<Message> {
    return new Observable((observer: Observer<Message>) => {
      this.socket.on('new-message', (message: Message) => {
        observer.next(message);
      });
    });
  }

  public getPreviousMessages(sender_username: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.url}/messages?sender_username=${sender_username}`);
  }

  public uploadMessageToDatabase(sender_username: string, receiver_username: string | null, content: string | null): Observable<void> {
    return this.http.post<void>(`${this.url}/messages`, { sender_username, receiver_username, content });
  }
}