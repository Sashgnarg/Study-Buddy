export interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: Date;
  }
  
  export interface Conversation {
    contactId: number;
    messages: Message[];
  }