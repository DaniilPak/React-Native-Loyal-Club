// src/interfaces/Message.ts

export interface Message {
  type: 'message';
  room: string;
  message: {
    text: string;
    timestamp: string;
  };
}
