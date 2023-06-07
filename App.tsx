import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Con from './src/constants';

import QRDetail from './src/screens/Details';
import QRScreen from './src/screens/QRScreen';
import HomeScanner from './src/screens/HomeScanner';
import Settings from './src/screens/Settings';
import History from './src/screens/History';
import Auth from './src/screens/Auth';
import Confirmation from './src/screens/Confirmation';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  let iconSize = 22;
  let blueColor = Con.AppleBlueLight;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconColor;
          let rn = route.name;
          if (rn === 'Scan QR') {
            iconColor = focused ? blueColor : '#999';
            return <Ionicons name="scan-outline" size={iconSize} color={iconColor} />
          } else if (rn === 'QR card') {
            iconColor = focused ? blueColor : '#999';
            return <Ionicons name="qr-code-outline" size={iconSize} color={iconColor} />
          } else if (rn === 'History') {
            iconColor = focused ? blueColor : '#999';
            return <Ionicons name="book-outline" size={iconSize} color={iconColor} />
          } else if (rn === 'Setttings') {
            iconColor = focused ? blueColor : '#999';
            return <Ionicons name="settings-outline" size={iconSize} color={iconColor} />
          }
        }
      })}
    >
      <Tab.Screen name="Scan QR" component={HomeScanner} />
      <Tab.Screen name="QR card" component={QRScreen} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Setttings" component={Settings} />
    </Tab.Navigator>
  );
}

function App() {
  const [token, setToken] = useState('');

  if (token) {
    // Logged in
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="HomeScanner" component={HomeStack} options={{ header: () => null }} />
          <Stack.Screen name="QRDetail" component={QRDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    // Not logged in
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Auth" component={Auth} options={{ header: () => null }} />
          <Stack.Screen name="Confirmation" component={Confirmation} options={{ header: () => null }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
