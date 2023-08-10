// src/interfaces/ReceivedMessage.ts
export interface ReceivedMessage {
  type: 'message';
  message: {
    text: string;
    timestamp: string;
  };
}
