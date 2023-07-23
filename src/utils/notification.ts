import notifee, { AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

// Get the FCM token
export async function getFCMToken() {
    try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            console.log('FCM Token:', fcmToken);
            return fcmToken;
        } else {
            console.log('Failed to get FCM token.');
        }
    } catch (error) {
        console.log('Error getting FCM token:', error);
    }
};

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
        console.log('Notification displayed:', title, body);
    } catch (error) {
        console.error('Error displaying notification:', error);
    }
}

export async function requestNotificationPermission() {
    try {
        await notifee.requestPermission();
    } catch (error) {
        console.error('Error while requesting notification permission:', error);
    }
};