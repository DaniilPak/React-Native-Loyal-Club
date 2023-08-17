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
import { createMessage, getRoomMessages } from '../utils/api';
import Loading from './Loading';

interface ConversationProps {
  navigation: any;
  route: any;
}

function Conversation({ route, navigation }: ConversationProps) {
  const { roomId, userId, roomName } = route.params;

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
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [messages, setMessages] = useState<MessageType.Any[]>([]);

  const initFunc = async () => {
    // Set header name to room name
    navigation.setOptions({ title: roomName });

    // Get async user data
    const asyncUserData = await getLocalUserData();
    setAsyncUserData(asyncUserData);

    // Generating a user
    const user: User = {
      id: asyncUserData.userData._id,
      firstName: asyncUserData.userData.name,
      lastName: asyncUserData.userData.surname,
    };

    // Saving user
    setUser(user);

    // Load previous messages
    const roomMessagesResponse = await getRoomMessages(roomId);
    const roomMessages = roomMessagesResponse.roomMessages;
    console.log('roomMessages', roomMessages);

    setMessages(roomMessages);
  };

  const addMessage = async (message: MessageType.Text) => {
    // Add message locally
    setMessages([message, ...messages]);
  };

  const handleSendPress = async (message: MessageType.PartialText) => {
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

    // Making API call to save message
    // With roomId and appropriate type that
    // differs from websocket message type
    try {
      const messageCreatingResponse = await createMessage(textMessage);
      console.log('messageCreatingResponse', messageCreatingResponse);
    } catch (error) {
      console.log('Error with saving message ', error.message);
    }

    // Making call to webSocket
    // With Appropriate websocket type
    if (socket) {
      const messageData: Message = {
        type: 'message', // Specify the data type as 'message'
        message: textMessage,
      };
      socket.send(JSON.stringify(messageData));
    }
  };

  const [pendingMessages, setPendingMessages] = useState<MessageType.Text[]>([]);

  const addPendingMessages = (newMessages: MessageType.Text[]) => {
    setPendingMessages((prevMessages) => [...prevMessages, ...newMessages]);
  };

  useEffect(() => {
    initFunc()
      .then(() => {
        setIsLoaded(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log('Connecting to room...', roomId);

    const newSocket = new WebSocket('ws://localhost:8080');

    newSocket.onopen = () => {
      console.log('WebSocket connected');
      console.log('user', user);
      const joinData: JoinMessage = { type: 'join', room: roomId, userId: userId };
      newSocket.send(JSON.stringify(joinData));
    };

    newSocket.onmessage = (message) => {
      console.log('message', message);
      const parsedMessage = JSON.parse(message.data);
      if (parsedMessage.type === 'message') {
        const parsedMessage: any = JSON.parse(message.data);
        console.log('Message got from wss', parsedMessage.data.message);

        const receivedParsedMessage = parsedMessage.data.message;
        addPendingMessages([receivedParsedMessage]);
      }
    };

    // Saving socket
    setSocket(newSocket);

    // Process pending messages and update the main messages state
    if (pendingMessages.length > 0) {
      setMessages((prevMessages) => [...pendingMessages, ...prevMessages]);
      setPendingMessages([]);
    }

    return () => {
      newSocket.close();
    };
  }, [room, pendingMessages]);

  if (isLoaded) {
    return (
      <SafeAreaProvider>
        <Chat
          showUserNames={true}
          messages={messages}
          onSendPress={handleSendPress}
          user={user}
          textInputProps={{ placeholder: 'Сообщение' }}
        />
      </SafeAreaProvider>
    );
  } else {
    return (
      <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
        <Loading />
      </View>
    );
  }
}

export default Conversation;
