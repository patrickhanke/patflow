import AsyncStorage from '@react-native-async-storage/async-storage';
import getFcmToken from './getFcmToken';
import axios from 'axios';

const verifyFcmToken = async () => {
  const fcm_token = await getFcmToken();
  const session_token = await AsyncStorage.getItem('token');

  console.log('FCM Token:', fcm_token);
  console.log('Session Token:', session_token);

  const client = axios.create({
    baseURL: process.env.SASHIDO_API_URL,
    headers: {
      'X-Parse-Application-Id': process.env.SASHIDO_APP_ID,
      'X-Parse-REST-API-Key': process.env.SASHIDO_REST_KEY,
      'X-Parse-Master-Key': process.env.SASHIDO_MASTER_KEY,
      'X-Parse-Session-Token': session_token,
      'Content-Type': 'application/json'
    }
  });

  try {
    const response = await client.post('/functions/verify-fcm-token', {
      fcm_token,
      session_token
    });
    console.log('FCM Token verified:', response.data);
  } catch (error) {
    console.error('FCM Token verification failed:', error);
  }
};

export default verifyFcmToken;
