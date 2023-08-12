import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, TextInput, Button, FlatList } from 'react-native';
import Con from '../constants';
import NavigationRow from '../components/NavigationRow';
import { getLocalUserData } from '../utils/getLocalUserData';
import { getUserRooms } from '../utils/api';

interface ChatProps {
  navigation: any;
  route: any;
}

function Chat({ route, navigation }: ChatProps) {
  const [asyncUserData, setAsyncUserData] = useState([]);
  const [userRooms, setUserRooms] = useState([]);

  const navigateToConversation = (roomId: string) => {
    navigation.navigate('Conversation', { roomId });
  };

  const initFunc = async () => {
    const asyncData = await getLocalUserData();
    Con.DEBUG && console.log('Got async user data in Chat.tsx', asyncData);
    setAsyncUserData(asyncData);

    // Get User's rooms
    const userId = asyncData.userData._id;
    const userRooms = await getUserRooms(userId);
    console.log('Got user rooms in Chat.tsx', userRooms);

    // Save user rooms
    setUserRooms(userRooms.userRooms);
  };

  const renderItem = ({ item }: any) => (
    <NavigationRow text={`${item.roomId}`} onPress={() => navigateToConversation(item.roomId)} />
  );

  useEffect(() => {
    // Getting all userRoom relations, which
    // Represents User's chats
    initFunc();
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: 15 }}>
      <FlatList data={userRooms} renderItem={renderItem} keyExtractor={(item) => item._id} />
    </View>
  );
}

export default Chat;
