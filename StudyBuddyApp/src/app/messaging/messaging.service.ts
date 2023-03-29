import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import {Message} from './messaging_model'
import * as io from 'socket.io-client';
import { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private url: string = 'http://localhost:3000';
  private socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io.io(this.url);
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

  public getPreviousMessages(senderId: number, receiverId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.url}/messages?senderId=${senderId}&receiverId=${receiverId}`);
  }

  public uploadMessageToDatabase(senderId: number, receiverId: number, content: string): Observable<void> {
    return this.http.post<void>(`${this.url}/messages`, { senderId, receiverId, content });
  }
}