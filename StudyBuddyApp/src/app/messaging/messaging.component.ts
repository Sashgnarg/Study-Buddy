import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MessagingService } from './messaging.service';
import { Message } from './messaging_model'
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
    sender_username: null,
    receiver_username: null,
    content: '',
    timestamp: null
  };


  displayedMessages: Message[] = [];
  messages: Message[] = [];
  contactsList: (string | null)[] = [];


  constructor(private cookieService: CookieService, private messageService: MessagingService, private renderer: Renderer2) {
    this.username = this.cookieService.get('username');

    this.messageService.getPreviousMessages(this.username).subscribe((messages: Message[]) => {
      this.messages = messages;
      this.contactsList = [...new Set(this.messages.flatMap(message => [message.receiver_username, message.sender_username]))]
      .filter(contact => contact !== this.username);

    });


    this.messageService.getMessages().subscribe((message: Message) => {
      if (message.sender_username !== this.username) {
        this.messages.push(message);
        this.contactsList = [...new Set(this.messages.flatMap(message => [message.receiver_username, message.sender_username]))]
        .filter(contact => contact !== this.username);
        if (this.displayedMessages.some(displayedMessage => displayedMessage.sender_username === message.sender_username)) {
          this.displayedMessages.push(message);
        }
      }
    });
  }

  ngOnInit(): void {
    this.contactsList = [...new Set(this.messages.map(message => message.receiver_username))]
      .filter(contact => contact !== this.username);

  }

  sendMessageToUser() {
    this.messageService.sendMessage(this.message);
    this.message.content;
  }

  onSendMessage() {
    this.messageService.uploadMessageToDatabase(this.username, this.message.receiver_username, this.message.content).subscribe(() => {
      this.message.sender_username = this.username

      this.message.timestamp = new Date().toLocaleString()
      this.sendMessageToUser()
    }, (error) => {
      console.log("Error transfering message through socket")
    });
  }

  loadMessages(username: string) {
    this.displayedMessages = this.messages.filter(message => message.sender_username === username || message.receiver_username === username);
    this.message.receiver_username = username;
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

