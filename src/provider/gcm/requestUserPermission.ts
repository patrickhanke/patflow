import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  } else {
    console.log('Notification permissions not granted');
  }
};

export const requestNotificationPermissions = async () => {
  const settings = await notifee.requestPermission();

  if (settings.authorizationStatus === 1) {
    console.log('Permission granted');
  } else {
    console.log('Permission denied');
  }
};
