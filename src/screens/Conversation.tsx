import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, TextInput, Button } from 'react-native';
import Con from '../constants';
import { JoinMessage } from '../interfaces/JoinMessage';
import { ReceivedMessage } from '../interfaces/ReceivedMessage';
import { Message } from '../interfaces/Message';
import { Chat, MessageType, User } from '@flyerhq/react-native-chat-ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';
import { getLocalUserData } from '../utils/getLocalUserData';

interface ConversationProps {
  navigation: any;
  route: any;
}

function Conversation({ route, navigation }: ConversationProps) {
  const { roomId } = route.params;

  // Default user
  const userDefault: User = {
    id: 'null',
    firstName: 'null',
    lastName: 'null',
  };

  const [asyncUserData, setAsyncUserData] = useState([]);
  const [room, setRoom] = useState(roomId);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [user, setUser] = useState<User>(userDefault);

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<MessageType.Any[]>([]);

  const initFunc = async () => {
    // Get async user data
    const asyncUserData = await getLocalUserData();
    setAsyncUserData(asyncUserData);

    // Generating a user
    const user: User = {
      id: asyncUserData.userData._id,
      firstName: asyncUserData.userData.name,
      lastName: asyncUserData.surname,
    };

    // Saving user
    setUser(user);
  };

  const addMessage = (message: MessageType.Text) => {
    setMessages([message, ...messages]);
  };

  const handleSendPress = (message: MessageType.PartialText) => {
    const textMessage: MessageType.Text = {
      author: user,
      roomId: room,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message.text,
      type: 'text',
      status: 'seen',
    };

    addMessage(textMessage);
    console.log('textMessage', textMessage);

    // Making call to webSocket
    if (socket) {
      const messageData: Message = {
        type: 'message', // Specify the data type as 'message'
        message: textMessage,
      };
      socket.send(JSON.stringify(messageData));
    }
  };

  useEffect(() => {
    initFunc();
  }, []);

  useEffect(() => {
    console.log('Connecting to room...', roomId);

    const newSocket = new WebSocket('ws://localhost:8080');

    newSocket.onopen = () => {
      console.log('WebSocket connected');
      const joinData: JoinMessage = { type: 'join', room: roomId };
      newSocket.send(JSON.stringify(joinData));
    };

    newSocket.onmessage = (message) => {
      const parsedMessage = JSON.parse(message.data);
      if (parsedMessage.type === 'message') {
        const parsedMessage: ReceivedMessage = JSON.parse(message.data);
        console.log('Message got from wss', parsedMessage);
      }
    };

    // Saving socket
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [room]);

  return (
    <SafeAreaProvider>
      <Chat showUserNames={true} messages={messages} onSendPress={handleSendPress} user={user} />
    </SafeAreaProvider>
  );
}

export default Conversation;
