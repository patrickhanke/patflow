import AsyncStorage from '@react-native-async-storage/async-storage';

const getData = async (key: string) => {
  let returnValue = '';
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      returnValue = value;
    }
  } catch (e) {
    return null;
  }
  return returnValue;
};

const storeData = async (key: string, storeValue: any) => {
  try {
    await AsyncStorage.setItem(key, storeValue);
  } catch (e) {
    // saving error
    console.log(e);
  }
  return 'success';
};

const userDataHandler = async (
  type: 'read' | 'write',
  key: string,
  value?: any
) => {
  let returnValue: string | null = '';

  if (type === 'read') {
    returnValue = await getData(key);
  }
  if (type === 'write' && value) {
    returnValue = await storeData(key, value);
  }

  return returnValue;
};

export default userDataHandler;
