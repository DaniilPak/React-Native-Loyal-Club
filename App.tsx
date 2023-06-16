import React, { useState, useEffect, useRef, createContext, useMemo } from 'react';
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

import { AuthContext } from './src/contexts/AuthContext';
import { getArrayFromLocalStorage, saveArrayToLocalStorage } from './src/utils/async';
import MyLoyaltyCards from './src/screens/MyLoyaltyCards';
import { updateAuth } from './src/utils/api';
import BusinessSettings from './src/screens/BusinessSettings';
import SuccessPayment from './src/screens/SuccessPayment';
import ReceiptDetails from './src/screens/ReceiptDetails';
import ManageWorkers from './src/screens/ManageWorkers';
import LoyaltyPercent from './src/screens/LoyaltyPercent';
import AddWorkerScanner from './src/screens/AddWorkerScanner';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  let iconSize = 22;
  let blueColor = Con.AppleBlueLight;

  const [userData, setUserData] = useState([]);
  const [isWorkerOrBusiness, setIsWorkerOrBusiness] = useState(false);

  useEffect(() => {
    getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
      .then(asyncdata => {
        if (asyncdata) {
          setUserData(asyncdata.userData);
          console.log("userData.type", asyncdata.userData.type);
          const isAdmin = asyncdata.userData.type == 'Business' || asyncdata.userData.type == 'Worker';
          setIsWorkerOrBusiness(isAdmin);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

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
      {isWorkerOrBusiness &&
        <>
          <Tab.Screen name="Scan QR" component={HomeScanner} />
          <Tab.Screen name="History" component={History} />
        </>
      }
      <Tab.Screen name="QR card" component={QRScreen} />
      <Tab.Screen name="Setttings" component={Settings} />
    </Tab.Navigator>
  );
}

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
      .then(asyncdata => {
        console.log("App init", asyncdata);
        if (asyncdata.token != null) {
          updateAuth()
            .then(apidata => {
              console.log("update auth apidata", apidata);
              setToken(apidata.token);
              // Saving updated data to LocalStorage
              saveArrayToLocalStorage(apidata, Con.API_AUTH_DATA_KEY);
            })
            .catch(err => {
              console.log(err);
            })
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: (apidata: any) => {
        setToken(apidata.token);
        saveArrayToLocalStorage(apidata, Con.API_AUTH_DATA_KEY);
      },
      signOut: () => {
        setToken('');
      }
    }), []
  );

  if (token) {
    // Logged in
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="HomeScanner" component={HomeStack} options={{ header: () => null }} />
          <Stack.Screen name="QRDetail" component={QRDetail} />
          <Stack.Screen name="MyLoyaltyCards" component={MyLoyaltyCards} />
          <Stack.Screen name="BusinessSettings" component={BusinessSettings} />
          <Stack.Screen name="SuccessPayment" component={SuccessPayment} />
          <Stack.Screen name="ReceiptDetails" component={ReceiptDetails} />
          <Stack.Screen name="ManageWorkers" component={ManageWorkers} />
          <Stack.Screen name="LoyaltyPercent" component={LoyaltyPercent} />
          <Stack.Screen name="AddWorkerScanner" component={AddWorkerScanner} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    // Not logged in
    return (
      <NavigationContainer>
        <AuthContext.Provider value={authContext}>
          <Stack.Navigator>
            <Stack.Screen name="Auth" component={Auth} options={{ header: () => null }} />
            <Stack.Screen name="Confirmation" component={Confirmation} options={{ header: () => null }} />
          </Stack.Navigator>
        </AuthContext.Provider>
      </NavigationContainer>
    );
  }
}

export default App;
