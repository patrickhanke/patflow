import messaging from '@react-native-firebase/messaging';

const getFcmToken = async () => {
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
  return token;
};

export default getFcmToken;
