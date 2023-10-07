import React, { useState, useEffect, useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
MaterialCommunityIcons.loadFont();

import Con from './src/constants';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import messaging from '@react-native-firebase/messaging';
import NetInfo from '@react-native-community/netinfo';

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
import { getBadge, getCurrentUserIdAsync, getUserRooms, setFcmToken, updateAuth } from './src/utils/api';
import BusinessSettings from './src/screens/BusinessSettings';
import SuccessPayment from './src/screens/SuccessPayment';
import ReceiptDetails from './src/screens/ReceiptDetails';
import ManageWorkers from './src/screens/ManageWorkers';
import AddWorkerScanner from './src/screens/AddWorkerScanner';
import Registration from './src/screens/Registration';
import Loading from './src/screens/Loading';
import AccountDeletion from './src/screens/AccountDeletion';
import { displayNotification, getFCMToken, requestNotificationPermission } from './src/utils/notification';
import Announcements from './src/screens/Announcements';
import Chat from './src/screens/Chat';
import Conversation from './src/screens/Conversation';
import { triggerVibration } from './src/utils/helper';
import { getLocalUserData } from './src/utils/getLocalUserData';
import { BadgeContext } from './src/contexts/BadgeContext';
import { View } from 'react-native';
import PressableIcon from './src/components/PressableIcon.';
import PressableIcon2 from './src/components/PressableIcon2';
import Abonnements from './src/screens/Abonnements';
import UserAbonnements from './src/screens/UserAbonnements';
import CreateAbonnement from './src/screens/CreateAbonnement';
import AllAbonnements from './src/screens/AllAbonnements';
import ScanAbonnement from './src/screens/ScanAbonnement';
import ScanAbonnementDetails from './src/screens/ScanAbonnementDetails';
import CreateAbonnementDetails from './src/screens/CreateAbonnementDetails';
import SuccessAbonnementCreation from './src/screens/SuccessAbonnementCreation';
import AbonnementVisitConfirmation from './src/screens/AbonnementVisitConfirmation';
import SuccessVisitCreation from './src/screens/SuccessVisitCreation';
import AbonnementCompleteInfo from './src/screens/AbonnementCompleteInfo';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack({ navigation }: any) {
  let iconSize = 22;
  let blueColor = Con.AppleBlueLight;

  const [badge, setBadge] = useState(null);

  useEffect(() => {
    getBadge().then((badge) => {
      if (badge > 0) {
        setBadge(badge);
      }
    });

    /// Set Worker | Business panel
    getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
      .then((asyncdata) => {
        const isAdmin = asyncdata.userData.type === 'Business' || asyncdata.userData.type === 'Worker';

        if (isAdmin) {
          navigation.setOptions({
            headerRight: () => (
              <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                <PressableIcon
                  onPress={() => {
                    navigation.navigate('History');
                  }}
                  icon="book-outline"
                />
                <View style={{ width: 5 }}></View>
                <PressableIcon2
                  onPress={() => {
                    navigation.navigate('Scan QR');
                  }}
                  icon="qrcode-scan"
                />
              </View>
            ),
          });
        }
      })
      .catch((err) => console.log(err));

    const notificationActionHandler = async (remoteMessage: any) => {
      console.log('Notification caused app to open from background state:', remoteMessage);

      const navType = remoteMessage.data.type;
      if (navType === null) {
        console.log('Message data type is null');
        return;
      }

      try {
        if (navType === 'ReceiptDetails') {
          const receiptId = remoteMessage.data.receiptId;
          navigation.navigate(navType, { _receiptId: receiptId });
        } else if (navType === 'Conversation') {
          const [userId, roomId, roomName] = await Promise.all([
            getCurrentUserIdAsync(),
            remoteMessage.data.roomId,
            remoteMessage.data.roomName,
          ]);

          navigation.navigate('Conversation', { roomId, userId, roomName });
        }
      } catch (error) {
        console.error('Error while navigating:', error);
      }
    };

    /// Handle on Notification press event
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      notificationActionHandler(remoteMessage);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        notificationActionHandler(remoteMessage);
      });
  }, []);

  return (
    <BadgeContext.Provider value={{ badge, setBadge }}>
      <Tab.Navigator
        initialRouteName="QR card"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconColor;
            let rn = route.name;
            if (rn === 'QR card') {
              iconColor = focused ? blueColor : '#999';
              return <Ionicons name="qr-code" size={iconSize} color={iconColor} />;
            } else if (rn === 'Setttings') {
              iconColor = focused ? blueColor : '#999';
              return <Ionicons name="settings-outline" size={iconSize} color={iconColor} />;
            } else if (rn === 'Chat') {
              iconColor = focused ? blueColor : '#999';
              return <Ionicons name="chatbubbles-outline" size={iconSize} color={iconColor} />;
            }
          },
        })}
      >
        <Tab.Screen
          name="Chat"
          component={Chat}
          options={{
            header: () => null,
            title: 'Сообщения',
            tabBarBadge: badge,
          }}
        />
        <Tab.Screen
          name="QR card"
          component={QRScreen}
          options={{
            header: () => null,
            title: 'Мой QR',
          }}
        />
        <Tab.Screen
          name="Setttings"
          component={Settings}
          options={{
            header: () => null,
            title: 'Настройки',
          }}
        />
      </Tab.Navigator>
    </BadgeContext.Provider>
  );
}

function App() {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const init = () => {
    getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
      .then((asyncdata) => {
        Con.DEBUG && console.log('App init', asyncdata);
        if (asyncdata.token != null) {
          // Update Auth Setup
          updateAuth()
            .then((apidata) => {
              Con.DEBUG && console.log('update auth apidata', apidata);
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
                  Con.DEBUG && console.log('User Id: ', userId, 'FCM token: ', FCMtoken);

                  // Save FCM token to server
                  setFcmToken(userId, FCMtoken)
                    .then(() => Con.DEBUG && console.log('Set new FCM token successfully'))
                    .catch(() => Con.DEBUG && console.log('Failed to set new FCM token'));
                })
                .then(() => {
                  // Register the foreground listener
                  messaging().onMessage(async (remoteMessage) => {
                    Con.DEBUG && console.log('Foreground notification:', remoteMessage);
                    triggerVibration();
                    // displayNotification(remoteMessage);
                    // Show Flash message
                    showMessage({
                      message: remoteMessage.notification?.title,
                      description: remoteMessage.notification?.body,
                      type: 'success',
                      duration: 5000,
                    });
                  });
                })
                .catch((err) => Con.DEBUG && console.log('Error with setting up Notifications in App.tsx', err));

              // WIpe token for test
              // setToken('');
            })
            .finally(() => {
              setIsLoading(false);
            })
            .catch((err) => {
              Con.DEBUG && console.log(err);
              setIsLoading;
            });
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        Con.DEBUG && console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    init();
  }, []);

  /// Net state
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        showMessage({
          message: 'Потеряно соединение с Интернетом.',
          description: 'Пожалуйста, проверьте ваше подключение.',
          type: 'danger',
          duration: 3000,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: (apidata: any) => {
        saveArrayToLocalStorage(apidata, Con.API_AUTH_DATA_KEY)
          .then(() => {
            setToken(apidata.token);
            init();
          })
          .catch((err) => Con.DEBUG && console.log('Error in App tsx', err));
      },
      signOut: () => {
        setToken('');
        saveArrayToLocalStorage([], Con.API_AUTH_DATA_KEY);
      },
    }),
    []
  );

  if (token) {
    // Logged in
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthContext.Provider value={authContext}>
            <Stack.Navigator>
              <Stack.Screen
                name="HomeScanner"
                component={HomeStack}
                options={{ title: 'LoyalClub', headerTitleAlign: 'left' }}
              />
              <Stack.Screen name="QRDetail" component={QRDetail} />
              <Stack.Screen
                name="MyLoyaltyCards"
                component={MyLoyaltyCards}
                options={{
                  title: 'Мои карты',
                }}
              />
              <Stack.Screen
                name="BusinessSettings"
                component={BusinessSettings}
                options={{
                  title: 'Бизнес',
                }}
              />
              <Stack.Screen
                name="SuccessPayment"
                component={SuccessPayment}
                options={{
                  title: 'Успешная оплата',
                }}
              />
              <Stack.Screen
                name="SuccessAbonnementCreation"
                component={SuccessAbonnementCreation}
                options={{
                  title: 'Успешное создание абонемента',
                }}
              />
              <Stack.Screen
                name="ReceiptDetails"
                component={ReceiptDetails}
                options={{
                  title: 'Детали платежа',
                }}
              />
              <Stack.Screen
                name="ManageWorkers"
                component={ManageWorkers}
                options={{
                  title: 'Сотрудники',
                }}
              />
              <Stack.Screen
                name="AddWorkerScanner"
                component={AddWorkerScanner}
                options={{
                  title: 'Добавить сотрудника',
                }}
              />
              <Stack.Screen
                name="AccountDeletion"
                component={AccountDeletion}
                options={{
                  title: 'Удаление Аккаунта',
                }}
              />
              <Stack.Screen
                name="Announcements"
                component={Announcements}
                options={{
                  title: 'Анонсы',
                }}
              />
              <Stack.Screen
                name="Scan QR"
                component={HomeScanner}
                options={{
                  title: 'Сканировать QR',
                }}
              />
              <Stack.Screen
                name="History"
                component={History}
                options={{
                  title: 'История',
                }}
              />
              <Stack.Screen
                name="Abonnements"
                component={Abonnements}
                options={{
                  title: 'Абонементы',
                }}
              />
              <Stack.Screen
                name="UserAbonnements"
                component={UserAbonnements}
                options={{
                  title: 'Мои абонементы',
                }}
              />
              <Stack.Screen
                name="ScanAbonnement"
                component={ScanAbonnement}
                options={{
                  title: 'Сканировать абонемент',
                }}
              />
              <Stack.Screen
                name="ScanAbonnementDetails"
                component={ScanAbonnementDetails}
                options={{
                  title: 'Детали абонемента',
                }}
              />
              <Stack.Screen
                name="CreateAbonnement"
                component={CreateAbonnement}
                options={{
                  title: 'Создать абонемент',
                }}
              />
              <Stack.Screen
                name="CreateAbonnementDetails"
                component={CreateAbonnementDetails}
                options={{
                  title: 'Создание абонемента',
                }}
              />
              <Stack.Screen
                name="AllAbonnements"
                component={AllAbonnements}
                options={{
                  title: 'Все абонементы',
                }}
              />
              <Stack.Screen
                name="AbonnementVisitConfirmation"
                component={AbonnementVisitConfirmation}
                options={{
                  title: 'Подтверждение визита',
                }}
              />
              <Stack.Screen
                name="SuccessVisitCreation"
                component={SuccessVisitCreation}
                options={{
                  title: 'Успешное создание визита',
                }}
              />
              <Stack.Screen
                name="AbonnementCompleteInfo"
                component={AbonnementCompleteInfo}
                options={{
                  title: 'Информация об абонементе',
                }}
              />
              <Stack.Screen name="Conversation" component={Conversation} />
            </Stack.Navigator>
          </AuthContext.Provider>
        </NavigationContainer>
      </SafeAreaProvider>
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
