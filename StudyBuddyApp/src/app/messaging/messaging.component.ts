import { Component, OnInit, ElementRef, Renderer2, ViewChild, NgZone } from '@angular/core';
import { MessagingService } from './messaging.service';
import { Message } from './messaging_model'
import { CookieService } from 'ngx-cookie-service';
import { io, Socket } from 'socket.io-client';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {
  private url: string = 'http://localhost:8081';
  private socket: Socket;
  @ViewChild('searchInput')
  searchInput!: ElementRef;
  @ViewChild('conversationList')
  conversationList!: ElementRef;
  @ViewChild('messages', { static: false }) private messagesContainer: ElementRef | undefined



  username: string = "";
  currentContact: string | null = null;
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


  constructor(private cookieService: CookieService, private messageService: MessagingService,
    private renderer: Renderer2, private _ngZone: NgZone, private route: ActivatedRoute, private router: Router) {
    this.socket = io(this.url, { transports: ['websocket'], upgrade: false, withCredentials: true, extraHeaders: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE", "Access-Control-Allow-Headers": "X-Requested-With, Access-Control-Allow-Headers, Content-Type, Authorization, Origin, Accept" } });
    this.username = this.cookieService.get('username');

    this.messageService.getPreviousMessages(this.username).subscribe((messages: Message[]) => {
      this.messages = messages;
      this.createAndSortContactsList()
      this.currentContact = this.route.snapshot.paramMap.get('username')!;
      if (this.currentContact.trim() == '') {
        this.currentContact = this.contactsList.at(0)!;
      }
      console.log(this.currentContact)
      this.loadMessages()
    });

    this.socket.on('new_message', (message: Message) => {
      this._ngZone.run(() => {
        this.messages.push(message);
        this.createAndSortContactsList()
        this.loadMessages();
      });
    });


  }

  ngOnInit(): void {
    this.createAndSortContactsList()

  }
  goBack() {
    this.router.navigate(['/'])
  }
  goProfile() {
    this.router.navigate([`profile/${this.currentContact}`])
  }

  sendMessageToUser() {
    this.socket.emit('new_message', this.message);
    this.message.content = '';
  }

  onSendMessage() {
    this.messageService.uploadMessageToDatabase(this.username, this.message.receiver_username, this.message.content).subscribe(() => {
      this.message.sender_username = this.username

      this.message.timestamp = new Date().toISOString()
      this.sendMessageToUser()
    }, (error) => {
      console.log("Error transfering message through socket")
    });
  }

  loadMessages() {
    this.displayedMessages = this.messages.filter(message =>
      (message.sender_username === this.currentContact || message.receiver_username === this.currentContact) &&
      (message.sender_username === this.username || message.receiver_username === this.username)
    );
    this.message.receiver_username = this.currentContact;
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 100); // add a delay of 100ms
  }

  filterContacts(): void {
    const filter = this.searchInput.nativeElement.value.toLowerCase();
    const contacts = this.conversationList.nativeElement.getElementsByTagName("li");

    for (let i = 0; i < contacts.length; i++) {
      const username = contacts[i].getElementsByTagName("h4")[0];
      const txtValue = username.textContent || username.innerText;
      const lowercaseTxtValue = txtValue.toLowerCase();
      console.log("Filter:", filter, "Username:", lowercaseTxtValue);

      if (lowercaseTxtValue.startsWith(filter)) {
        this.renderer.setStyle(contacts[i], 'display', '');
      } else {
        this.renderer.setStyle(contacts[i], 'display', 'none');
      }
    }
  }

  createAndSortContactsList(): void {
    // First, get a list of all unique contacts from the messages array
    const uniqueContacts = [...new Set(this.messages.flatMap(message => [message.receiver_username, message.sender_username]))];

    // Then, sort the contacts based on the latest message timestamp
    this.contactsList = uniqueContacts
      .filter(contact => contact !== this.username)
      .sort((a, b) => {
        // Find the latest message timestamp for contact a
        const latestMessageA = this.messages
          .filter(message => message.receiver_username === a || message.sender_username === a)
          .reduce((latest, message) => {
            const messageTime = message.timestamp ? new Date(message.timestamp) : new Date(0);
            if (messageTime > latest) {
              return messageTime;
            }
            return latest;
          }, new Date(0));

        // Find the latest message timestamp for contact b
        const latestMessageB = this.messages
          .filter(message => message.receiver_username === b || message.sender_username === b)
          .reduce((latest, message) => {
            const messageTime = message.timestamp ? new Date(message.timestamp) : new Date(0);
            if (messageTime > latest) {
              return messageTime;
            }
            return latest;
          }, new Date(0));

        // Compare the latest message timestamps and sort the contacts in descending order
        return latestMessageB.getTime() - latestMessageA.getTime();
      });



  }



}

