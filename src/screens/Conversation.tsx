import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, TextInput, Button } from 'react-native';
import Con from '../constants';
import { JoinMessage } from '../interfaces/JoinMessage';
import { ReceivedMessage } from '../interfaces/ReceivedMessage';
import { Message } from '../interfaces/Message';
import { Chat, MessageType, User } from '@flyerhq/react-native-chat-ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface ConversationProps {
  navigation: any;
  route: any;
}

function Conversation({ route, navigation }: ConversationProps) {
  // const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [room, setRoom] = useState('default'); // Default room

  const [messages, setMessages] = useState<MessageType.Any[]>([]);
  const user: User = {
    id: '06c33e8b-e835-4736-80f4-63f44b66666c',
    firstName: 'Victor',
    lastName: 'Last Name',
    role: 'admin',
  };

  const addMessage = (message: MessageType.Text) => {
    setMessages([message, ...messages]);
  };

  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.floor(Math.random() * 16);
      const v = c === 'x' ? r : (r % 4) + 8;
      return v.toString(16);
    });
  };

  const handleSendPress = (message: MessageType.PartialText) => {
    const textMessage: MessageType.Text = {
      author: user,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message.text,
      type: 'text',
      status: 'seen',
    };
    addMessage(textMessage);
  };

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8080');
    newSocket.onopen = () => {
      console.log('WebSocket connected');
      const joinData: JoinMessage = { type: 'join', room };
      newSocket.send(JSON.stringify(joinData));
    };
    newSocket.onmessage = (message) => {
      const parsedMessage = JSON.parse(message.data);
      if (parsedMessage.type === 'message') {
        const parsedMessage: ReceivedMessage = JSON.parse(message.data);
        console.log('Message got from wss', parsedMessage);
        setMessages([parsedMessage]);
      }
    };
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [room]);

  const sendMessage = () => {
    if (socket && inputText.trim() !== '') {
      const messageData: Message = {
        type: 'message', // Specify the data type as 'message'
        room: room,
        message: {
          text: inputText.trim(),
          timestamp: new Date().toISOString(),
        },
      };
      socket.send(JSON.stringify(messageData));
      setInputText('');
    }
  };

  return (
    // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //   <Text style={{ color: 'black' }}>Chat</Text>
    //   <View style={{ width: '80%' }}>
    //     {messages.map((message, index) => (
    //       <Text style={{ color: 'black' }} key={index}>{`${message.message.timestamp}: ${message.message.text}`}</Text>
    //     ))}
    //   </View>
    //   <TextInput style={{ borderWidth: 1, width: '80%', marginTop: 10, color: 'black' }} value={inputText} onChangeText={(text) => setInputText(text)} />
    //   <Button title="Send" onPress={sendMessage} />
    // </View>
    <SafeAreaProvider>
      <Chat showUserNames={true} messages={messages} onSendPress={handleSendPress} user={user} />
    </SafeAreaProvider>
  );
}

export default Conversation;
