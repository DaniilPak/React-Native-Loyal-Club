import notifee, { AndroidImportance } from '@notifee/react-native';
import { firebase } from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import Con from '../constants';

// Get the FCM token
export async function getFCMToken() {
  try {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      Con.DEBUG && console.log('FCM Token:', fcmToken);
      return fcmToken;
    } else {
      Con.DEBUG && console.log('Failed to get FCM token.');
    }
  } catch (error) {
    Con.DEBUG && console.log('Error getting FCM token:', error);
  }
}

export async function displayNotification(remoteMessage: any) {
  try {
    const { title, body } = remoteMessage.notification;

    // Create a notification channel (required for Android 8.0+)
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
    }

    // Display the notification
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'default',
      },
    });

    // You can perform additional actions when the notification is displayed, if needed
    Con.DEBUG && console.log('Notification displayed:', title, body);
  } catch (error) {
    Con.DEBUG && console.error('Error displaying notification:', error);
  }
}

export async function requestNotificationPermission() {
  try {
    await notifee.requestPermission({ sound: true, announcement: true });
  } catch (error) {
    Con.DEBUG && console.error('Error while requesting notification permission:', error);
  }
}
