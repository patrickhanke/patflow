import messaging from '@react-native-firebase/messaging';
import { displayNotification } from './displayNotification';

const listenForMessages = messaging().onMessage(async remoteMessage => {
  const messageId = remoteMessage.messageId as string;

  console.log('A new FCM message arrived!', remoteMessage);
  displayNotification(
    remoteMessage.notification?.title as string,
    remoteMessage.notification?.body as string,
    'ticket',
    remoteMessage.data as { [key: string]: string | number | object },
    messageId
  );
});

export default listenForMessages;
