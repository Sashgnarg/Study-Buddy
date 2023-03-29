export interface Message {
    id: number | null;
    senderId: number | null;
    receiverId: number | null;
    content: string | null;
    timestamp: Date | null;
  }
  