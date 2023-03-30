export interface Message {
    id: number | null;
    senderUsername: string | null;
    receiverUsername: string | null;
    content: string | null;
    timestamp: Date | null;
  }
  