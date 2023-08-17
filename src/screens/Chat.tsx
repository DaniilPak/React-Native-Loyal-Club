import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import Con from '../constants';
import NavigationRow from '../components/NavigationRow';
import { getLocalUserData } from '../utils/getLocalUserData';
import { getUserRooms, markUserRoomAsSeen } from '../utils/api';
import ChatRow from '../components/ChatRow';
import messaging from '@react-native-firebase/messaging';

interface ChatProps {
  navigation: any;
  route: any;
}

function Chat({ route, navigation }: ChatProps) {
  const [asyncUserData, setAsyncUserData] = useState([]);
  const [userRooms, setUserRooms] = useState([]);

  const navigateToConversation = (roomId: string, roomName: string) => {
    /// Mark user room as seen

    /// Locally
    const matchingIndex = userRooms.findIndex((userRoom) => {
      return userRoom.roomId === roomId;
    });

    if (matchingIndex !== -1) {
      // Create a copy of the userRooms array
      const updatedUserRooms = [...userRooms];

      // Modify the user room object at the matching index
      updatedUserRooms[matchingIndex] = {
        ...updatedUserRooms[matchingIndex],
        // Modify the properties you want to change
        // For example:
        isSeen: true,
      };

      // Update the userRooms state
      setUserRooms(updatedUserRooms);
    }

    // Now 'filteredUserRooms' contains the filtered user room objects

    /// In server
    markUserRoomAsSeen(asyncUserData.userData._id, roomId);

    navigation.navigate('Conversation', { roomId, userId: asyncUserData.userData._id, roomName });
  };

  const initFunc = async () => {
    const asyncData = await getLocalUserData();
    setAsyncUserData(asyncData);

    // Get User's rooms
    const userId = asyncData.userData._id;
    const userRooms = await getUserRooms(userId);

    // Save user rooms
    setUserRooms(userRooms.userRooms);
  };

  const renderItem = ({ item }: any) => (
    <ChatRow
      text={`${item.roomName}`}
      secondaryText={item.lastMessage}
      isSeen={item.isSeen}
      onPress={() => navigateToConversation(item.roomId, item.roomName)}
    />
  );

  const renderEmptyContainer = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Сходим за бонусами? (:</Text>
      </View>
    );
  };

  useEffect(() => {
    // Getting all userRoom relations, which
    // Represents User's chats
    initFunc();

    /// Update chats
    messaging().onMessage(async (remoteMessage) => {
      /// Update chat chats
      initFunc();
    });
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: 15 }}>
      <FlatList
        data={userRooms}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyContainer}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default Chat;
