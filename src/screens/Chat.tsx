import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, TextInput, Button } from 'react-native';
import Con from '../constants';
import NavigationRow from '../components/NavigationRow';

interface ChatProps {
  navigation: any;
  route: any;
}

function Chat({ route, navigation }: ChatProps) {
  const navigateToConversation = () => {
    navigation.navigate('Conversation');
  };

  useEffect(() => {}, []);

  return (
    <View style={{ flex: 1, paddingTop: 15 }}>
      <NavigationRow text="Navigate to conversation" onPress={navigateToConversation} />
    </View>
  );
}

export default Chat;
