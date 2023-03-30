import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MessagingService } from './messaging.service';
import {Message} from './messaging_model'
import { CookieService } from 'ngx-cookie-service';



@Component({
  selector: 'app-messaging',                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {
  @ViewChild('searchInput')
  searchInput!: ElementRef;
  @ViewChild('conversationList')
  conversationList!: ElementRef;

  
  username: string = "";
  message: Message = {
    id: null,
    senderUsername: null,
    receiverUsername: null,
    content: '',
    timestamp: null
  };
  
  
  displayedMessages: Message[] = [];
  messages: Message[] = [];
  contactsList: (string | null)[] = [];


  constructor(private cookieService: CookieService, private messageService: MessagingService, private renderer: Renderer2) {
    this.username = this.cookieService.get('username');
    this.username = 'Bob'

    this.messageService.getPreviousMessages(this.username).subscribe((messages: Message[]) => {
      this.messages = messages;
      this.contactsList = [...new Set(this.messages.map(message => message.receiverUsername))]
      .filter(contact => contact !== this.username);
    });
    const testMessages: Message[] = [
      {
        id: 1,
        senderUsername: 'Alice',
        receiverUsername: 'Bob',
        content: 'Hi Bob!',
        timestamp: new Date('2022-01-01T10:00:00')
      },
      {
        id: 2,
        senderUsername: 'Bob',
        receiverUsername: 'Alice',
        content: 'Hello Alice!',
        timestamp: new Date('2022-01-01T10:01:00')
      },
      {
        id: 3,
        senderUsername: 'Charlie',
        receiverUsername: 'Bob',
        content: 'Hey Bob!',
        timestamp: new Date('2022-01-01T10:02:00')
      },
      {
        id: 4,
        senderUsername: 'Bob',
        receiverUsername: 'Charlie',
        content: 'Hi Charlie!',
        timestamp: new Date('2022-01-01T10:03:00')
      }
      ,
      {
        id: 5,
        senderUsername: 'Bob',
        receiverUsername: 'Alice',
        content: 'you suck!',
        timestamp: new Date('2022-01-01T10:01:00')
      }
    ];
    this.messages = testMessages
    this.contactsList = [...new Set(this.messages.map(message => message.receiverUsername))]
    .filter(contact => contact !== this.username);
    
    this.messageService.getMessages().subscribe((message: Message) => {
      if (message.senderUsername !== this.username) {
        this.messages.push(message);
        this.contactsList = [...new Set(this.messages.map(message => message.receiverUsername))]
          .filter(contact => contact !== this.username);
        if (this.displayedMessages.some(displayedMessage => displayedMessage.senderUsername === message.senderUsername)) {
          this.displayedMessages.push(message);
        }
      }
    });

  }

  ngOnInit(): void {
    this.contactsList = [...new Set(this.messages.map(message => message.receiverUsername))]
    .filter(contact => contact !== this.username);

  }

  sendMessageToUser() {
    this.messageService.sendMessage(this.message);
    this.message.content;
  }

  onSendMessage(receiverUsername: string, content: string) {
    this.messageService.uploadMessageToDatabase(this.username, "receiverUsername", content).subscribe(() => {
      this.message.senderUsername = this.username
      this.message.receiverUsername = receiverUsername
      this.message.content = content
      this.message.timestamp = new Date()
      this.sendMessageToUser()
    }, (error) => {
      alert("Error uploading message to the database")
      console.log("Error uploading message to database")
    });
  }

  loadMessages(username: string) {
    this.displayedMessages = this.messages.filter(message => message.senderUsername === username || message.receiverUsername === username);
  }

  filterContacts(): void {
    const filter = this.searchInput.nativeElement.value.toLowerCase();
    const contacts = this.conversationList.nativeElement.getElementsByTagName("li");

    for (let i = 0; i < contacts.length; i++) {
      const username = contacts[i].getElementsByTagName("h4")[0];
      const txtValue = username.textContent || username.innerText;
      const lowercaseTxtValue = txtValue.toLowerCase();

      if (lowercaseTxtValue.indexOf(filter) > -1) {
        this.renderer.setStyle(contacts[i], 'display', '');
      } else {
        this.renderer.setStyle(contacts[i], 'display', 'none');
      }
    }
  }
}
