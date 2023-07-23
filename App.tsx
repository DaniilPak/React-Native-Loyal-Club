import React, { useState, useEffect, useRef, createContext, useMemo } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import Con from './src/constants';
import FlashMessage, { showMessage } from "react-native-flash-message";
import messaging from '@react-native-firebase/messaging';

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
import { setFcmToken, updateAuth } from './src/utils/api';
import BusinessSettings from './src/screens/BusinessSettings';
import SuccessPayment from './src/screens/SuccessPayment';
import ReceiptDetails from './src/screens/ReceiptDetails';
import ManageWorkers from './src/screens/ManageWorkers';
import LoyaltyPercent from './src/screens/LoyaltyPercent';
import AddWorkerScanner from './src/screens/AddWorkerScanner';
import Registration from './src/screens/Registration';
import Loading from './src/screens/Loading';
import AccountDeletion from './src/screens/AccountDeletion';
import { displayNotification, getFCMToken, requestNotificationPermission } from './src/utils/notification';

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
        setUserData(asyncdata.userData);
        console.log("userData.type", asyncdata.userData.type);
        console.log("userData._id", asyncdata.userData._id);
        const isAdmin = asyncdata.userData.type == 'Business' || asyncdata.userData.type == 'Worker';
        setIsWorkerOrBusiness(isAdmin);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  if (isWorkerOrBusiness) {
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
        <Tab.Screen name="History" component={History} />
        <Tab.Screen name="QR card" component={QRScreen} />
        <Tab.Screen name="Setttings" component={Settings} />
      </Tab.Navigator>
    );

  } else {
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
        <Tab.Screen name="QR card" component={QRScreen} />
        <Tab.Screen name="Setttings" component={Settings} />
      </Tab.Navigator>
    );
  }
}

function App() {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const init = () => {
    getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
      .then(asyncdata => {
        console.log("App init", asyncdata);
        if (asyncdata.token != null) {
          // Update Auth Setup
          updateAuth()
            .then(apidata => {
              console.log("update auth apidata", apidata);
              setToken(apidata.token);

              // Saving updated data to LocalStorage
              saveArrayToLocalStorage(apidata, Con.API_AUTH_DATA_KEY);

              // Foreground notifications setup
              requestNotificationPermission()
                .then(async () => {
                  // Get and send to server FCM token

                  // Get id of the user taken from server
                  const userId = apidata.userData._id;

                  // Get FCM Token
                  const FCMtoken = await getFCMToken();

                  // Check data
                  console.log("User Id: ", userId, "FCM token: ", FCMtoken);

                  // Save FCM token to server
                  setFcmToken(userId, FCMtoken)
                    .then(() => console.log("Set new FCM token successfully"))
                    .catch(() => console.log("Failed to set new FCM token"));
                })
                .then(() => {
                  // Register the foreground listener
                  messaging().onMessage(async remoteMessage => {
                    console.log('Foreground notification:', remoteMessage);
                    displayNotification(remoteMessage);
                    // Show Flash message
                    showMessage({
                      message: remoteMessage.notification?.title,
                      description: remoteMessage.notification?.body,
                      type: "success",
                    });
                  });
                })
                .catch(err => console.log("Error with setting up Notifications in App.tsx", err))

              // WIpe token for test
              // setToken('');
            })
            .finally(() => {
              setIsLoading(false);
            })
            .catch(err => {
              console.log(err);
              setIsLoading
            })
        } else {
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    // Uncomment to reset local data

    //// setToken('');
    //// saveArrayToLocalStorage([], Con.API_AUTH_DATA_KEY);

    init();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: (apidata: any) => {
        saveArrayToLocalStorage(apidata, Con.API_AUTH_DATA_KEY)
          .then(() => {
            setToken(apidata.token);
            init();
          })
          .catch(err => console.log("Error in App tsx", err));
      },
      signOut: () => {
        setToken('');
        saveArrayToLocalStorage([], Con.API_AUTH_DATA_KEY);
      }
    }), []
  );

  if (token) {
    // Logged in
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 1)' }}>
        <NavigationContainer>
          <AuthContext.Provider value={authContext}>
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
              <Stack.Screen name="AccountDeletion" component={AccountDeletion} />
            </Stack.Navigator>
          </AuthContext.Provider>
        </NavigationContainer>
      </SafeAreaView>
    );
  } else {
    // Not logged in
    if (isLoading) {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Loading" component={Loading} options={{ header: () => null }} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      return (
        <NavigationContainer>
          <AuthContext.Provider value={authContext}>
            <Stack.Navigator>
              <Stack.Screen name="Auth" component={Auth} options={{ header: () => null }} />
              <Stack.Screen name="Confirmation" component={Confirmation} options={{ header: () => null }} />
              <Stack.Screen name="Registration" component={Registration} options={{ header: () => null }} />
            </Stack.Navigator>
          </AuthContext.Provider>
        </NavigationContainer>
      );
    }
  }
}

export default () => (
  <>
    <App />
    <FlashMessage position="top" />
  </>
);
