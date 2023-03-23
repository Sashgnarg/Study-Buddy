import { Component } from '@angular/core';
import * as io from 'socket.io-client';


@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent {
  private socket: io.Socket;
  private messages: any[] = [];
  public message: string = '';

  constructor() {
    this.socket = io.io('http://localhost:3000');
    this.socket.on('message', (data) => {
      this.messages.push(data);
    });
    // More socket event listeners would be set up here
  }

  public sendMessage() {
    this.socket.emit('message', this.message);
    this.messages.push({ text: this.message, status: 'pending' });
    this.message = '';
  }

  public sendVoiceMessage() {
    // Record voice message and send it via socket
  }

  public sendPicture() {
    // Select picture file and send it via socket
  }
}
