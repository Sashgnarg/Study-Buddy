import { Component } from '@angular/core';
import { MessagingService } from './messaging.service';
import {Message} from './messaging_model'

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent {
  message: Message = {
    id: null,
    senderId: null,
    receiverId: null,
    content: '',
    timestamp: null
  };
  messages: Message[] = [];

  constructor(private messageService: MessagingService) {
    this.messageService.getMessages().subscribe((message: Message) => {
      this.messages.push(message);
    });
  }

  sendMessageToUser() {
    this.messageService.sendMessage(this.message);
    this.message.content;
  }

  onSendMessage(senderId: number, receiverId: number, content: string) {
    this.messageService.uploadMessageToDatabase(senderId, receiverId, content).subscribe(() => {
      this.message.senderId = senderId
      this.message.receiverId = receiverId
      this.message.content = content
      this.message.timestamp = new Date()
      this.sendMessageToUser()
    }, (error) => {
      alert("Error uploading message to the database")
      console.log("Error uploading message to database")
    });
  }
}
